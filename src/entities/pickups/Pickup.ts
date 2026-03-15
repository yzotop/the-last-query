import Phaser from 'phaser'
import type { PickupId } from '../../core/types'
import { PICKUP_IDS } from '../../core/constants'

type PickupInit = {
  pickupType: PickupId
  texture: string
  value?: number
  durationMs?: number
}

export class Pickup extends Phaser.Physics.Arcade.Sprite {
  private readonly pickupType: PickupId
  private readonly value?: number
  private readonly durationMs?: number
  private collected = false

  constructor(scene: Phaser.Scene, x: number, y: number, init: PickupInit) {
    super(scene, x, y, init.texture)
    this.pickupType = init.pickupType
    this.value = init.value
    this.durationMs = init.durationMs

    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setCircle(7, 1, 1)
    body.setAllowGravity(false)
    this.setDepth(18)
    this.applyVisualIdentity()
    this.startIdleAnimation()
  }

  collect(): boolean {
    if (this.collected || !this.active) {
      return false
    }
    this.collected = true
    this.destroy()
    return true
  }

  getType(): PickupId {
    return this.pickupType
  }

  getValue(): number | undefined {
    return this.value
  }

  getDurationMs(): number | undefined {
    return this.durationMs
  }

  getPosition(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(this.x, this.y)
  }

  private applyVisualIdentity(): void {
    if (this.pickupType === PICKUP_IDS.PUMPKIN_LATTE) {
      this.setTint(0xffb25f)
    } else if (this.pickupType === PICKUP_IDS.NEW_MACBOOK) {
      this.setTint(0xb4d5ff)
    } else if (this.pickupType === PICKUP_IDS.THERAPY_SESSION) {
      this.setTint(0x9dffc4)
    } else if (this.pickupType === PICKUP_IDS.STACKOVERFLOW_SCROLL) {
      this.setTint(0xffefb0)
    } else if (this.pickupType === PICKUP_IDS.VACATION_TICKET) {
      this.setTint(0x9deeff)
    } else if (this.pickupType === PICKUP_IDS.NOISE_CANCELLING_AIRPODS) {
      this.setTint(0xf4fbff)
    } else if (this.pickupType === PICKUP_IDS.SECOND_MONITOR) {
      this.setTint(0xb8d6ff)
    } else if (this.pickupType === PICKUP_IDS.PYTHON_SCRIPT) {
      this.setTint(0x8fffa8)
    } else if (this.pickupType === PICKUP_IDS.EXCEL_MACRO) {
      this.setTint(0x84d36a)
    } else if (this.pickupType === PICKUP_IDS.JUPYTER_NOTEBOOK) {
      this.setTint(0xd8b0ff)
    } else if (this.pickupType === PICKUP_IDS.CHATGPT_PROMPT) {
      this.setTint(0xffdc7a)
    } else if (this.pickupType === PICKUP_IDS.GIT_BLAME) {
      this.setTint(0xc5d0ff)
    } else if (this.pickupType === PICKUP_IDS.DUCKDUCKGO_QUERY) {
      this.setTint(0xffbf66)
    } else if (this.pickupType === PICKUP_IDS.POWERPOINT_DECK) {
      this.setTint(0xff8cae)
    }
  }

  private startIdleAnimation(): void {
    const baseY = this.y
    this.scene.tweens.add({
      targets: this,
      y: baseY - 4,
      duration: Phaser.Math.Between(650, 980),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    })

    this.scene.tweens.add({
      targets: this,
      scaleX: { from: 0.95, to: 1.08 },
      scaleY: { from: 0.95, to: 1.08 },
      alpha: { from: 0.82, to: 1 },
      duration: Phaser.Math.Between(520, 840),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    })
  }
}
