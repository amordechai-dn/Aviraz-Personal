import { useCallback, useEffect, useState } from 'react';
import { FoodItem, FoodItemInput } from '../types';
import * as db from '../db/database';

interface PantryState {
  items: FoodItem[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  addItem: (input: FoodItemInput) => Promise<void>;
  editItem: (id: string, input: FoodItemInput) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  changeQuantity: (id: string, next: number) => Promise<void>;
}

/**
 * Owns all pantry state and mediates between the UI and the SQLite
 * repository. Quantity changes update optimistically for a snappy feel.
 */
export function usePantry(): PantryState {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const all = await db.getAllItems();
      setItems(all);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load items');
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await db.initDatabase();
        const all = await db.getAllItems();
        if (mounted) setItems(all);
      } catch (e) {
        if (mounted) {
          setError(e instanceof Error ? e.message : 'Failed to open database');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const addItem = useCallback(
    async (input: FoodItemInput) => {
      const created = await db.createItem(input);
      setItems((prev) =>
        [...prev, created].sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        )
      );
    },
    []
  );

  const editItem = useCallback(async (id: string, input: FoodItemInput) => {
    await db.updateItem(id, input);
    await reload();
  }, [reload]);

  const removeItem = useCallback(async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id)); // optimistic
    try {
      await db.deleteItem(id);
    } catch {
      await reload(); // revert on failure
    }
  }, [reload]);

  const changeQuantity = useCallback(async (id: string, next: number) => {
    const clamped = Math.max(0, next);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: clamped } : i))
    );
    try {
      await db.setQuantity(id, clamped);
    } catch {
      await reload();
    }
  }, [reload]);

  return {
    items,
    loading,
    error,
    reload,
    addItem,
    editItem,
    removeItem,
    changeQuantity,
  };
}
