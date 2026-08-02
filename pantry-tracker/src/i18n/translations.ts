// English + Hebrew translations for every user-facing string.
// The `Translations` interface enforces that both languages define the
// exact same set of keys (missing/typo'd keys fail typecheck).

export type Lang = 'en' | 'he';

export interface Translations {
  app: {
    title: string;
  };
  summary: {
    empty: string;
    items_one: string;
    items_other: string;
    locations_one: string;
    locations_other: string;
    across: string; // uses {{items}} and {{locations}}
  };
  locations: {
    Fridge: string;
    Freezer: string;
    Pantry: string;
  };
  categories: {
    produce: string;
    fruit: string;
    dairy: string;
    meat: string;
    bakery: string;
    dry: string;
    frozen: string;
    drinks: string;
    snacks: string;
    condiments: string;
    other: string;
  };
  units: {
    pcs: string;
    pack: string;
    kg: string;
    g: string;
    L: string;
    ml: string;
    box: string;
    can: string;
  };
  card: {
    out: string;
  };
  fab: {
    add: string;
  };
  empty: {
    title: string;
    body: string;
  };
  form: {
    addTitle: string;
    editTitle: string;
    name: string;
    namePlaceholder: string;
    location: string;
    category: string;
    quantity: string;
    note: string;
    notePlaceholder: string;
    delete: string;
    cancel: string;
    save: string;
    create: string;
  };
  deleteConfirm: {
    title: string;
    message: string; // uses {{name}}
    cancel: string;
    confirm: string;
  };
  language: {
    title: string;
    short: string; // short label shown on the header button
    a11y: string;
    english: string;
    hebrew: string;
    restartTitle: string;
    restartMessage: string;
    restartNow: string;
    restartLater: string;
    restartManual: string;
  };
}

const en: Translations = {
  app: {
    title: 'My Pantry',
  },
  summary: {
    empty: 'Nothing tracked yet',
    items_one: '{{count}} item',
    items_other: '{{count}} items',
    locations_one: '{{count}} location',
    locations_other: '{{count}} locations',
    across: '{{items}} across {{locations}}',
  },
  locations: {
    Fridge: 'Fridge',
    Freezer: 'Freezer',
    Pantry: 'Pantry',
  },
  categories: {
    produce: 'Produce',
    fruit: 'Fruit',
    dairy: 'Dairy & Eggs',
    meat: 'Meat & Fish',
    bakery: 'Bakery',
    dry: 'Canned & Dry',
    frozen: 'Frozen',
    drinks: 'Drinks',
    snacks: 'Snacks',
    condiments: 'Condiments',
    other: 'Other',
  },
  units: {
    pcs: 'pcs',
    pack: 'pack',
    kg: 'kg',
    g: 'g',
    L: 'L',
    ml: 'ml',
    box: 'box',
    can: 'can',
  },
  card: {
    out: 'Out',
  },
  fab: {
    add: 'Add item',
  },
  empty: {
    title: 'Your pantry is empty',
    body: 'Tap the + button to add the first item and start tracking the food you have at home.',
  },
  form: {
    addTitle: 'Add item',
    editTitle: 'Edit item',
    name: 'Name',
    namePlaceholder: 'e.g. Milk, Eggs, Tomatoes',
    location: 'Location',
    category: 'Category',
    quantity: 'Quantity',
    note: 'Note (optional)',
    notePlaceholder: 'Brand, size, reminder…',
    delete: 'Delete item',
    cancel: 'Cancel',
    save: 'Save changes',
    create: 'Add to pantry',
  },
  deleteConfirm: {
    title: 'Delete item',
    message: 'Remove “{{name}}” from your pantry?',
    cancel: 'Cancel',
    confirm: 'Delete',
  },
  language: {
    title: 'Language',
    short: 'EN',
    a11y: 'Change language',
    english: 'English',
    hebrew: 'Hebrew',
    restartTitle: 'Restart required',
    restartMessage:
      'The app needs to reload to apply the new language and layout direction.',
    restartNow: 'Reload now',
    restartLater: 'Later',
    restartManual:
      'Please close and reopen the app to finish applying the new language.',
  },
};

const he: Translations = {
  app: {
    title: 'המזווה שלי',
  },
  summary: {
    empty: 'עדיין לא הוספת פריטים',
    items_one: 'פריט אחד',
    items_other: '{{count}} פריטים',
    locations_one: 'מיקום אחד',
    locations_other: '{{count}} מיקומים',
    across: '{{items}} ב-{{locations}}',
  },
  locations: {
    Fridge: 'מקרר',
    Freezer: 'מקפיא',
    Pantry: 'מזווה',
  },
  categories: {
    produce: 'ירקות',
    fruit: 'פירות',
    dairy: 'מוצרי חלב וביצים',
    meat: 'בשר ודגים',
    bakery: 'מאפים',
    dry: 'שימורים ומוצרים יבשים',
    frozen: 'קפואים',
    drinks: 'משקאות',
    snacks: 'חטיפים',
    condiments: 'תבלינים ורטבים',
    other: 'אחר',
  },
  units: {
    pcs: 'יח׳',
    pack: 'חבילה',
    kg: 'ק״ג',
    g: 'גרם',
    L: 'ליטר',
    ml: 'מ״ל',
    box: 'קופסה',
    can: 'פחית',
  },
  card: {
    out: 'אזל',
  },
  fab: {
    add: 'הוספת פריט',
  },
  empty: {
    title: 'המזווה ריק',
    body: 'הקישו על כפתור ה־+ כדי להוסיף את הפריט הראשון ולהתחיל לעקוב אחר המזון שבבית.',
  },
  form: {
    addTitle: 'הוספת פריט',
    editTitle: 'עריכת פריט',
    name: 'שם',
    namePlaceholder: 'לדוגמה: חלב, ביצים, עגבניות',
    location: 'מיקום',
    category: 'קטגוריה',
    quantity: 'כמות',
    note: 'הערה (רשות)',
    notePlaceholder: 'מותג, גודל, תזכורת…',
    delete: 'מחיקת פריט',
    cancel: 'ביטול',
    save: 'שמירת שינויים',
    create: 'הוספה למזווה',
  },
  deleteConfirm: {
    title: 'מחיקת פריט',
    message: 'להסיר את ״{{name}}״ מהמזווה?',
    cancel: 'ביטול',
    confirm: 'מחיקה',
  },
  language: {
    title: 'שפה',
    short: 'עב',
    a11y: 'שינוי שפה',
    english: 'English',
    hebrew: 'עברית',
    restartTitle: 'נדרשת הפעלה מחדש',
    restartMessage: 'האפליקציה תיטען מחדש כדי להחיל את השפה וכיוון הפריסה החדשים.',
    restartNow: 'טעינה מחדש',
    restartLater: 'מאוחר יותר',
    restartManual: 'יש לסגור ולפתוח מחדש את האפליקציה כדי להשלים את החלפת השפה.',
  },
};

export const dictionaries: Record<Lang, Translations> = { en, he };

// Which languages render right-to-left.
export const RTL_LANGS: Lang[] = ['he'];

export function isRtlLang(lang: Lang): boolean {
  return RTL_LANGS.includes(lang);
}
