import Phaser from 'phaser'
import { GAME_CONFIG } from '../core/config'
import { SCENE_KEYS } from '../core/constants'
import type { GameStateSnapshot } from '../core/types'
import { gameState } from '../core/gameState'
import type { MemeEventId } from '../content/events'
import type { ActiveTimedBuffView } from '../entities/pickups/PickupEffects'
import type { PickupId } from '../core/types'
import { FloatingText } from '../ui/FloatingText'
import { ArtifactPanel } from '../ui/ArtifactPanel'
import { HUD } from '../ui/HUD'
import { MiniMap } from '../ui/MiniMap'
import { Notifications } from '../ui/Notifications'
import { StatusBar } from '../ui/StatusBar'
import { AnalyticsLog } from '../ui/analytics/AnalyticsLog'
import { EventBanner } from '../ui/analytics/EventBanner'
import { KpiBar } from '../ui/analytics/KpiBar'

type RadarState = {
  player: { x: number; y: number }
  points: Array<{ x: number; y: number; kind: 'enemy' | 'pickup' | 'boss' }>
}

export class UIScene extends Phaser.Scene {
  private hud!: HUD
  private miniMap!: MiniMap
  private artifactPanel!: ArtifactPanel
  private statusBar!: StatusBar
  private analyticsLog!: AnalyticsLog
  private eventBanner!: EventBanner
  private kpiBar!: KpiBar
  private notifications!: Notifications
  private floatingText!: FloatingText
  private pauseOverlay!: Phaser.GameObjects.Container
  private sqlHelpOverlay!: Phaser.GameObjects.Container
  private isPaused = false
  private isSqlHelpOpen = false

  constructor() {
    super(SCENE_KEYS.UI)
  }

  create(): void {
    this.hud = new HUD(this)
    this.miniMap = new MiniMap(this, GAME_CONFIG.worldWidth, GAME_CONFIG.height)
    this.artifactPanel = new ArtifactPanel(this)
    this.artifactPanel.reset()
    this.statusBar = new StatusBar(this)
    this.analyticsLog = new AnalyticsLog(this)
    this.eventBanner = new EventBanner(this)
    this.kpiBar = new KpiBar(this)
    this.notifications = new Notifications(this)
    this.floatingText = new FloatingText(this)
    this.hud.update(gameState.getSnapshot())
    this.statusBar.update([])
    this.pauseOverlay = this.createPauseOverlay()
    this.sqlHelpOverlay = this.createSqlHelpOverlay()

    this.input.keyboard?.on('keydown-ESC', () => {
      this.togglePause()
    })
    this.input.keyboard?.on('keydown-H', () => {
      this.toggleSqlHelp()
    })
  }

  sync(
    snapshot: GameStateSnapshot,
    buffs: ActiveTimedBuffView[],
    combo?: { comboCount: number; multiplier: number },
    radar?: RadarState,
    activeEventId?: MemeEventId | null,
  ): void {
    this.hud.update(snapshot, null, combo)
    const minimapEnabled = activeEventId !== 'PRODUCTION_TABLE_DELETED'
    this.miniMap.setVisible(minimapEnabled)
    if (radar && minimapEnabled) {
      this.miniMap.update(radar.player.x, radar.player.y, radar.points)
    }
    this.kpiBar.update(snapshot.elapsedMs, activeEventId ?? null)
    this.statusBar.update(buffs.map((buff) => ({ label: buff.label, remainingMs: buff.remainingMs })))
  }

  syncWithBoss(
    snapshot: GameStateSnapshot,
    buffs: ActiveTimedBuffView[],
    bossHp?: { current: number; max: number },
    combo?: { comboCount: number; multiplier: number },
    radar?: RadarState,
    activeEventId?: MemeEventId | null,
  ): void {
    this.hud.update(snapshot, bossHp ?? null, combo)
    const minimapEnabled = activeEventId !== 'PRODUCTION_TABLE_DELETED'
    this.miniMap.setVisible(minimapEnabled)
    if (radar && minimapEnabled) {
      this.miniMap.update(radar.player.x, radar.player.y, radar.points)
    }
    this.kpiBar.update(snapshot.elapsedMs, activeEventId ?? null)
    this.statusBar.update(buffs.map((buff) => ({ label: buff.label, remainingMs: buff.remainingMs })))
  }

  notify(message: string): void {
    this.notifications.push(message)
  }

  logAnalytics(message: string): void {
    this.analyticsLog.push(message)
  }

