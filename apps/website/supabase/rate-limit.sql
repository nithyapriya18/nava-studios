-- Run this once in your Supabase project's SQL editor (Project → SQL Editor → New query).
-- Backs the rate limiting in lib/rate-limit.ts for /api/roast.

create table if not exists public.rate_limits (
  key text primary key,
  window_start timestamptz not null default now(),
  count int not null default 0
);

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

-- Optional, worth adding once this is live: a daily cleanup of stale rows so
-- the table doesn't grow forever. Requires the pg_cron extension (enable it
-- under Database → Extensions), then:
--
-- select cron.schedule(
--   'rate_limits_cleanup',
--   '0 3 * * *',
--   $$ delete from public.rate_limits where window_start < now() - interval '2 days' $$
-- );
