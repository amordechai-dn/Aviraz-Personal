import { Category, StorageLocation } from './types';

// Familiar grocery categories, each with an emoji icon (à la NoWaste / KitchenPal).
export const CATEGORIES: Category[] = [
  { id: 'produce', label: 'Produce', emoji: '🥦' },
  { id: 'fruit', label: 'Fruit', emoji: '🍎' },
  { id: 'dairy', label: 'Dairy & Eggs', emoji: '🧀' },
  { id: 'meat', label: 'Meat & Fish', emoji: '🥩' },
  { id: 'bakery', label: 'Bakery', emoji: '🍞' },
  { id: 'dry', label: 'Canned & Dry', emoji: '🥫' },
  { id: 'frozen', label: 'Frozen', emoji: '🧊' },
  { id: 'drinks', label: 'Drinks', emoji: '🥤' },
  { id: 'snacks', label: 'Snacks', emoji: '🍫' },
  { id: 'condiments', label: 'Condiments', emoji: '🧂' },
  { id: 'other', label: 'Other', emoji: '🍽️' },
];

export const CATEGORY_BY_ID: Record<string, Category> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<string, Category>
);

export function getCategory(id: string): Category {
  return CATEGORY_BY_ID[id] ?? CATEGORIES[CATEGORIES.length - 1];
}

export interface LocationMeta {
  id: StorageLocation;
  label: string;
  emoji: string;
}

// Storage locations used to group the list (Fridge / Freezer / Pantry).
export const LOCATIONS: LocationMeta[] = [
  { id: 'Fridge', label: 'Fridge', emoji: '🧊' },
  { id: 'Freezer', label: 'Freezer', emoji: '❄️' },
  { id: 'Pantry', label: 'Pantry', emoji: '🗄️' },
];

export const LOCATION_BY_ID: Record<StorageLocation, LocationMeta> =
  LOCATIONS.reduce((acc, l) => {
    acc[l.id] = l;
    return acc;
  }, {} as Record<StorageLocation, LocationMeta>);

// Common units offered in the form.
export const UNITS: string[] = ['pcs', 'pack', 'kg', 'g', 'L', 'ml', 'box', 'can'];

export const DEFAULT_UNIT = 'pcs';
