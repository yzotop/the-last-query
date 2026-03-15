import Phaser from 'phaser'
import { PLAYER_TUNING } from '../../core/config'
import { CooldownTimer } from '../../core/timers'
import { ATTACK_MODES, type AttackMode } from '../../combat/AttackModes'
import { Player } from './Player'

export type AttackHitData = {
  damage: number
  attackMode: AttackMode
  knockback: number
}

type EnemyHitCallback = (enemySprite: Phaser.Physics.Arcade.Sprite, hit: AttackHitData) => void

export class PlayerCombat {
  private readonly player: Player
  private readonly attackRadius = PLAYER_TUNING.attackRadius
  private attackRadiusMultiplier = 1
  private readonly swordDamage = 1
  private damageMultiplier = 1
  private nextHitMassive = false
  private readonly attackCooldowns: Record<AttackMode, CooldownTimer>
  private lastAttackWasMassive = false
  private lastSwingDirection = new Phaser.Math.Vector2(1, 0)
  private lastSwingOrigin = new Phaser.Math.Vector2(0, 0)
  private lastAttackMode: AttackMode = ATTACK_MODES.SELECT_SLASH

  constructor(player: Player) {
    this.player = player
    this.attackCooldowns = {
      [ATTACK_MODES.SELECT_SLASH]: new CooldownTimer(PLAYER_TUNING.attackCooldownMs),
      [ATTACK_MODES.JOIN_WAVE]: new CooldownTimer(2000),
      [ATTACK_MODES.WHERE_STRIKE]: new CooldownTimer(1000),
      [ATTACK_MODES.GROUP_BY_SHOCKWAVE]: new CooldownTimer(4000),
      [ATTACK_MODES.JOIN_STORM]: new CooldownTimer(3000),
      [ATTACK_MODES.GROUP_BY_EXPLOSION]: new CooldownTimer(4000),
      [ATTACK_MODES.DELETE_FROM]: new CooldownTimer(8000),
    }
  }

