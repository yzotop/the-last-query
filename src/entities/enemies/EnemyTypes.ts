import { ENEMY_IDS } from '../../core/constants'
import type { EnemyKind } from '../../core/types'

export type EnemyConfig = {
  kind: EnemyKind
  texture: string
  hp: number
  speed: number
  contactDamage: number
  scoreValue: number
}

export const ENEMY_TYPE_CONFIGS: Record<EnemyKind, EnemyConfig> = {
  [ENEMY_IDS.CI_CD_BOT]: {
    kind: ENEMY_IDS.CI_CD_BOT,
    texture: 'enemy-cicd',
    hp: 1,
    speed: 104,
    contactDamage: 8,
    scoreValue: 12,
  },
  [ENEMY_IDS.ORCHESTRATOR]: {
    kind: ENEMY_IDS.ORCHESTRATOR,
    texture: 'enemy-orchestrator',
    hp: 2,
    speed: 65,
    contactDamage: 10,
    scoreValue: 16,
  },
  [ENEMY_IDS.AUTOMATOR_SWARM]: {
    kind: ENEMY_IDS.AUTOMATOR_SWARM,
    texture: 'enemy-swarm',
    hp: 1,
    speed: 95,
    contactDamage: 6,
    scoreValue: 9,
  },
  [ENEMY_IDS.MEETING_MONSTER]: {
    kind: ENEMY_IDS.MEETING_MONSTER,
    texture: 'enemy-meeting',
    hp: 3,
    speed: 58,
    contactDamage: 12,
    scoreValue: 20,
  },
  [ENEMY_IDS.BURNOUT_GHOST]: {
    kind: ENEMY_IDS.BURNOUT_GHOST,
    texture: 'enemy-burnout',
    hp: 1,
    speed: 88,
    contactDamage: 7,
    scoreValue: 14,
  },
  [ENEMY_IDS.EXCEL_ZOMBIE]: {
    kind: ENEMY_IDS.EXCEL_ZOMBIE,
    texture: 'enemy-excel-zombie',
    hp: 4,
    speed: 52,
    contactDamage: 11,
    scoreValue: 22,
  },
  [ENEMY_IDS.SLACK_NOTIFIER]: {
    kind: ENEMY_IDS.SLACK_NOTIFIER,
    texture: 'enemy-slack-notifier',
    hp: 1,
    speed: 128,
    contactDamage: 7,
    scoreValue: 16,
  },
  [ENEMY_IDS.LEGACY_MONOLITH]: {
    kind: ENEMY_IDS.LEGACY_MONOLITH,
    texture: 'enemy-legacy-monolith',
    hp: 6,
    speed: 40,
    contactDamage: 15,
    scoreValue: 30,
  },
}

export const ENEMY_SPAWN_POOL: EnemyKind[] = [
  ENEMY_IDS.CI_CD_BOT,
  ENEMY_IDS.CI_CD_BOT,
  ENEMY_IDS.AUTOMATOR_SWARM,
  ENEMY_IDS.ORCHESTRATOR,
  ENEMY_IDS.BURNOUT_GHOST,
  ENEMY_IDS.MEETING_MONSTER,
  ENEMY_IDS.EXCEL_ZOMBIE,
  ENEMY_IDS.SLACK_NOTIFIER,
  ENEMY_IDS.LEGACY_MONOLITH,
]
