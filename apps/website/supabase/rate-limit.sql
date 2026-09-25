-- Run this once in your Supabase project's SQL editor (Project → SQL Editor → New query).
-- Backs the rate limiting in lib/rate-limit.ts for /api/roast.

create table if not exists public.rate_limits (
  key text primary key,
  window_start timestamptz not null default now(),
  count int not null default 0
);

-- Lock the table: with RLS on and no policies, the public (anon) key can't
-- read or reset the counters directly. check_rate_limit still works because
-- it is `security definer` and runs as the table's owner.
alter table public.rate_limits enable row level security;

-- Atomic check-and-increment: one round trip, safe under concurrent requests.
-- Returns true (allowed) if the caller is still within p_max_count for the
-- current window; false if they've hit the limit. Resets the window
-- automatically once p_window_seconds has elapsed since it started.
create or replace function public.check_rate_limit(
  p_key text,
  p_max_count int,
  p_window_seconds int
) returns boolean
language plpgsql
security definer
as $$
declare
  v_count int;
begin
  insert into public.rate_limits (key, window_start, count)
  values (p_key, now(), 1)
  on conflict (key) do update
    set
      count = case
        when now() - rate_limits.window_start > (p_window_seconds || ' seconds')::interval
          then 1
        else rate_limits.count + 1
      end,
      window_start = case
        when now() - rate_limits.window_start > (p_window_seconds || ' seconds')::interval
          then now()
        else rate_limits.window_start
      end
  returning count into v_count;

  return v_count <= p_max_count;
end;
$$;

-- Read-only: how many uses are left in the current window, and when it
-- resets. Lets the site show "1 of 2 reviews left today" without using one.
create or replace function public.rate_limit_status(
  p_key text,
  p_max_count int,
  p_window_seconds int
) returns table (remaining int, resets_at timestamptz)
language sql
security definer
stable
as $$
  select
    case
      when r.key is null or now() - r.window_start > (p_window_seconds || ' seconds')::interval
        then p_max_count
      else greatest(p_max_count - r.count, 0)
    end,
    case
      when r.key is null or now() - r.window_start > (p_window_seconds || ' seconds')::interval
        then null
      else r.window_start + (p_window_seconds || ' seconds')::interval
    end
  from (select 1) as one
  left join public.rate_limits r on r.key = p_key;
$$;

-- Private log of every Second Opinion attempt, for the site owner. RLS on
-- with no policies: only the server's secret key can read or write it.
create table if not exists public.review_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  outcome text not null,
  input_type text,
  input text,
  score int,
  verdict text,
  review jsonb,
  ip text,
  country text,
  city text,
  user_agent text
);
alter table public.review_log enable row level security;

-- The only way in: the site calls this with its publishable key. It can add
-- a row but never read one back.
create or replace function public.log_review(p_entry jsonb) returns void
language sql
security definer
as $$
  insert into public.review_log
    (outcome, input_type, input, score, verdict, review, ip, country, city, user_agent)
  values (
    left(p_entry->>'outcome', 40),
    left(p_entry->>'input_type', 10),
    left(p_entry->>'input', 6000),
    (p_entry->>'score')::int,
    left(p_entry->>'verdict', 500),
    p_entry->'review',
    left(p_entry->>'ip', 100),
    left(p_entry->>'country', 10),
    left(p_entry->>'city', 100),
    left(p_entry->>'user_agent', 500)
  );
$$;

-- Private record of key visitor actions (resume downloads, LinkedIn visits),
-- written server-side so ad blockers don't hide them. Same lock as above.
create table if not exists public.event_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  event text not null,
  source text,
  referrer text,
  ip text,
  country text,
  city text,
  user_agent text
);
alter table public.event_log enable row level security;

create or replace function public.log_event(p_entry jsonb) returns void
language sql
security definer
as $$
  insert into public.event_log (event, source, referrer, ip, country, city, user_agent)
  values (
    left(p_entry->>'event', 40),
    left(p_entry->>'source', 40),
    left(p_entry->>'referrer', 300),
    left(p_entry->>'ip', 100),
    left(p_entry->>'country', 10),
    left(p_entry->>'city', 100),
    left(p_entry->>'user_agent', 500)
  );
$$;

-- Optional, worth adding once this is live: a daily cleanup of stale rows so
-- the table doesn't grow forever. Requires the pg_cron extension (enable it
-- under Database → Extensions), then:
--
-- select cron.schedule(
--   'rate_limits_cleanup',
--   '0 3 * * *',
--   $$ delete from public.rate_limits where window_start < now() - interval '2 days' $$
-- );
