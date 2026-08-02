// Centralized design tokens for a clean, modern mobile aesthetic
// (card-based layout, rounded corners, fresh green palette).

export const colors = {
  bg: '#F4F6F5',
  card: '#FFFFFF',
  primary: '#2E9E6B', // fresh green
  primaryDark: '#1F7A50',
  primarySoft: '#E4F4EC',
  text: '#16211C',
  textMuted: '#6B7770',
  border: '#E7ECE9',
  danger: '#E5484D',
  dangerSoft: '#FDE8E8',
  accent: '#F4A63B',
  white: '#FFFFFF',
  shadow: '#0B231A',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const typography = {
  title: { fontSize: 28, fontWeight: '800' as const, color: colors.text },
  subtitle: { fontSize: 15, fontWeight: '500' as const, color: colors.textMuted },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  itemName: { fontSize: 16, fontWeight: '700' as const, color: colors.text },
  itemMeta: { fontSize: 13, fontWeight: '500' as const, color: colors.textMuted },
  button: { fontSize: 16, fontWeight: '700' as const, color: colors.white },
};

export const shadow = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  fab: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
};