  attack(
    scene: Phaser.Scene,
    now: number,
    mode: AttackMode,
    targets: Phaser.Physics.Arcade.Group | Phaser.Physics.Arcade.Group[],
    onEnemyHit: EnemyHitCallback,
  ): boolean {
    const cooldown = this.attackCooldowns[mode]
    if (!cooldown.canUse(now)) {
      return false
    }
    cooldown.trigger(now)
    this.lastAttackMode = mode

    const facing = this.player.getFacing()
    this.lastSwingDirection = facing.clone()
    const modeRadiusMultiplier =
      mode === ATTACK_MODES.JOIN_WAVE
        ? 1.4
        : mode === ATTACK_MODES.WHERE_STRIKE
          ? 0.78
          : mode === ATTACK_MODES.GROUP_BY_SHOCKWAVE
            ? 1.25
            : mode === ATTACK_MODES.JOIN_STORM
              ? 1.18
              : mode === ATTACK_MODES.GROUP_BY_EXPLOSION
                ? 1.1
                : mode === ATTACK_MODES.DELETE_FROM
                  ? 1.55
            : 1
    const currentRadius = this.attackRadius * this.attackRadiusMultiplier * modeRadiusMultiplier
    const slashX = this.player.x + facing.x * 18
    const slashY = this.player.y + facing.y * 18
    const originX = mode === ATTACK_MODES.GROUP_BY_SHOCKWAVE ? this.player.x : slashX
    const originY = mode === ATTACK_MODES.GROUP_BY_SHOCKWAVE ? this.player.y : slashY
    this.lastSwingOrigin.set(originX, originY)
    const baseDamage = this.swordDamage * this.damageMultiplier
    const modeDamageMultiplier =
      mode === ATTACK_MODES.WHERE_STRIKE
        ? 2
        : mode === ATTACK_MODES.GROUP_BY_SHOCKWAVE
          ? 0.8
          : mode === ATTACK_MODES.JOIN_WAVE
            ? 1.1
            : mode === ATTACK_MODES.JOIN_STORM
              ? 1.2
              : mode === ATTACK_MODES.GROUP_BY_EXPLOSION
                ? 1.35
                : mode === ATTACK_MODES.DELETE_FROM
                  ? 2.4
            : 1
    const damage = this.nextHitMassive ? Math.max(50, baseDamage * 20) : Math.max(1, baseDamage * modeDamageMultiplier)
    this.lastAttackWasMassive = damage >= 50
    let anyHit = false
    const modeColor =
      mode === ATTACK_MODES.JOIN_WAVE
        ? 0x9f85ff
        : mode === ATTACK_MODES.WHERE_STRIKE
          ? 0x59ffca
          : mode === ATTACK_MODES.GROUP_BY_SHOCKWAVE
            ? 0xffb35f
            : mode === ATTACK_MODES.JOIN_STORM
              ? 0x8ab5ff
              : mode === ATTACK_MODES.GROUP_BY_EXPLOSION
                ? 0xb98cff
                : mode === ATTACK_MODES.DELETE_FROM
                  ? 0xff6f6f
            : 0x2cd8ff
    const trailColor =
      mode === ATTACK_MODES.JOIN_WAVE
        ? 0xcb9dff
        : mode === ATTACK_MODES.WHERE_STRIKE
          ? 0x88ffd5
          : mode === ATTACK_MODES.GROUP_BY_SHOCKWAVE
            ? 0xffcc84
            : mode === ATTACK_MODES.JOIN_STORM
              ? 0xb9d1ff
              : mode === ATTACK_MODES.GROUP_BY_EXPLOSION
                ? 0xd3b7ff
                : mode === ATTACK_MODES.DELETE_FROM
                  ? 0xff9b9b
            : 0x6de9ff
    const finalColor = this.lastAttackWasMassive ? 0xffe76a : modeColor

    const sword = scene.add
      .ellipse(
        originX + facing.x * 4,
        originY + facing.y * 4,
        mode === ATTACK_MODES.GROUP_BY_SHOCKWAVE ? currentRadius * 2.2 : currentRadius * 2.1,
        mode === ATTACK_MODES.WHERE_STRIKE ? currentRadius * 0.92 : currentRadius * 1.25,
        finalColor,
        this.lastAttackWasMassive ? 0.28 : 0.2,
      )
      .setDepth(20)
    sword.setRotation(mode === ATTACK_MODES.GROUP_BY_SHOCKWAVE ? 0 : Math.atan2(facing.y, facing.x))

    const trail = scene.add
      .rectangle(
        this.player.x + facing.x * 12,
        this.player.y + facing.y * 12,
        mode === ATTACK_MODES.WHERE_STRIKE ? 18 : mode === ATTACK_MODES.GROUP_BY_SHOCKWAVE ? 10 : 24,
        mode === ATTACK_MODES.WHERE_STRIKE ? 3 : 5,
        this.lastAttackWasMassive ? 0xffb13b : trailColor,
        0.42,
      )
      .setDepth(20)
    trail.setRotation(mode === ATTACK_MODES.GROUP_BY_SHOCKWAVE ? 0 : Math.atan2(facing.y, facing.x))

    scene.tweens.add({
      targets: sword,
      alpha: 0,
      scaleX: mode === ATTACK_MODES.GROUP_BY_SHOCKWAVE ? 1.35 : 1.12,
      scaleY: mode === ATTACK_MODES.GROUP_BY_SHOCKWAVE ? 1.35 : 1.06,
      duration: mode === ATTACK_MODES.WHERE_STRIKE ? 100 : 140,
      onComplete: () => sword.destroy(),
    })
    scene.tweens.add({
      targets: trail,
      alpha: 0,
      duration: 130,
      onComplete: () => trail.destroy(),
    })

    const ghostCount = mode === ATTACK_MODES.WHERE_STRIKE ? 2 : mode === ATTACK_MODES.GROUP_BY_SHOCKWAVE ? 4 : 3
    for (let i = 1; i <= ghostCount; i += 1) {
      const ghost = scene.add.ellipse(
        originX + facing.x * (4 - i * 3),
        originY + facing.y * (4 - i * 3),
        currentRadius * 2.05,
        mode === ATTACK_MODES.WHERE_STRIKE ? currentRadius * 0.9 : currentRadius * 1.2,
        finalColor,
        0.14 - i * 0.03,
      )
      ghost.setDepth(19)
      ghost.setRotation(mode === ATTACK_MODES.GROUP_BY_SHOCKWAVE ? 0 : Math.atan2(facing.y, facing.x))
      scene.time.delayedCall(24 * i, () => {
        scene.tweens.add({
          targets: ghost,
          alpha: 0,
          duration: 90,
          onComplete: () => ghost.destroy(),
        })
      })
    }

    const groups = Array.isArray(targets) ? targets : [targets]
    groups.forEach((group) => {
      group.children.each((entry) => {
        const enemy = entry as Phaser.Physics.Arcade.Sprite
        if (!enemy.active) {
          return false
        }
        const distance = Phaser.Math.Distance.Between(originX, originY, enemy.x, enemy.y)
        if (distance <= currentRadius) {
          onEnemyHit(enemy, {
            damage,
            attackMode: mode,
            knockback: mode === ATTACK_MODES.GROUP_BY_SHOCKWAVE ? 210 : 0,
          })
          anyHit = true
        }
        return false
      })
    })

    if (anyHit && this.nextHitMassive) {
      this.nextHitMassive = false
    }
    return true
  }

  setDamageMultiplier(multiplier: number): void {
    this.damageMultiplier = Math.max(0.1, multiplier)
  }

  setAttackRadiusMultiplier(multiplier: number): void {
    this.attackRadiusMultiplier = Phaser.Math.Clamp(multiplier, 1, 1.8)
  }

  enableNextHitMassive(): void {
    this.nextHitMassive = true
  }

  wasLastAttackMassive(): boolean {
    return this.lastAttackWasMassive
  }

  getLastSwingDirection(): Phaser.Math.Vector2 {
    return this.lastSwingDirection.clone()
  }

  getLastSwingOrigin(): Phaser.Math.Vector2 {
    return this.lastSwingOrigin.clone()
  }

  getLastAttackMode(): AttackMode {
    return this.lastAttackMode
  }
}
