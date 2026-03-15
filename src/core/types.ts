import { BOSS_IDS, ENEMY_IDS, PICKUP_IDS } from './constants'

export type EnemyKind = (typeof ENEMY_IDS)[keyof typeof ENEMY_IDS]
export type PickupId = (typeof PICKUP_IDS)[keyof typeof PICKUP_IDS]
export type BossId = (typeof BOSS_IDS)[keyof typeof BOSS_IDS]

export type BuffId =
  | 'speedBoost'
  | 'damageBoost'
  | 'invulnerability'
  | 'nextHitMassive'
  | 'damageReduction'
  | 'slashRadiusBoost'

export type DamagePacket = {
  source: 'player' | 'enemy' | 'event'
  amount: number
  isCritical?: boolean
}

export type ActiveBuff = {
  id: BuffId
  endsAt: number
}

export type GameStateSnapshot = {
  hp: number
  maxHp: number
  score: number
  elapsedMs: number
  buffs: ActiveBuff[]
  difficultyTier: number
  gameOver: boolean
}
