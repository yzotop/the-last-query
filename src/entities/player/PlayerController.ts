import Phaser from 'phaser'
import { Player } from './Player'
import { ATTACK_MODES, type AttackMode } from '../../combat/AttackModes'

export class PlayerController {
  private readonly keyboard: Phaser.Input.Keyboard.KeyboardPlugin | null
  private keyW: Phaser.Input.Keyboard.Key | null = null
  private keyA: Phaser.Input.Keyboard.Key | null = null
  private keyS: Phaser.Input.Keyboard.Key | null = null
  private keyD: Phaser.Input.Keyboard.Key | null = null
  private keySpace: Phaser.Input.Keyboard.Key | null = null
  private keyShift: Phaser.Input.Keyboard.Key | null = null
  private keyCtrl: Phaser.Input.Keyboard.Key | null = null
  private keyQ: Phaser.Input.Keyboard.Key | null = null
  private keyAlt: Phaser.Input.Keyboard.Key | null = null
  private keyE: Phaser.Input.Keyboard.Key | null = null
  private keyX: Phaser.Input.Keyboard.Key | null = null
  private hasLoggedMissingKeys = false

  constructor(scene: Phaser.Scene) {
    this.keyboard = scene.input.keyboard ?? null
    if (!this.keyboard) {
      console.log('[PlayerController] keyboard unavailable at init')
      return
    }

    this.keyW = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.keyA = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.keyS = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.keyD = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.keySpace = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.keyShift = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
    this.keyCtrl = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL)
    this.keyQ = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
    this.keyAlt = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ALT)
    this.keyE = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    this.keyX = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)

    console.log('[PlayerController] keys initialized: W A S D SPACE SHIFT CTRL ALT Q E X')
  }

  update(player: Player, options?: { reverseControls?: boolean }): void {
    if (!this.keyboard || !this.keyboard.enabled) {
      player.setVelocity(0, 0)
      return
    }
    if (!this.keyW || !this.keyA || !this.keyS || !this.keyD || !this.keySpace || !this.keyQ) {
      if (!this.hasLoggedMissingKeys) {
        console.log('[PlayerController] missing keyboard keys in update()')
        this.hasLoggedMissingKeys = true
      }
      player.setVelocity(0, 0)
      return
    }

    let vx = 0
    let vy = 0

    if (!!this.keyA?.isDown) {
      vx = -1
    } else if (!!this.keyD?.isDown) {
      vx = 1
    }

    if (!!this.keyW?.isDown) {
      vy = -1
    } else if (!!this.keyS?.isDown) {
      vy = 1
    }

    if (options?.reverseControls) {
      vx *= -1
      vy *= -1
    }

    const velocity = new Phaser.Math.Vector2(vx, vy)
    if (velocity.lengthSq() > 0) {
      velocity.normalize().scale(player.getMoveSpeed())
      player.setFacing(velocity.clone())
    }

    player.setVelocity(velocity.x, velocity.y)
  }

  consumeAttackInput(): AttackMode | null {
    if (!this.keyboard || !this.keyboard.enabled || !this.keySpace || !this.keyQ || !this.keyE || !this.keyX) {
      return null
    }
    if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
      return ATTACK_MODES.GROUP_BY_EXPLOSION
    }
    if (Phaser.Input.Keyboard.JustDown(this.keyX)) {
      return ATTACK_MODES.DELETE_FROM
    }
    if (Phaser.Input.Keyboard.JustDown(this.keyQ)) {
      return ATTACK_MODES.GROUP_BY_SHOCKWAVE
    }
    if (!Phaser.Input.Keyboard.JustDown(this.keySpace)) {
      return null
    }
    if (this.keyAlt?.isDown) {
      return ATTACK_MODES.JOIN_STORM
    }
    if (this.keyCtrl?.isDown) {
      return ATTACK_MODES.WHERE_STRIKE
    }
    if (this.keyShift?.isDown) {
      return ATTACK_MODES.JOIN_WAVE
    }
    return ATTACK_MODES.SELECT_SLASH
  }
}
