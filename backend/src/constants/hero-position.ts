export const HERO_TEXT_POSITIONS = [
  'top-left',
  'top',
  'top-center',
  'top-right',
  'left',
  'center-left',
  'center',
  'center-right',
  'right',
  'bottom-left',
  'bottom',
  'bottom-center',
  'bottom-right',
] as const;

export type HeroTextPosition = (typeof HERO_TEXT_POSITIONS)[number];

export const DEFAULT_HERO_TEXT_POSITION: HeroTextPosition = 'center-left';
