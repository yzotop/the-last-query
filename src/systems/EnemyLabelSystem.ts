import Phaser from 'phaser'
import { BOSS_IDS, ENEMY_IDS } from '../core/constants'
import type { BossId, EnemyKind } from '../core/types'
import { Enemy } from '../entities/enemies/Enemy'
import { TherapistBoss } from '../entities/bosses/TherapistBoss'

type EliteLabelEntry = {
  enemy: Enemy
  text: Phaser.GameObjects.Text
  hpBg: Phaser.GameObjects.Rectangle
  hpFill: Phaser.GameObjects.Rectangle
}

type BossLabelEntry = {
  boss: TherapistBoss
  text: Phaser.GameObjects.Text
}

const ELITE_KINDS = new Set<EnemyKind>([
  ENEMY_IDS.ORCHESTRATOR,
  ENEMY_IDS.MEETING_MONSTER,
  ENEMY_IDS.EXCEL_ZOMBIE,
  ENEMY_IDS.LEGACY_MONOLITH,
])

const ELITE_ADJECTIVES = ['Бешеный', 'Токсичный', 'Злой', 'Перегруженный', 'Микроменеджер']
const ELITE_ROLES = ['PM', 'TL', 'DevOps', 'BI аналитик', 'Data Evangelist', 'TL-микроменеджер']

export class EnemyLabelSystem {
  private readonly scene: Phaser.Scene
  private readonly eliteLabels: EliteLabelEntry[] = []
  private bossLabel: BossLabelEntry | null = null
  private readonly eliteVisibleDistance = 220

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  onEnemySpawned(enemy: Enemy): void {
    if (!ELITE_KINDS.has(enemy.getKind())) {
      return
    }
    const title = this.makeEliteTitle(enemy.getKind())
    const text = this.scene.add
      .text(enemy.x, enemy.y - 20, title, {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#ffd57a',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(41)
      .setVisible(false)
    const hpBg = this.scene.add.rectangle(enemy.x, enemy.y - 10, 22, 3, 0x212935, 0.9).setDepth(41).setVisible(false)
    const hpFill = this.scene.add.rectangle(enemy.x - 11, enemy.y - 10, 22, 3, 0xffd57a, 0.95).setDepth(42).setVisible(false)
    hpFill.setOrigin(0, 0.5)
    this.eliteLabels.push({ enemy, text, hpBg, hpFill })
  }

  setBossLabel(boss: TherapistBoss): void {
    this.clearBossLabel()
    const text = this.scene.add
      .text(boss.x, boss.y - 30, this.resolveBossName(boss.getBossId() as BossId), {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#ff7f93',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(43)
    this.bossLabel = { boss, text }
  }

  update(playerX: number, playerY: number): void {
    for (let i = this.eliteLabels.length - 1; i >= 0; i -= 1) {
      const entry = this.eliteLabels[i]
      if (!entry.enemy.active || !entry.enemy.isAlive()) {
        entry.text.destroy()
        entry.hpBg.destroy()
        entry.hpFill.destroy()
        this.eliteLabels.splice(i, 1)
        continue
      }
      const dist = Phaser.Math.Distance.Between(playerX, playerY, entry.enemy.x, entry.enemy.y)
      const visible = dist <= this.eliteVisibleDistance
      entry.text.setVisible(visible).setPosition(entry.enemy.x, entry.enemy.y - 20)
      entry.hpBg.setVisible(visible).setPosition(entry.enemy.x, entry.enemy.y - 10)
      entry.hpFill.setVisible(visible).setPosition(entry.enemy.x - 11, entry.enemy.y - 10)
      const ratio = Phaser.Math.Clamp(entry.enemy.getHp() / Math.max(1, entry.enemy.getMaxHp()), 0, 1)
      entry.hpFill.setDisplaySize(Math.max(1.5, 22 * ratio), 3)
    }

    if (!this.bossLabel) {
      return
    }
    if (!this.bossLabel.boss.active || !this.bossLabel.boss.isAlive()) {
      this.clearBossLabel()
      return
    }
    this.bossLabel.text.setPosition(this.bossLabel.boss.x, this.bossLabel.boss.y - 30).setVisible(true)
  }

  clear(): void {
    this.eliteLabels.forEach((entry) => {
      entry.text.destroy()
      entry.hpBg.destroy()
      entry.hpFill.destroy()
    })
    this.eliteLabels.length = 0
    this.clearBossLabel()
  }

  private clearBossLabel(): void {
    this.bossLabel?.text.destroy()
    this.bossLabel = null
  }

  private makeEliteTitle(kind: EnemyKind): string {
    if (kind === ENEMY_IDS.LEGACY_MONOLITH) {
      return 'LEGACY MONOLITH'
    }
    if (kind === ENEMY_IDS.MEETING_MONSTER) {
      return 'MEETING MONSTER'
    }
    const adjective = ELITE_ADJECTIVES[Phaser.Math.Between(0, ELITE_ADJECTIVES.length - 1)]
    const role = ELITE_ROLES[Phaser.Math.Between(0, ELITE_ROLES.length - 1)]
    return `${adjective} ${role}`
  }

  private resolveBossName(bossId: BossId): string {
    if (bossId === BOSS_IDS.THERAPIST_BOSS) {
      return 'THE PRODUCT MANAGER'
    }
    return 'DATA PLATFORM'
  }
}
