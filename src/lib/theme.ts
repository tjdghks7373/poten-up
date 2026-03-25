export const theme = {
  colors: {
    bg: "#faf9f7",
    fg: "#1a1a1a",
    brand: "#1e3a5f",
    brandLight: "#2d5a8e",
    accent: "#c8a96e",
    muted: "#6b7280",
    border: "#e5e0d8",
    white: "#ffffff",
  },
  fonts: {
    sans: '"Pretendard", "맑은 고딕", "Malgun Gothic", "Apple Gothic", sans-serif, system-ui',
  },
  maxWidth: "1152px",
} as const;

export type Theme = typeof theme;
