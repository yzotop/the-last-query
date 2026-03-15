import Phaser from 'phaser'

export type ViralEventId = 'PRODUCT_MANAGER_ARRIVED' | 'CEO_OPENED_DASHBOARD' | 'METRIC_CHANGED' | 'DATA_TEAM_PANIC'

type JokeEntry = {
  icon: '⚠' | '📊' | '💾' | '🐛' | '🧠'
  text: string
}

type ViralEventEntry = {
  id: ViralEventId
  icon: '⚠' | '📊' | '💾' | '🐛' | '🧠'
  title: string
  subtitle: string
  durationMs: number
}

export type JokeTickResult = {
  viralEvent?: ViralEventEntry
}

const JOKE_POOL: JokeEntry[] = [
  { icon: '⚠', text: 'KPI DRIFT DETECTED' },
  { icon: '💾', text: 'LEGACY SYSTEM AWAKENED' },
  { icon: '📊', text: 'DASHBOARD OUT OF SYNC' },
  { icon: '🧠', text: 'METRIC RENAMED BY PRODUCT' },
  { icon: '⚠', text: 'PIPELINE DELAY' },
  { icon: '⚠', text: 'DATA TEAM ALERT' },
  { icon: '📊', text: 'EXECUTIVE VIEW OPENED' },
  { icon: '🧠', text: 'METRICS MUST RISE' },
  { icon: '💾', text: 'UNKNOWN TABLE IN PRODUCTION' },
  { icon: '🐛', text: 'SOMEONE EDITED THE DASHBOARD' },
  { icon: '⚠', text: 'MEETING INVITE DETECTED' },
  { icon: '💾', text: 'SCHEMA CHANGED WITHOUT WARNING' },
  { icon: '🧠', text: 'ANALYST DEPLOYED FRIDAY FIX' },
  { icon: '⚠', text: 'DATA QUALITY QUESTIONABLE' },
  { icon: '🧠', text: 'PRODUCT CHANGED THE DEFINITION' },
  { icon: '💾', text: 'CACHE INVALIDATED' },
  { icon: '🐛', text: 'BI TOOL FREEZING' },
  { icon: '⚠', text: 'JOIN EXPLOSION DETECTED' },
  { icon: '💾', text: 'MISSING INDEX' },
  { icon: '⚠', text: 'SILENT DATA LOSS' },
  { icon: '📊', text: 'SPREADSHEET IMPORT DETECTED' },
  { icon: '💾', text: 'UNION WITHOUT WHERE' },
  { icon: '⚠', text: 'QUERY TIMEOUT THRESHOLD HIT' },
  { icon: '🐛', text: 'AD-HOC SQL INCOMING' },
  { icon: '🧠', text: 'METRIC OWNERSHIP UNCLEAR' },
  { icon: '📊', text: 'DASHBOARD FILTER MISALIGNED' },
  { icon: '💾', text: 'MATERIALIZED VIEW STALE' },
  { icon: '⚠', text: 'PIPELINE BACKPRESSURE GROWING' },
  { icon: '🐛', text: 'MANUAL CSV PATCH APPLIED' },
  { icon: '🧠', text: 'DIMENSION TABLE FORGOTTEN' },
  { icon: '📊', text: 'KPI TREND LOOKS SUSPICIOUS' },
  { icon: '💾', text: 'WAREHOUSE SLOT STARVATION' },
  { icon: '⚠', text: 'LATE ARRIVING EVENTS DETECTED' },
  { icon: '🐛', text: 'LOOKER CACHE GHOSTING' },
  { icon: '🧠', text: 'ANALYST CONTEXT SWITCH OVERLOAD' },
  { icon: '📊', text: 'DASHBOARD RENDER RETRY LOOP' },
  { icon: '💾', text: 'FACT TABLE BLOATED' },
  { icon: '⚠', text: 'NULL RATE SPIKE' },
  { icon: '🐛', text: 'REPORT EXPORT FAILED' },
  { icon: '🧠', text: 'METRIC CONTRACT BROKEN' },
  { icon: '📊', text: 'WEEKLY KPI RESET MYSTERY' },
  { icon: '💾', text: 'ETL STEP SKIPPED' },
  { icon: '⚠', text: 'DATA FRESHNESS DEGRADED' },
  { icon: '🐛', text: 'VISUALIZATION DRIFT' },
  { icon: '🧠', text: 'PRODUCT ASKED FOR REAL-TIME' },
  { icon: '📊', text: 'DASHBOARD ANXIETY INCREASED' },
  { icon: '💾', text: 'WAREHOUSE CREDITS MELTING' },
  { icon: '⚠', text: 'MONDAY MORNING INCIDENT MODE' },
]

const REACTION_TEXTS = [
  'DATA CLEANED',
  'TABLE NORMALIZED',
  'PIPELINE STABILIZED',
  'QUERY OPTIMIZED',
  'JOIN RESOLVED',
  'DUPLICATES REMOVED',
  'CACHE WARMED',
  'METRIC RESTORED',
  'INDEX APPLIED',
]

