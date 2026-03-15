import Phaser from 'phaser'
import { createDurationTimer } from '../../core/timers'
import type { PickupId } from '../../core/types'
import { gameState } from '../../core/gameState'
import { PICKUP_IDS } from '../../core/constants'
import { Player } from '../player/Player'
import { PlayerCombat } from '../player/PlayerCombat'
import { PICKUP_TYPE_CONFIGS } from './PickupTypes'

type NotifyCallback = (message: string) => void

export type ActiveTimedBuffView = {
  id: PickupId
  label: string
  remainingMs: number
}

export class PickupEffects {
  private readonly scene: Phaser.Scene
  private readonly player: Player
  private readonly playerCombat: PlayerCombat
  private readonly activeTimers = new Map<PickupId, Phaser.Time.TimerEvent>()
  private readonly activeBuffEndsAt = new Map<PickupId, number>()

  constructor(scene: Phaser.Scene, player: Player, playerCombat: PlayerCombat) {
    this.scene = scene
    this.player = player
    this.playerCombat = playerCombat
  }

  apply(type: PickupId, notify?: NotifyCallback): void {
    const config = PICKUP_TYPE_CONFIGS[type]

    if (type === PICKUP_IDS.PUMPKIN_LATTE) {
      this.player.setMoveSpeedMultiplier(1 + (config.magnitude ?? 0.3))
      this.refreshTimer(type, config.durationMs ?? 8000, () => {
        this.player.setMoveSpeedMultiplier(1)
      })
      notify?.('Coffee IV: Query speed increased')
      return
    }

    if (type === PICKUP_IDS.NEW_MACBOOK) {
      this.playerCombat.setDamageMultiplier(1 + (config.magnitude ?? 0.5))
      this.refreshTimer(type, config.durationMs ?? 10000, () => {
        this.playerCombat.setDamageMultiplier(1)
      })
      notify?.('New MacBook: SQL damage boosted')
      return
    }

    if (type === PICKUP_IDS.THERAPY_SESSION) {
      const healed = this.player.heal(config.magnitude ?? 40)
      if (healed > 0) {
        gameState.healPlayer(healed)
      }
      notify?.(`Therapy Session: +${healed} HP`)
      return
    }

    if (type === PICKUP_IDS.STACKOVERFLOW_SCROLL) {
      this.playerCombat.enableNextHitMassive()
      notify?.('Скопировано production-ready решение')
      return
    }

    if (type === PICKUP_IDS.VACATION_TICKET) {
      this.player.setInvulnerable(true)
      this.refreshTimer(type, config.durationMs ?? 3000, () => {
        this.player.setInvulnerable(false)
      })
      notify?.('Burnout временно отменен')
      return
    }

    if (type === PICKUP_IDS.NOISE_CANCELLING_AIRPODS) {
      this.player.setDamageReductionMultiplier(config.magnitude ?? 0.7)
      this.refreshTimer(type, config.durationMs ?? 9000, () => {
        this.player.setDamageReductionMultiplier(1)
      })
      notify?.('AirPods: noise cancelled, damage reduced')
      return
    }

    if (type === PICKUP_IDS.SECOND_MONITOR) {
      this.playerCombat.setAttackRadiusMultiplier(config.magnitude ?? 1.35)
      this.refreshTimer(type, config.durationMs ?? 9000, () => {
        this.playerCombat.setAttackRadiusMultiplier(1)
      })
      notify?.('Второй монитор: Производительность x2')
      return
    }

    if (type === PICKUP_IDS.PYTHON_SCRIPT) {
      this.playerCombat.setDamageMultiplier(1 + (config.magnitude ?? 0.25))
      this.refreshTimer(type, config.durationMs ?? 8000, () => {
        this.playerCombat.setDamageMultiplier(1)
      })
      notify?.('Python Script: часть рутины автоматизирована')
      return
    }

    if (type === PICKUP_IDS.EXCEL_MACRO) {
      this.player.setMoveSpeedMultiplier(1 + (config.magnitude ?? 0.15))
      this.refreshTimer(type, config.durationMs ?? 8000, () => {
        this.player.setMoveSpeedMultiplier(1)
      })
      notify?.('Excel Macro: это почему-то сработало')
      return
    }

    if (type === PICKUP_IDS.JUPYTER_NOTEBOOK) {
      this.playerCombat.setDamageMultiplier(1 + (config.magnitude ?? 0.7))
      this.refreshTimer(type, config.durationMs ?? 10000, () => {
        this.playerCombat.setDamageMultiplier(1)
      })
      notify?.('Jupyter Notebook: SQL урон увеличен')
      return
    }

    if (type === PICKUP_IDS.CHATGPT_PROMPT) {
      this.playerCombat.enableNextHitMassive()
      this.playerCombat.setAttackRadiusMultiplier(1.45)
      this.refreshTimer(type, 5000, () => {
        this.playerCombat.setAttackRadiusMultiplier(1)
      })
      notify?.('Prompt из ChatGPT: интеллект повышен')
      return
    }

    if (type === PICKUP_IDS.GIT_BLAME) {
      this.player.setDamageReductionMultiplier(config.magnitude ?? 0.6)
      this.refreshTimer(type, config.durationMs ?? 9000, () => {
        this.player.setDamageReductionMultiplier(1)
      })
      notify?.('Git Blame: виновник найден, боль снижена')
      return
    }

    if (type === PICKUP_IDS.DUCKDUCKGO_QUERY) {
      const healed = this.player.heal(config.magnitude ?? 18)
      if (healed > 0) {
        gameState.healPlayer(healed)
      }
      notify?.('DuckDuckGo Query: найден альтернативный фикс')
      return
    }

    if (type === PICKUP_IDS.POWERPOINT_DECK) {
      this.player.setInvulnerable(true)
      this.refreshTimer(type, config.durationMs ?? 2200, () => {
        this.player.setInvulnerable(false)
      })
      notify?.('PowerPoint Deck: CEO временно доволен')
    }
  }

  private refreshTimer(type: PickupId, durationMs: number, onComplete: () => void): void {
    this.activeTimers.get(type)?.destroy()
    this.activeBuffEndsAt.set(type, this.scene.time.now + durationMs)
    const timer = createDurationTimer(this.scene, durationMs, () => {
      this.activeTimers.delete(type)
      this.activeBuffEndsAt.delete(type)
      onComplete()
    })
    this.activeTimers.set(type, timer)
  }

  getActiveTimedBuffs(now: number): ActiveTimedBuffView[] {
    const tracked: PickupId[] = [
      PICKUP_IDS.PUMPKIN_LATTE,
      PICKUP_IDS.NEW_MACBOOK,
      PICKUP_IDS.VACATION_TICKET,
      PICKUP_IDS.NOISE_CANCELLING_AIRPODS,
      PICKUP_IDS.SECOND_MONITOR,
      PICKUP_IDS.PYTHON_SCRIPT,
      PICKUP_IDS.EXCEL_MACRO,
      PICKUP_IDS.JUPYTER_NOTEBOOK,
      PICKUP_IDS.CHATGPT_PROMPT,
      PICKUP_IDS.GIT_BLAME,
      PICKUP_IDS.POWERPOINT_DECK,
    ]
    return tracked
      .map((id) => {
        const endsAt = this.activeBuffEndsAt.get(id)
        if (!endsAt || endsAt <= now) {
          return null
        }
        const config = PICKUP_TYPE_CONFIGS[id]
        return {
          id,
          label: config.label,
          remainingMs: endsAt - now,
        }
      })
      .filter((entry): entry is ActiveTimedBuffView => Boolean(entry))
  }
}
