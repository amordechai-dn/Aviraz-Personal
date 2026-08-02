# Pantry Tracker 🧺

A simple, offline Android app to track the food and groceries you have at home —
grouped by where you store it (Fridge / Freezer / Pantry). Built with
**Expo + React Native + TypeScript** and **expo-sqlite** for fully local storage
(no backend, no account).

## Features (MVP)

- **Add / edit / delete food items** with name, quantity, unit, category and location.
- **Grouped list** by storage location (Fridge, Freezer, Pantry) with clean cards.
- **Emoji category icons** (Produce, Dairy, Meat, Frozen, …).
- **+ / − quantity steppers** right on each card, with an "Out" badge at zero.
- **Floating + button** to add items via a bottom-sheet form.
- **Long-press a card** (or the Delete button in the edit sheet) to remove an item.
- **Friendly empty state** when the pantry is empty.
- **Local persistence** — everything is stored on-device in SQLite.
- **English / Hebrew** with full **right-to-left** layout support for Hebrew.

## Language & RTL

- Tap the **🌐 language button** in the top corner of the home screen and pick
  **English** or **עברית**.
- The choice is **persisted** (AsyncStorage, key `settings.language`) and
  survives restarts. On first launch the app defaults to the **device locale**,
  falling back to English.
- Selecting Hebrew flips the whole UI to **RTL** via `I18nManager.forceRTL`.
  Because RTL only takes visual effect after a reload, the app prompts to
  **reload now** (using Fast Refresh in dev / `expo-updates` in production) and
  gracefully falls back to a "close and reopen" notice if a programmatic reload
  isn't available.
- All translations live in a single typed dictionary
  (`src/i18n/translations.ts`); the `Translations` interface forces English and
  Hebrew to stay in parity. Hebrew strings are hand-written (native quality),
  not machine-translated.

## Data model

Items live in a single `food_items` SQLite table. The schema already includes
columns for features planned next — `expiry_date`, `low_stock_threshold`,
`barcode` — so expiry alerts, a shopping list, search/filter and barcode
scanning can be added without a migration.

## Project structure

```
pantry-tracker/
├── App.tsx                     # Entry point
└── src/
    ├── types.ts                # FoodItem model
    ├── constants.ts            # Categories, locations, units
    ├── theme.ts                # Colors, spacing, radii, typography
    ├── db/database.ts          # SQLite schema + CRUD repository
    ├── hooks/usePantry.ts      # State + repository glue
    ├── i18n/
    │   ├── translations.ts     # Typed en/he dictionary
    │   └── index.tsx           # I18nProvider: persistence, locale, RTL, reload
    ├── components/
    │   ├── ItemCard.tsx
    │   ├── QuantityStepper.tsx
    │   ├── ItemFormModal.tsx   # Add/edit bottom sheet
    │   ├── LanguageModal.tsx   # Language selector
    │   ├── Fab.tsx
    │   └── EmptyState.tsx
    └── screens/HomeScreen.tsx  # Grouped list + FAB + language button
```

## Running it

> Node.js is required (already installed via Homebrew on this machine).

```bash
cd pantry-tracker
npm start          # starts the Expo dev server + QR code
```

Then choose one of:

- **On a physical Android phone (easiest):** install the free **Expo Go** app
  from the Play Store, open it, and scan the QR code shown in the terminal.
- **On an Android emulator:** install Android Studio + an emulator, then run
  `npm run android`.

### Verifying the build without a device

```bash
npx tsc --noEmit                              # type check
npx expo export --platform android            # bundle smoke test
```

Both currently pass.

## Next feature ideas (not built yet)

- Expiry dates + "expiring soon" highlighting.
- Low-stock threshold → auto shopping list.
- Search & filter by name / category.
- Barcode scanning to add items quickly.
