// Core domain types for the pantry tracker.
// The FoodItem model intentionally carries a few "future" fields
// (expiryDate, lowStockThreshold, barcode) so upcoming features
// (expiry alerts, shopping list, barcode scanning) can be added
// without a schema migration. Only name/quantity/category/location
// are surfaced in the MVP UI.

export type StorageLocation = 'Fridge' | 'Freezer' | 'Pantry';

export interface Category {
  id: string;
  label: string;
  emoji: string;
}

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string; // e.g. "pcs", "kg", "L" — defaults to "pcs"
  categoryId: string;
  location: StorageLocation;
  note?: string | null;

  // --- Reserved for future features (not used in MVP UI) ---
  expiryDate?: string | null; // ISO 8601 date string
  lowStockThreshold?: number | null; // for shopping-list auto-flagging
  barcode?: string | null; // for barcode scanning

  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

// Payload used when creating/updating from the form.
export interface FoodItemInput {
  name: string;
  quantity: number;
  unit: string;
  categoryId: string;
  location: StorageLocation;
  note?: string | null;
  expiryDate?: string | null;
  lowStockThreshold?: number | null;
  barcode?: string | null;
}
