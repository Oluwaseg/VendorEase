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

export const HERO_TEXT_POSITION_LABELS: Record<HeroTextPosition, string> = {
  'top-left': 'Top left',
  top: 'Top',
  'top-center': 'Top center',
  'top-right': 'Top right',
  left: 'Left',
  'center-left': 'Center left',
  center: 'Center',
  'center-right': 'Center right',
  right: 'Right',
  'bottom-left': 'Bottom left',
  bottom: 'Bottom',
  'bottom-center': 'Bottom center',
  'bottom-right': 'Bottom right',
};
