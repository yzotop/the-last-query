import Phaser from 'phaser'
import { PLAYER_TUNING } from '../../core/config'

export class Player {
  public readonly sprite: Phaser.Physics.Arcade.Sprite
  private hp: number = PLAYER_TUNING.initialHp
  private readonly moveSpeed: number = PLAYER_TUNING.moveSpeed
  private moveSpeedMultiplier = 1
  private damageReductionMultiplier = 1
  private invulnerable = false
  private facing = new Phaser.Math.Vector2(1, 0)
  private alive = true

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, 'player')
    this.sprite.setCollideWorldBounds(true)

    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setSize(14, 16)
    body.setOffset(1, 0)
  }

  get x(): number {
    return this.sprite.x
  }

  get y(): number {
    return this.sprite.y
  }

  getHp(): number {
    return this.hp
  }

  getMoveSpeed(): number {
    return this.moveSpeed * this.moveSpeedMultiplier
  }

  isAlive(): boolean {
    return this.alive
  }

  getFacing(): Phaser.Math.Vector2 {
    return this.facing.clone()
  }

  setFacing(direction: Phaser.Math.Vector2): void {
    if (direction.lengthSq() === 0) {
      return
    }
    this.facing = direction.normalize()
  }

  setVelocity(x: number, y: number): void {
    this.sprite.setVelocity(x, y)
  }

  stop(): void {
    this.sprite.setVelocity(0, 0)
  }

  applyDamage(amount: number): number {
    if (this.invulnerable || amount <= 0) {
      return 0
    }
    const reducedAmount = Math.max(1, Math.floor(amount * this.damageReductionMultiplier))
    const previous = this.hp
    this.hp = Math.max(0, this.hp - reducedAmount)
    this.alive = this.hp > 0
    return previous - this.hp
  }

  heal(amount: number): number {
    if (amount <= 0) {
      return 0
    }
    const previous = this.hp
    this.hp = Math.min(PLAYER_TUNING.initialHp, this.hp + amount)
    return this.hp - previous
  }

  setMoveSpeedMultiplier(multiplier: number): void {
    this.moveSpeedMultiplier = Math.max(0.1, multiplier)
  }

  setDamageReductionMultiplier(multiplier: number): void {
    this.damageReductionMultiplier = Phaser.Math.Clamp(multiplier, 0.2, 1)
  }

  setInvulnerable(value: boolean): void {
    this.invulnerable = value
  }

  isInvulnerable(): boolean {
    return this.invulnerable
  }
}
