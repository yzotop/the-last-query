import {
  BASE_EVENT_MODIFIERS,
  MEME_EVENT_CONFIGS,
  type EventModifiers,
  type MemeEventConfig,
  type MemeEventId,
} from '../content/events'

type ActiveEvent = {
  config: MemeEventConfig
  endsAt: number
}

export type EventSystemTickResult = {
  modifiers: EventModifiers
  startedEvent?: MemeEventConfig
  endedEvent?: MemeEventConfig
}

export class EventSystem {
  private activeEvent: ActiveEvent | null = null
  private nextRollAtMs = 22000
  private readonly firstEventAtMs: number
  private readonly rollIntervalMs: number
  private readonly rollChance: number

  constructor(options?: { firstEventAtMs?: number; rollIntervalMs?: number; rollChance?: number }) {
    this.firstEventAtMs = options?.firstEventAtMs ?? 20000
    this.rollIntervalMs = options?.rollIntervalMs ?? 22000
    this.rollChance = options?.rollChance ?? 0.68
  }

  update(nowMs: number, elapsedMs: number): EventSystemTickResult {
    let startedEvent: MemeEventConfig | undefined
    let endedEvent: MemeEventConfig | undefined

    if (this.activeEvent && nowMs >= this.activeEvent.endsAt) {
      endedEvent = this.activeEvent.config
      this.activeEvent = null
      this.nextRollAtMs = nowMs + this.rollIntervalMs
    }

    if (!this.activeEvent && elapsedMs >= this.firstEventAtMs && nowMs >= this.nextRollAtMs) {
      this.nextRollAtMs = nowMs + this.rollIntervalMs
      if (Math.random() <= this.rollChance) {
        const config = this.pickWeightedEvent()
        this.activeEvent = {
          config,
          endsAt: nowMs + config.durationMs,
        }
        startedEvent = config
      }
    }

    return {
      modifiers: this.getCurrentModifiers(),
      startedEvent,
      endedEvent,
    }
  }

  getCurrentModifiers(): EventModifiers {
    return this.activeEvent?.config.modifiers ?? BASE_EVENT_MODIFIERS
  }

  getActiveEventId(): MemeEventId | null {
    return this.activeEvent?.config.id ?? null
  }

  private pickWeightedEvent(): MemeEventConfig {
    const totalWeight = MEME_EVENT_CONFIGS.reduce((acc, item) => acc + item.weight, 0)
    let roll = Math.random() * totalWeight
    for (const config of MEME_EVENT_CONFIGS) {
      roll -= config.weight
      if (roll <= 0) {
        return config
      }
    }
    return MEME_EVENT_CONFIGS[0]
  }
}
