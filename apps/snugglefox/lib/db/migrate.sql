-- Run this once in Neon's SQL Editor to create all tables

CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  user_id TEXT,
  child_name TEXT NOT NULL,
  gender TEXT NOT NULL DEFAULT 'boy',
  age_band TEXT NOT NULL,
  prompt TEXT NOT NULL,
  length_key TEXT NOT NULL,
  delivery_mode TEXT NOT NULL,
  voice_key TEXT,
  title TEXT NOT NULL,
  story_text TEXT NOT NULL,
  audio_status TEXT NOT NULL DEFAULT 'none',
  audio_duration_sec INTEGER,
  story_model TEXT NOT NULL,
  tts_model TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Home-screen history query: recent stories for a device
CREATE INDEX IF NOT EXISTS idx_stories_device_created
  ON stories (device_id, created_at DESC);

-- Upgrade for databases created before the gender column existed
ALTER TABLE stories ADD COLUMN IF NOT EXISTS gender TEXT NOT NULL DEFAULT 'boy';
