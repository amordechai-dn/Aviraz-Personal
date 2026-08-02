import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DevSettings, I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import {
  dictionaries,
  isRtlLang,
  Lang,
  Translations,
} from './translations';

const LANG_KEY = 'settings.language';
const APPLIED_RTL_KEY = 'settings.appliedRtl';

type Vars = Record<string, string | number>;

// Resolve a dotted key path (e.g. "form.name") against a dictionary and
// interpolate {{vars}}.
function translate(dict: Translations, path: string, vars?: Vars): string {
  const value = path
    .split('.')
    .reduce<unknown>((acc, part) => {
      if (acc && typeof acc === 'object' && part in (acc as object)) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, dict);

  if (typeof value !== 'string') return path; // fall back to key
  if (!vars) return value;
  return Object.keys(vars).reduce(
    (str, key) => str.replace(new RegExp(`{{${key}}}`, 'g'), String(vars[key])),
    value
  );
}

async function reloadApp(): Promise<boolean> {
  // Dev: Fast Refresh reload. Prod: expo-updates. Returns false if neither
  // is available so the caller can show a manual-restart notice.
  try {
    if (__DEV__ && DevSettings?.reload) {
      DevSettings.reload();
      return true;
    }
  } catch {
    // ignore, try expo-updates next
  }
  try {
    // Lazy require so a missing/unconfigured module doesn't crash at import.
    const Updates = require('expo-updates');
    if (Updates?.reloadAsync) {
      await Updates.reloadAsync();
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

/** Sync native RTL flags to the desired language. Returns true if a reload
 *  is required for the change to take visual effect. */
function applyRtl(lang: Lang): boolean {
  const shouldRTL = isRtlLang(lang);
  I18nManager.allowRTL(shouldRTL);
  if (I18nManager.isRTL !== shouldRTL) {
    I18nManager.forceRTL(shouldRTL);
    return true;
  }
  return false;
}

function detectInitialLang(): Lang {
  try {
    const locales = Localization.getLocales();
    const code = locales?.[0]?.languageCode?.toLowerCase();
    if (code === 'he' || code === 'iw') return 'he'; // "iw" is legacy Hebrew code
  } catch {
    // ignore
  }
  return 'en';
}

interface I18nContextValue {
  ready: boolean;
  lang: Lang;
  isRTL: boolean;
  t: (path: string, vars?: Vars) => string;
  /** Change language + persist. Returns whether an app reload is needed. */
  setLanguage: (lang: Lang) => Promise<boolean>;
  reload: () => Promise<boolean>;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    let mounted = true;
    (async () => {
      let chosen: Lang = 'en';
      try {
        const stored = await AsyncStorage.getItem(LANG_KEY);
        chosen = stored === 'en' || stored === 'he' ? stored : detectInitialLang();
      } catch {
        chosen = detectInitialLang();
      }

      // Ensure native direction matches. On first launch this may require a
      // one-time reload; guard with a persisted flag to avoid reload loops in
      // environments where forceRTL doesn't survive a JS-only reload.
      const desiredRtl = isRtlLang(chosen);
      if (I18nManager.isRTL !== desiredRtl) {
        applyRtl(chosen);
        try {
          const applied = await AsyncStorage.getItem(APPLIED_RTL_KEY);
          if (applied !== String(desiredRtl)) {
            await AsyncStorage.setItem(APPLIED_RTL_KEY, String(desiredRtl));
            if (mounted) setLang(chosen);
            const reloaded = await reloadApp();
            if (reloaded) return; // app is restarting
          }
        } catch {
          // ignore and fall through
        }
      }

      if (mounted) {
        setLang(chosen);
        setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const setLanguage = useCallback(async (next: Lang): Promise<boolean> => {
    setLang(next); // update text immediately
    try {
      await AsyncStorage.setItem(LANG_KEY, next);
    } catch {
      // non-fatal
    }
    const needsReload = applyRtl(next);
    if (needsReload) {
      try {
        await AsyncStorage.setItem(APPLIED_RTL_KEY, String(isRtlLang(next)));
      } catch {
        // ignore
      }
    }
    return needsReload;
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const dict = dictionaries[lang];
    return {
      ready,
      lang,
      isRTL: isRtlLang(lang),
      t: (path: string, vars?: Vars) => translate(dict, path, vars),
      setLanguage,
      reload: reloadApp,
    };
  }, [lang, ready, setLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider');
  return ctx;
}
