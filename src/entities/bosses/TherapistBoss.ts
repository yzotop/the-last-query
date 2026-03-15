import Phaser from 'phaser'
import { BOSS_IDS } from '../../core/constants'
import { BALANCE_CONTENT } from '../../content/balance'

export class TherapistBoss extends Phaser.Physics.Arcade.Sprite {
  private hp: number = BALANCE_CONTENT.boss.therapistHp
  private readonly maxHp: number = BALANCE_CONTENT.boss.therapistHp
  private readonly speed: number = BALANCE_CONTENT.boss.therapistSpeed
  private readonly contactDamage: number = BALANCE_CONTENT.boss.therapistContactDamage
  private readonly minionCooldownMs: number = BALANCE_CONTENT.boss.therapistMinionCooldownMs
  private nextMinionAtMs = 0
  private alive = true
  private readonly shadow: Phaser.GameObjects.Ellipse
  private readonly aura: Phaser.GameObjects.Ellipse

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy-therapist')
    this.shadow = scene.add.ellipse(x, y + 14, 36, 12, 0x000000, 0.32).setDepth(15)
    this.aura = scene.add.ellipse(x, y, 44, 44, 0xff7bd4, 0.14).setDepth(16)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setCircle(10, 1, 1)
    this.setScale(1.1)
    this.setDepth(17)
  }

  update(targetX: number, targetY: number, speedMultiplier = 1): void {
    if (!this.alive) {
      return
    }
    const direction = new Phaser.Math.Vector2(targetX - this.x, targetY - this.y)
    if (direction.lengthSq() === 0) {
      this.setVelocity(0, 0)
      return
    }
    direction.normalize().scale(this.speed * speedMultiplier)
    // Slight inertia feel to keep the boss heavy.
    this.setVelocity(direction.x * 0.9, direction.y * 0.9)
    this.setScale(1.08 + Math.sin(this.scene.time.now / 180) * 0.03)
    this.setAngle(Math.sin(this.scene.time.now / 220 + this.x * 0.02) * 3)
    this.shadow.setPosition(this.x, this.y + 14)
    this.aura.setPosition(this.x, this.y)
    this.aura.setAlpha(0.11 + (Math.sin(this.scene.time.now / 130) + 1) * 0.05)
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
    this.setTintFill(0xff9fd8)
    this.scene.time.delayedCall(75, () => {
      if (this.active) {
        this.clearTint()
      }
    })
  }

  die(): void {
    this.alive = false
    this.shadow.destroy()
    this.aura.destroy()
    this.destroy()
  }

  shouldSpawnMinion(nowMs: number): boolean {
    if (!this.alive) {
      return false
    }
    if (nowMs < this.nextMinionAtMs) {
      return false
    }
    this.nextMinionAtMs = nowMs + this.minionCooldownMs
    return true
  }

  getPosition(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(this.x, this.y)
  }

  getContactDamage(): number {
    return this.contactDamage
  }

  getHp(): number {
    return this.hp
  }

  getMaxHp(): number {
    return this.maxHp
  }

  getBossId(): string {
    return BOSS_IDS.THERAPIST_BOSS
  }

  isAlive(): boolean {
    return this.alive
  }
}
