export const colors = {
  bg: '#0B1B2B',
  card: '#13293F',
  text: '#F2F7FB',
  muted: '#8FA8BF',
  accent: '#00C2D1',
  warn: '#FFB547',
  success: '#4ADE80',
  border: '#1F3A55',
};

export const statusColor = {
  wishlist: colors.muted,
  learning: colors.warn,
  landed: colors.accent,
  mastered: colors.success,
} as const;
