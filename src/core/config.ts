export const GAME_CONFIG = {
  title: 'THE LAST QUERY',
  width: 960,
  height: 540,
  panelWidth: 320,
  worldWidth: 640,
  worldCenterX: 320,
  uiStartX: 640,
  uiCenterX: 800,
  backgroundColor: '#090d15',
  worldInset: 15,
} as const

export const PLAYER_TUNING = {
  initialHp: 100,
  moveSpeed: 190,
  attackCooldownMs: 260,
  attackRadius: 54,
} as const

export const ENEMY_TUNING = {
  spawnDelayMs: 1250,
  minSpeed: 60,
  maxSpeed: 110,
  contactDamage: 8,
  touchCooldownMs: 450,
  killScore: 12,
} as const

export const SCORE_TUNING = {
  survivalPointsPer100ms: 1,
} as const

export const DROP_RATES = {
  defaultPickupChance: 0.24,
} as const

export const BUFF_DURATIONS = {
  speedBoostMs: 8000,
  damageBoostMs: 10000,
  invulnerabilityMs: 3000,
  damageReductionMs: 9000,
  slashRadiusBoostMs: 9000,
} as const
