export type DietType = 'veg' | 'non-veg' | 'vegan' | 'eggetarian' | 'pescatarian'
export type SpiceLevel = 1 | 2 | 3 | 4 | 5
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type HealthGoal = 'weight-loss' | 'muscle-gain' | 'balanced' | 'high-protein' | 'low-carb' | 'heart-healthy'

export interface Member {
  id: string
  name: string
  age: string
  dietType: DietType
  allergies: string[]
  likes: string[]
  dislikes: string[]
  spiceLevel: SpiceLevel
  healthGoals: HealthGoal[]
}

export interface PantryItem {
  id: string
  name: string
  quantity: number
  unit: string
  expiryDate?: string
}

export interface UserPreferences {
  householdName: string
  members: Member[]
  cuisinePreferences: string[]
  pantryItems: PantryItem[]
  primaryGoal: HealthGoal
  mealsPerDay: 2 | 3 | 4
  additionalInstructions?: string
  planStartDate?: string    // ISO date, first day of the plan
  planStartMeal?: 'breakfast' | 'lunch' | 'dinner' // first meal of Day 1
  setupComplete: boolean
  setupDate: string
}

export interface PantryAlert {
  type: 'low-stock' | 'expiring-soon' | 'expired'
  item: PantryItem
  message: string
}

export interface Macros {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
}

export interface Micros {
  vitaminA?: number
  vitaminC?: number
  vitaminD?: number
  vitaminB12?: number
  iron?: number
  calcium?: number
  potassium?: number
  sodium?: number
  zinc?: number
  magnesium?: number
  folate?: number
  omega3?: number
}

export interface Nutrition {
  macros: Macros
  micros: Micros
}

export interface Meal {
  id: string
  name: string
  type: MealType
  cuisine: string
  dietTypes: DietType[]
  prepTime: number
  cookTime: number
  servings: number
  description: string
  ingredients: Ingredient[]
  healthGoals: HealthGoal[]
  spiceLevel: SpiceLevel
  nutrition: Nutrition
  allergens: string[]
  sides?: string         // e.g. "Serve with 8 rotis (3 per adult, 2 for child)"
  instructions?: string[] // step-by-step cooking steps
  /** @deprecated use nutrition.macros.calories */
  calories?: number
  /** @deprecated use nutrition.macros.protein */
  protein?: number
}

export interface Ingredient {
  name: string
  quantity: string
  unit: string
  category: GroceryCategory
}

export type GroceryCategory =
  | 'produce'
  | 'dairy'
  | 'meat-seafood'
  | 'grains-legumes'
  | 'spices-condiments'
  | 'oils-fats'
  | 'beverages'
  | 'frozen'
  | 'canned'
  | 'other'

export interface DayMeals {
  breakfast: Meal
  lunch: Meal
  dinner: Meal
  snack?: Meal
}

export interface DayPlan {
  dayIndex: number
  dayName: string
  date?: string          // ISO date e.g. "2024-06-24"
  meals: DayMeals
  prepNotes?: string[]   // e.g. ["Soak chickpeas tonight for tomorrow's lunch"]
}

export interface GroceryItem {
  ingredientName: string
  quantity: string
  unit: string
  category: GroceryCategory
  meals: string[]
}

export interface MealPlan {
  id: string
  generatedAt: string
  weekLabel: string
  startDate?: string     // ISO date for day 0 of this plan
  days: DayPlan[]
  groceryList: GroceryItem[]
  extended?: boolean
}

export const CUISINES = [
  'Indian',
  'Italian',
  'Mexican',
  'Chinese',
  'Mediterranean',
  'American',
  'Japanese',
  'Thai',
  'Middle Eastern',
  'Korean',
  'French',
  'Greek',
] as const

export const COMMON_ALLERGENS = [
  'Gluten',
  'Dairy',
  'Eggs',
  'Nuts',
  'Peanuts',
  'Soy',
  'Shellfish',
  'Fish',
  'Sesame',
]

export const COMMON_PANTRY_ITEMS = [
  'Rice',
  'Pasta',
  'Flour',
  'Lentils',
  'Chickpeas',
  'Olive oil',
  'Vegetable oil',
  'Salt',
  'Black pepper',
  'Cumin',
  'Coriander',
  'Turmeric',
  'Garlic',
  'Onions',
  'Tomatoes',
  'Potatoes',
  'Sugar',
  'Soy sauce',
  'Vinegar',
  'Canned tomatoes',
  'Oats',
  'Bread',
  'Butter',
  'Eggs',
]

export const HEALTH_GOAL_LABELS: Record<HealthGoal, string> = {
  'weight-loss': 'Weight Loss',
  'muscle-gain': 'Muscle Gain',
  balanced: 'Balanced Nutrition',
  'high-protein': 'High Protein',
  'low-carb': 'Low Carb',
  'heart-healthy': 'Heart Healthy',
}

export const DIET_TYPE_LABELS: Record<DietType, string> = {
  veg: 'Vegetarian',
  'non-veg': 'Non-Vegetarian',
  vegan: 'Vegan',
  eggetarian: 'Eggetarian',
  pescatarian: 'Pescatarian',
}

export const SPICE_LABELS: Record<SpiceLevel, string> = {
  1: 'Mild',
  2: 'Light',
  3: 'Medium',
  4: 'Hot',
  5: 'Very Hot',
}

export const LOW_STOCK_THRESHOLD = 0.2
export const EXPIRY_WARNING_DAYS = 3
