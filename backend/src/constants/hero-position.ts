export const HERO_TEXT_POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'center-left',
  'center',
  'center-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const;

export type HeroTextPosition = (typeof HERO_TEXT_POSITIONS)[number];

export const DEFAULT_HERO_TEXT_POSITION: HeroTextPosition = 'center-left';