  recordArtifact(pickupType: PickupId): void {
    if (import.meta.env.DEV) {
      console.debug(`[UIScene] recordArtifact called: ${pickupType}`)
    }
    this.artifactPanel.addPickup(pickupType)
  }

  showEventBanner(title: string, subtitle: string): void {
    this.eventBanner.show(this, title, subtitle)
  }

  showAchievement(title: string, description: string): void {
    this.eventBanner.show(this, `🏆 ${title}`, description)
    this.notify(`ACHIEVEMENT UNLOCKED: ${title}`)
  }

  triggerHudFlicker(durationMs: number): void {
    this.hud.flicker(durationMs)
  }

  floatLabel(x: number, y: number, text: string, color?: string): void {
    this.floatingText.show(x, y, text, color)
  }

  private togglePause(): void {
    if (this.scene.isActive(SCENE_KEYS.GAME_OVER) || this.scene.isActive(SCENE_KEYS.TITLE)) {
      return
    }
    if (!this.scene.isActive(SCENE_KEYS.GAME) && !this.scene.isPaused(SCENE_KEYS.GAME)) {
      return
    }

    this.isPaused = !this.isPaused
    if (this.isPaused) {
      this.scene.pause(SCENE_KEYS.GAME)
      this.pauseOverlay.setVisible(true)
      this.notify('PAUSED')
    } else {
      this.scene.resume(SCENE_KEYS.GAME)
      this.pauseOverlay.setVisible(false)
      this.notify('RESUMED')
    }
  }

  private createPauseOverlay(): Phaser.GameObjects.Container {
    const bg = this.add
      .rectangle(480, 270, 390, 140, 0x090f19, 0.9)
      .setStrokeStyle(2, 0x2e4c78)
      .setScrollFactor(0)
    const stripe = this.add
      .rectangle(480, 228, 370, 18, 0xffb34a, 0.22)
      .setScrollFactor(0)
    const title = this.add
      .text(480, 248, 'PAUSED', {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#ffdd8a',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
    const hint = this.add
      .text(480, 282, 'ESC to resume query execution', {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: '#d7e6ff',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
    const controls = this.add
      .text(480, 308, 'SPACE SELECT | ALT+SPACE JOIN STORM | E GROUP EXP | X DELETE FROM', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#86ffcf',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)

    const container = this.add.container(0, 0, [bg, stripe, title, hint, controls]).setDepth(60).setVisible(false)
    return container
  }

  private createSqlHelpOverlay(): Phaser.GameObjects.Container {
    const bg = this.add
      .rectangle(480, 270, 460, 220, 0x090f19, 0.92)
      .setStrokeStyle(2, 0x2e4c78)
      .setScrollFactor(0)
    const stripe = this.add
      .rectangle(480, 178, 430, 20, 0x59d7ff, 0.18)
      .setScrollFactor(0)
    const title = this.add
      .text(480, 184, 'SQL HELP', {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#d7f4ff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
    const body = this.add
      .text(
        480,
        266,
        [
          'SELECT — выбор данных',
          'WHERE — фильтрация',
          'JOIN — соединение таблиц',
          'GROUP BY — группировка',
          'COUNT — подсчет строк',
        ].join('\n'),
        {
          fontFamily: 'monospace',
          fontSize: '15px',
          color: '#d7e6ff',
          align: 'left',
        },
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
    const hint = this.add
      .text(480, 352, 'Нажмите H чтобы закрыть', {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#86ffcf',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)

    return this.add.container(0, 0, [bg, stripe, title, body, hint]).setDepth(61).setVisible(false)
  }

  private toggleSqlHelp(): void {
    if (this.scene.isActive(SCENE_KEYS.GAME_OVER) || this.scene.isActive(SCENE_KEYS.TITLE)) {
      return
    }
    this.isSqlHelpOpen = !this.isSqlHelpOpen
    if (this.isSqlHelpOpen) {
      if (this.scene.isActive(SCENE_KEYS.GAME)) {
        this.scene.pause(SCENE_KEYS.GAME)
      }
      this.sqlHelpOverlay.setVisible(true)
      this.notify('SQL HELP OPENED')
    } else {
      this.sqlHelpOverlay.setVisible(false)
      if (!this.isPaused && this.scene.isPaused(SCENE_KEYS.GAME)) {
        this.scene.resume(SCENE_KEYS.GAME)
      }
      this.notify('SQL HELP CLOSED')
    }
  }
}
