export const theme = {
  colors: {
    bg: "var(--color-bg)",
    fg: "var(--color-fg)",
    brand: "var(--color-brand)",
    brandLight: "var(--color-brand-light)",
    accent: "var(--color-accent)",
    muted: "var(--color-muted)",
    border: "var(--color-border)",
    white: "var(--color-white)",
  },
  fonts: {
    sans: '"Pretendard", "맑은 고딕", "Malgun Gothic", "Apple Gothic", sans-serif, system-ui',
  },
  maxWidth: "1152px",
} as const;

export type Theme = typeof theme;
