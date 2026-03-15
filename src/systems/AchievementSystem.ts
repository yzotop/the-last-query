import type { MemeEventId } from '../content/events'
import { PICKUP_IDS } from '../core/constants'
import type { PickupId } from '../core/types'

const STORAGE_KEY = 'the-last-query:achievements:v1'

export type AchievementId =
  | 'FIRST_INCIDENT'
  | 'STACKOVERFLOW_HERO'
  | 'MEETING_SURVIVOR'
  | 'DEPLOY_FRIDAY_SURVIVOR'
  | 'DASHBOARD_SAVIOR'

export type AchievementProgress = {
  stackoverflowUses: number
  meetingsAvoided: number
  kills: number
}

type AchievementState = {
  unlocked: AchievementId[]
  progress: AchievementProgress
}

type AchievementDef = {
  id: AchievementId
  title: string
  description: string
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { id: 'FIRST_INCIDENT', title: 'FIRST INCIDENT', description: 'пережит первый продакшн инцидент' },
  { id: 'STACKOVERFLOW_HERO', title: 'STACKOVERFLOW HERO', description: 'использован Scroll 5 раз' },
  { id: 'MEETING_SURVIVOR', title: 'MEETING SURVIVOR', description: 'пережить 3 встречи подряд' },
  { id: 'DEPLOY_FRIDAY_SURVIVOR', title: 'DEPLOY FRIDAY', description: 'выжить при событии Deploy Friday' },
  { id: 'DASHBOARD_SAVIOR', title: 'DASHBOARD SAVIOR', description: 'устранить 100 сущностей' },
]

const DEFAULT_STATE: AchievementState = {
  unlocked: [],
  progress: {
    stackoverflowUses: 0,
    meetingsAvoided: 0,
    kills: 0,
  },
}

const canUseStorage = (): boolean => typeof window !== 'undefined' && !!window.localStorage

const readState = (): AchievementState => {
  if (!canUseStorage()) {
    return { ...DEFAULT_STATE, progress: { ...DEFAULT_STATE.progress } }
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { ...DEFAULT_STATE, progress: { ...DEFAULT_STATE.progress } }
    }
    const parsed = JSON.parse(raw) as Partial<AchievementState>
    return {
      unlocked: Array.isArray(parsed.unlocked) ? (parsed.unlocked as AchievementId[]) : [],
      progress: {
        stackoverflowUses: Math.max(0, Math.floor(parsed.progress?.stackoverflowUses ?? 0)),
        meetingsAvoided: Math.max(0, Math.floor(parsed.progress?.meetingsAvoided ?? 0)),
        kills: Math.max(0, Math.floor(parsed.progress?.kills ?? 0)),
      },
    }
  } catch {
    return { ...DEFAULT_STATE, progress: { ...DEFAULT_STATE.progress } }
  }
}

const writeState = (state: AchievementState): void => {
  if (!canUseStorage()) {
    return
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

const unlockIfNeeded = (state: AchievementState, id: AchievementId): AchievementId[] => {
  if (state.unlocked.includes(id)) {
    return []
  }
  state.unlocked.push(id)
  return [id]
}

export class AchievementSystem {
  private state: AchievementState

  constructor() {
    this.state = readState()
  }

  onPickupCollected(pickupId: PickupId): AchievementId[] {
    if (pickupId === PICKUP_IDS.STACKOVERFLOW_SCROLL) {
      this.state.progress.stackoverflowUses += 1
      if (this.state.progress.stackoverflowUses >= 5) {
        const unlocked = unlockIfNeeded(this.state, 'STACKOVERFLOW_HERO')
        writeState(this.state)
        return unlocked
      }
    }
    writeState(this.state)
    return []
  }

  onEnemyKilled(): AchievementId[] {
    this.state.progress.kills += 1
    const unlocked = this.state.progress.kills >= 100 ? unlockIfNeeded(this.state, 'DASHBOARD_SAVIOR') : []
    writeState(this.state)
    return unlocked
  }

  onMeetingAvoided(currentMeetingsAvoided: number): AchievementId[] {
    this.state.progress.meetingsAvoided = Math.max(this.state.progress.meetingsAvoided, currentMeetingsAvoided)
    const unlocked = currentMeetingsAvoided >= 3 ? unlockIfNeeded(this.state, 'MEETING_SURVIVOR') : []
    writeState(this.state)
    return unlocked
  }

  onEventEnded(eventId: MemeEventId): AchievementId[] {
    const unlocked: AchievementId[] = []
    if (eventId === 'PRODUCTION_INCIDENT') {
      unlocked.push(...unlockIfNeeded(this.state, 'FIRST_INCIDENT'))
    }
    if (eventId === 'DEPLOY_FRIDAY') {
      unlocked.push(...unlockIfNeeded(this.state, 'DEPLOY_FRIDAY_SURVIVOR'))
    }
    writeState(this.state)
    return unlocked
  }

  getUnlockedDefs(): AchievementDef[] {
    const unlockedSet = new Set(this.state.unlocked)
    return ACHIEVEMENT_DEFS.filter((def) => unlockedSet.has(def.id))
  }
}

export const getUnlockedAchievementDefs = (): AchievementDef[] => {
  const state = readState()
  const unlockedSet = new Set(state.unlocked)
  return ACHIEVEMENT_DEFS.filter((def) => unlockedSet.has(def.id))
}
