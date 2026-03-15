import Phaser from 'phaser'
import { ENEMY_IDS } from '../../core/constants'
import type { EnemyKind } from '../../core/types'
import { EnemyAI } from './EnemyAI'

type EnemyInit = {
  kind: EnemyKind
  texture: string
  hp: number
  speed: number
  contactDamage: number
  scoreValue: number
}

export type EnemySpawnRequest = {
  kind: EnemyKind
  count: number
}

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private hp: number
  private readonly maxHp: number
  private readonly speed: number
  private readonly contactDamage: number
  private readonly scoreValue: number
  private readonly kind: EnemyKind
  private alive = true
  private nextSpecialAtMs = 0
  private dashUntilMs = 0
  private knockbackVelocity = new Phaser.Math.Vector2(0, 0)

  constructor(scene: Phaser.Scene, x: number, y: number, init: EnemyInit) {
    super(scene, x, y, init.texture)
    this.hp = init.hp
    this.maxHp = init.hp
    this.speed = init.speed
    this.contactDamage = init.contactDamage
    this.scoreValue = init.scoreValue
    this.kind = init.kind

    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setCircle(8, 0, 0)
  }

  updateBehavior(targetX: number, targetY: number, speedMultiplier = 1): EnemySpawnRequest | null {
    if (!this.alive) {
      return null
    }
    const now = this.scene.time.now
    EnemyAI.chase(this.kind, this, targetX, targetY, this.speed, speedMultiplier)
    const body = this.body as Phaser.Physics.Arcade.Body

    // Knockback adds a short impulse without replacing regular AI steering.
    this.knockbackVelocity.scale(0.82)
    if (this.knockbackVelocity.lengthSq() < 4) {
      this.knockbackVelocity.set(0, 0)
    }
    body.velocity.x += this.knockbackVelocity.x
    body.velocity.y += this.knockbackVelocity.y

    if (this.kind === ENEMY_IDS.CI_CD_BOT) {
      if (now >= this.nextSpecialAtMs) {
        this.nextSpecialAtMs = now + Phaser.Math.Between(2400, 3600)
        this.dashUntilMs = now + 260
      }
      if (now <= this.dashUntilMs) {
        body.velocity.scale(1.95)
      }
    }

    if (this.kind === ENEMY_IDS.LEGACY_MONOLITH && now >= this.nextSpecialAtMs) {
      this.nextSpecialAtMs = now + Phaser.Math.Between(4600, 6000)
      return {
        kind: ENEMY_IDS.AUTOMATOR_SWARM,
        count: 2,
      }
    }

    if (this.kind === ENEMY_IDS.MEETING_MONSTER && now >= this.nextSpecialAtMs) {
      this.nextSpecialAtMs = now + Phaser.Math.Between(5200, 6800)
      return {
        kind: ENEMY_IDS.AUTOMATOR_SWARM,
        count: 1,
      }
    }

    return null
  }

  applyDamage(amount: number): boolean {
    if (!this.alive) {
      return false
    }
    this.hp = Math.max(0, this.hp - amount)
    if (this.hp <= 0) {
      this.die()
      return true
    }
    return false
  }

  flashHit(): void {
    this.setTintFill(0xffffff)
    this.scene.time.delayedCall(55, () => {
      if (this.active) {
        this.clearTint()
      }
    })
  }

  die(): void {
    this.alive = false
    this.destroy()
  }

  getPosition(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(this.x, this.y)
  }

  getKind(): EnemyKind {
    return this.kind
  }

  getContactDamage(): number {
    return this.contactDamage
  }

  getScoreValue(): number {
    return this.scoreValue
  }

  getHp(): number {
    return this.hp
  }

  getMaxHp(): number {
    return this.maxHp
  }

  isAlive(): boolean {
    return this.alive
  }

  applyKnockbackFrom(originX: number, originY: number, force: number): void {
    if (!this.alive || force <= 0) {
      return
    }
    const away = new Phaser.Math.Vector2(this.x - originX, this.y - originY)
    const normalized = away.lengthSq() > 0 ? away.normalize() : new Phaser.Math.Vector2(1, 0)
    this.knockbackVelocity.add(normalized.scale(force))
  }
}