const SARCASM_QUOTES = [
  '"We should rename the metric."',
  '"Can we get this before the meeting?"',
  '"This worked in staging."',
  '"The data looks strange."',
  '"Let us align on the definition."',
  '"Can we make it real-time by Friday?"',
]

const VIRAL_EVENTS: ViralEventEntry[] = [
  {
    id: 'PRODUCT_MANAGER_ARRIVED',
    icon: '🧠',
    title: 'PRODUCT MANAGER ARRIVED',
    subtitle: 'requirements changed again',
    durationMs: 9000,
  },
  {
    id: 'CEO_OPENED_DASHBOARD',
    icon: '📊',
    title: 'CEO OPENED THE DASHBOARD',
    subtitle: 'score multiplier boosted',
    durationMs: 10000,
  },
  {
    id: 'METRIC_CHANGED',
    icon: '⚠',
    title: 'METRIC CHANGED',
    subtitle: 'hud readings flicker',
    durationMs: 4500,
  },
  {
    id: 'DATA_TEAM_PANIC',
    icon: '🐛',
    title: 'DATA TEAM PANIC',
    subtitle: 'temporary chaos spike',
    durationMs: 10000,
  },
]

export class JokeSystem {
  private readonly scene: Phaser.Scene
  private nextJokeAtMs = 0
  private nextViralAtMs = 0
  private jokeContainer: Phaser.GameObjects.Container | null = null
  private quoteContainer: Phaser.GameObjects.Container | null = null

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  reset(nowMs: number): void {
    this.destroyTransientUi()
    this.nextJokeAtMs = nowMs + Phaser.Math.Between(8000, 15000)
    this.nextViralAtMs = nowMs + Phaser.Math.Between(60000, 90000)
  }

  update(nowMs: number, centerX: number): JokeTickResult {
    const result: JokeTickResult = {}
    if (nowMs >= this.nextJokeAtMs) {
      this.showJoke(centerX)
      this.nextJokeAtMs = nowMs + Phaser.Math.Between(8000, 15000)
      if (Phaser.Math.Between(1, 100) <= 2) {
        this.showSarcasmQuote(centerX)
      }
    }
    if (nowMs >= this.nextViralAtMs) {
      result.viralEvent = VIRAL_EVENTS[Phaser.Math.Between(0, VIRAL_EVENTS.length - 1)]
      this.nextViralAtMs = nowMs + Phaser.Math.Between(60000, 90000)
    }
    return result
  }

  maybeReactionText(): string | null {
    if (Phaser.Math.Between(1, 100) > 26) {
      return null
    }
    return REACTION_TEXTS[Phaser.Math.Between(0, REACTION_TEXTS.length - 1)]
  }

  destroyTransientUi(): void {
    this.jokeContainer?.destroy()
    this.jokeContainer = null
    this.quoteContainer?.destroy()
    this.quoteContainer = null
  }

  private showJoke(centerX: number): void {
    this.jokeContainer?.destroy()
    const joke = JOKE_POOL[Phaser.Math.Between(0, JOKE_POOL.length - 1)]
    const panel = this.scene.add.rectangle(centerX, 42, 360, 36, 0x0d1424, 0.88).setStrokeStyle(1, 0x38608f).setAlpha(0)
    const glow = this.scene.add.rectangle(centerX, 42, 372, 42, 0x7ec7ff, 0.09).setAlpha(0)
    const text = this.scene.add
      .text(centerX, 42, `${joke.icon} ${joke.text}`, {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#d7e6ff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setAlpha(0)
    this.jokeContainer = this.scene.add.container(0, 0, [glow, panel, text]).setDepth(62)
    this.scene.tweens.add({
      targets: [panel, glow, text],
      alpha: { from: 0, to: 1 },
      duration: 180,
      onComplete: () => {
        this.scene.time.delayedCall(2000, () => {
          if (!this.jokeContainer) {
            return
          }
          this.scene.tweens.add({
            targets: [panel, glow, text],
            alpha: 0,
            duration: 240,
            onComplete: () => {
              this.jokeContainer?.destroy()
              this.jokeContainer = null
            },
          })
        })
      },
    })
  }

  private showSarcasmQuote(centerX: number): void {
    this.quoteContainer?.destroy()
    const quote = SARCASM_QUOTES[Phaser.Math.Between(0, SARCASM_QUOTES.length - 1)]
    const bubble = this.scene.add.rectangle(centerX, 82, 420, 44, 0x111a2b, 0.9).setStrokeStyle(1, 0x5173a3).setAlpha(0)
    const text = this.scene.add
      .text(centerX, 82, quote, {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffd8a6',
      })
      .setOrigin(0.5)
      .setAlpha(0)
    this.quoteContainer = this.scene.add.container(0, 0, [bubble, text]).setDepth(63)
    this.scene.tweens.add({
      targets: [bubble, text],
      alpha: 1,
      duration: 140,
      onComplete: () => {
        this.scene.time.delayedCall(1800, () => {
          if (!this.quoteContainer) {
            return
          }
          this.scene.tweens.add({
            targets: [bubble, text],
            alpha: 0,
            duration: 220,
            onComplete: () => {
              this.quoteContainer?.destroy()
              this.quoteContainer = null
            },
          })
        })
      },
    })
  }
}
