import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  decimal,
  date,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core'

// One row per authenticated user — identified by Google sub (userId)
export const households = pgTable('households', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').unique(),
  name: text('name').notNull().default('My Household'),
  primaryGoal: text('primary_goal').notNull().default('balanced'),
  mealsPerDay: integer('meals_per_day').notNull().default(3),
  cuisinePreferences: text('cuisine_preferences').array().notNull().default([]),
  additionalInstructions: text('additional_instructions'),
  planStartDate: text('plan_start_date'),
  planStartMeal: text('plan_start_meal'),
  setupComplete: boolean('setup_complete').notNull().default(false),
  setupDate: timestamp('setup_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const members = pgTable('members', {
  id: text('id').primaryKey(),
  householdId: uuid('household_id')
    .notNull()
    .references(() => households.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  age: text('age').notNull().default(''),
  dietType: text('diet_type').notNull().default('non-veg'),
  spiceLevel: integer('spice_level').notNull().default(3),
  allergies: text('allergies').array().notNull().default([]),
  likes: text('likes').array().notNull().default([]),
  dislikes: text('dislikes').array().notNull().default([]),
  healthGoals: text('health_goals').array().notNull().default([]),
})

export const pantryItems = pgTable('pantry_items', {
  id: text('id').primaryKey(),
  householdId: uuid('household_id')
    .notNull()
    .references(() => households.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 3 }).notNull().default('0'),
  unit: text('unit').notNull(),
  expiryDate: date('expiry_date'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

// Stores full AI-generated meal plans as JSONB (days + grocery list)
export const mealPlans = pgTable('meal_plans', {
  id: text('id').primaryKey(),
  householdId: uuid('household_id')
    .notNull()
    .references(() => households.id, { onDelete: 'cascade' }),
  generatedAt: timestamp('generated_at', { withTimezone: true }).notNull(),
  weekLabel: text('week_label').notNull(),
  days: jsonb('days').notNull(),
  groceryList: jsonb('grocery_list').notNull().default([]),
  isCurrent: boolean('is_current').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
