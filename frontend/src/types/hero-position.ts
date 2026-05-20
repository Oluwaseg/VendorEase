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

export const HERO_TEXT_POSITION_LABELS: Record<HeroTextPosition, string> = {
  'top-left': 'Top left',
  'top-center': 'Top center',
  'top-right': 'Top right',
  'center-left': 'Center left',
  center: 'Center',
  'center-right': 'Center right',
  'bottom-left': 'Bottom left',
  'bottom-center': 'Bottom center',
  'bottom-right': 'Bottom right',
};
