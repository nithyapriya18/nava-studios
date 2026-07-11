import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import type { AgeBand, AudioStatus, DeliveryMode, Gender, LengthKey, VoiceKey } from '@/lib/types'

// One row per generated story. No auth in v1 — rows are tagged with an
// anonymous deviceId; user_id is a nullable seam for a future auth upgrade.
export const stories = pgTable(
  'stories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    deviceId: text('device_id').notNull(),
    userId: text('user_id'),
    childName: text('child_name').notNull(),
    // default covers rows created before the column existed
    gender: text('gender').$type<Gender>().notNull().default('boy'),
    ageBand: text('age_band').$type<AgeBand>().notNull(),
    prompt: text('prompt').notNull(),
    lengthKey: text('length_key').$type<LengthKey>().notNull(),
    deliveryMode: text('delivery_mode').$type<DeliveryMode>().notNull(),
    voiceKey: text('voice_key').$type<VoiceKey>(),
    title: text('title').notNull(),
    storyText: text('story_text').notNull(),
    audioStatus: text('audio_status').$type<AudioStatus>().notNull().default('none'),
    audioDurationSec: integer('audio_duration_sec'),
    storyModel: text('story_model').notNull(), // provenance: which model actually wrote it
    ttsModel: text('tts_model'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    // Home-screen history: recent stories for a device
    index('idx_stories_device_created').on(table.deviceId, table.createdAt.desc()),
  ],
)
