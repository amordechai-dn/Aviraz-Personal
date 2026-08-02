import * as SQLite from 'expo-sqlite';
import { FoodItem, FoodItemInput } from '../types';
import { DEFAULT_UNIT } from '../constants';

// Single shared connection.
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

const DB_NAME = 'pantry.db';

function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
}

/**
 * Create the schema if needed. The table includes columns for features
 * we haven't built yet (expiry_date, low_stock_threshold, barcode) so
 * they can be enabled later without a migration.
 */
export async function initDatabase(): Promise<void> {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS food_items (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      quantity REAL NOT NULL DEFAULT 1,
      unit TEXT NOT NULL DEFAULT 'pcs',
      category_id TEXT NOT NULL DEFAULT 'other',
      location TEXT NOT NULL DEFAULT 'Pantry',
      note TEXT,
      expiry_date TEXT,
      low_stock_threshold REAL,
      barcode TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_food_items_location ON food_items(location);
    CREATE INDEX IF NOT EXISTS idx_food_items_category ON food_items(category_id);
  `);
}

interface Row {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category_id: string;
  location: string;
  note: string | null;
  expiry_date: string | null;
  low_stock_threshold: number | null;
  barcode: string | null;
  created_at: string;
  updated_at: string;
}

function rowToItem(r: Row): FoodItem {
  return {
    id: r.id,
    name: r.name,
    quantity: r.quantity,
    unit: r.unit,
    categoryId: r.category_id,
    location: r.location as FoodItem['location'],
    note: r.note,
    expiryDate: r.expiry_date,
    lowStockThreshold: r.low_stock_threshold,
    barcode: r.barcode,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function newId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  );
}

export async function getAllItems(): Promise<FoodItem[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Row>(
    'SELECT * FROM food_items ORDER BY name COLLATE NOCASE ASC'
  );
  return rows.map(rowToItem);
}

export async function createItem(input: FoodItemInput): Promise<FoodItem> {
  const db = await getDb();
  const now = new Date().toISOString();
  const item: FoodItem = {
    id: newId(),
    name: input.name.trim(),
    quantity: input.quantity,
    unit: input.unit || DEFAULT_UNIT,
    categoryId: input.categoryId,
    location: input.location,
    note: input.note ?? null,
    expiryDate: input.expiryDate ?? null,
    lowStockThreshold: input.lowStockThreshold ?? null,
    barcode: input.barcode ?? null,
    createdAt: now,
    updatedAt: now,
  };
  await db.runAsync(
    `INSERT INTO food_items
       (id, name, quantity, unit, category_id, location, note,
        expiry_date, low_stock_threshold, barcode, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      item.id,
      item.name,
      item.quantity,
      item.unit,
      item.categoryId,
      item.location,
      item.note ?? null,
      item.expiryDate ?? null,
      item.lowStockThreshold ?? null,
      item.barcode ?? null,
      item.createdAt,
      item.updatedAt,
    ]
  );
  return item;
}

export async function updateItem(
  id: string,
  input: FoodItemInput
): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.runAsync(
    `UPDATE food_items SET
       name = ?, quantity = ?, unit = ?, category_id = ?, location = ?,
       note = ?, expiry_date = ?, low_stock_threshold = ?, barcode = ?,
       updated_at = ?
     WHERE id = ?`,
    [
      input.name.trim(),
      input.quantity,
      input.unit || DEFAULT_UNIT,
      input.categoryId,
      input.location,
      input.note ?? null,
      input.expiryDate ?? null,
      input.lowStockThreshold ?? null,
      input.barcode ?? null,
      now,
      id,
    ]
  );
}

/** Update just the quantity (used by the +/- steppers). */
export async function setQuantity(
  id: string,
  quantity: number
): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE food_items SET quantity = ?, updated_at = ? WHERE id = ?',
    [Math.max(0, quantity), new Date().toISOString(), id]
  );
}

export async function deleteItem(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM food_items WHERE id = ?', [id]);
}
