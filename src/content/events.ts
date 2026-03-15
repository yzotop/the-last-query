import { ENEMY_IDS } from '../core/constants'
import type { EnemyKind } from '../core/types'

export type MemeEventId =
  | 'DEPLOY_FRIDAY'
  | 'PRODUCTION_INCIDENT'
  | 'AGENT_INVASION'
  | 'RETROGRADE_MERCURY'
  | 'MACBOOK_RAIN'
  | 'BURNOUT_WEEK'
  | 'DATA_LEAK'
  | 'KPI_RECALCULATION'
  | 'EXECUTIVE_MEETING'
  | 'CEO_DASHBOARD'
  | 'SQL_IN_PROD'
  | 'METRIC_RENAMED'
  | 'PRODUCTION_TABLE_DELETED'

export type EventModifiers = {
  spawnDelayMultiplier: number
  enemySpeedMultiplier: number
  reverseControls: boolean
  glitchFx: boolean
  pickupDropMultiplier: number
  macbookRainVisual: boolean
  burnoutFog: boolean
}

export type MemeEventConfig = {
  id: MemeEventId
  label: string
  durationMs: number
  weight: number
  modifiers: EventModifiers
  onStartBurstCount?: number
  burstEnemyKind?: EnemyKind
}

export const BASE_EVENT_MODIFIERS: EventModifiers = {
  spawnDelayMultiplier: 1,
  enemySpeedMultiplier: 1,
  reverseControls: false,
  glitchFx: false,
  pickupDropMultiplier: 1,
  macbookRainVisual: false,
  burnoutFog: false,
}

export const MEME_EVENT_CONFIGS: MemeEventConfig[] = [
  {
    id: 'DEPLOY_FRIDAY',
    label: 'DEPLOY FRIDAY',
    durationMs: 14000,
    weight: 1.2,
    modifiers: {
      ...BASE_EVENT_MODIFIERS,
      spawnDelayMultiplier: 0.72,
      enemySpeedMultiplier: 1.2,
    },
    onStartBurstCount: 7,
    burstEnemyKind: ENEMY_IDS.CI_CD_BOT,
  },
  {
    id: 'PRODUCTION_INCIDENT',
    label: 'PRODUCTION INCIDENT',
    durationMs: 10000,
    weight: 0.9,
    modifiers: {
      ...BASE_EVENT_MODIFIERS,
      spawnDelayMultiplier: 0.8,
      glitchFx: true,
    },
    onStartBurstCount: 4,
  },
  {
    id: 'AGENT_INVASION',
    label: 'AGENT INVASION',
    durationMs: 12000,
    weight: 1,
    modifiers: {
      ...BASE_EVENT_MODIFIERS,
      spawnDelayMultiplier: 0.86,
      enemySpeedMultiplier: 1.26,
    },
  },
  {
    id: 'RETROGRADE_MERCURY',
    label: 'MERCURY RETROGRADE',
    durationMs: 8500,
    weight: 0.8,
    modifiers: {
      ...BASE_EVENT_MODIFIERS,
      reverseControls: true,
    },
  },
  {
    id: 'MACBOOK_RAIN',
    label: 'MACBOOK RAIN',
    durationMs: 11000,
    weight: 0.75,
    modifiers: {
      ...BASE_EVENT_MODIFIERS,
      pickupDropMultiplier: 1.45,
      macbookRainVisual: true,
    },
  },
  {
    id: 'BURNOUT_WEEK',
    label: 'BURNOUT WEEK',
    durationMs: 12500,
    weight: 0.85,
    modifiers: {
      ...BASE_EVENT_MODIFIERS,
      spawnDelayMultiplier: 0.84,
      enemySpeedMultiplier: 1.08,
      burnoutFog: true,
    },
    onStartBurstCount: 6,
    burstEnemyKind: ENEMY_IDS.BURNOUT_GHOST,
  },
  {
    id: 'DATA_LEAK',
    label: 'DATA LEAK',
    durationMs: 9000,
    weight: 0.45,
    modifiers: {
      ...BASE_EVENT_MODIFIERS,
      spawnDelayMultiplier: 0.66,
      pickupDropMultiplier: 1.8,
    },
  },
  {
    id: 'KPI_RECALCULATION',
    label: 'KPI RECALCULATION',
    durationMs: 8500,
    weight: 0.35,
    modifiers: {
      ...BASE_EVENT_MODIFIERS,
      enemySpeedMultiplier: 0.72,
    },
  },
  {
    id: 'EXECUTIVE_MEETING',
    label: 'EXECUTIVE MEETING',
    durationMs: 7000,
    weight: 0.25,
    modifiers: {
      ...BASE_EVENT_MODIFIERS,
      spawnDelayMultiplier: 0.9,
    },
    onStartBurstCount: 2,
    burstEnemyKind: ENEMY_IDS.MEETING_MONSTER,
  },
  {
    id: 'CEO_DASHBOARD',
    label: 'CEO ОТКРЫЛ ДАШБОРД',
    durationMs: 6000,
    weight: 0.07,
    modifiers: {
      ...BASE_EVENT_MODIFIERS,
      spawnDelayMultiplier: 0.7,
      enemySpeedMultiplier: 1.18,
    },
  },
  {
    id: 'PRODUCTION_TABLE_DELETED',
    label: 'PRODUCTION TABLE DELETED',
    durationMs: 10000,
    weight: 0.07,
    modifiers: {
      ...BASE_EVENT_MODIFIERS,
      spawnDelayMultiplier: 0.9,
    },
  },
  {
    id: 'SQL_IN_PROD',
    label: 'SQL В ПРОДЕ',
    durationMs: 7000,
    weight: 0.08,
    modifiers: {
      ...BASE_EVENT_MODIFIERS,
      spawnDelayMultiplier: 0.78,
      enemySpeedMultiplier: 1.12,
    },
  },
  {
    id: 'METRIC_RENAMED',
    label: 'ПЕРЕИМЕНОВАЛИ МЕТРИКУ',
    durationMs: 6500,
    weight: 0.08,
    modifiers: {
      ...BASE_EVENT_MODIFIERS,
      reverseControls: true,
      glitchFx: true,
    },
  },
]
