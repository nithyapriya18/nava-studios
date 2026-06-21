-- Run this once in Neon's SQL Editor to create all tables

CREATE TABLE IF NOT EXISTS households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'My Household',
  primary_goal TEXT NOT NULL DEFAULT 'balanced',
  meals_per_day INTEGER NOT NULL DEFAULT 3,
  cuisine_preferences TEXT[] NOT NULL DEFAULT '{}',
  additional_instructions TEXT,
  setup_complete BOOLEAN NOT NULL DEFAULT FALSE,
  setup_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age TEXT NOT NULL DEFAULT '',
  diet_type TEXT NOT NULL DEFAULT 'non-veg',
  spice_level INTEGER NOT NULL DEFAULT 3,
  allergies TEXT[] NOT NULL DEFAULT '{}',
  likes TEXT[] NOT NULL DEFAULT '{}',
  dislikes TEXT[] NOT NULL DEFAULT '{}',
  health_goals TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS pantry_items (
  id TEXT PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity DECIMAL(10,3) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  expiry_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meal_plans (
  id TEXT PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  generated_at TIMESTAMPTZ NOT NULL,
  week_label TEXT NOT NULL,
  days JSONB NOT NULL,
  grocery_list JSONB NOT NULL DEFAULT '[]',
  is_current BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add user_id to households (run this if table already exists)
ALTER TABLE households ADD COLUMN IF NOT EXISTS user_id TEXT UNIQUE;
-- Add plan_start_date column
ALTER TABLE households ADD COLUMN IF NOT EXISTS plan_start_date TEXT;

-- Index for fast household lookups
CREATE INDEX IF NOT EXISTS idx_members_household ON members(household_id);
CREATE INDEX IF NOT EXISTS idx_pantry_household ON pantry_items(household_id);
CREATE INDEX IF NOT EXISTS idx_plans_household ON meal_plans(household_id);
CREATE INDEX IF NOT EXISTS idx_plans_current ON meal_plans(household_id, is_current);
CREATE INDEX IF NOT EXISTS idx_households_user ON households(user_id);
