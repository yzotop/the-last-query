import Phaser from 'phaser'
import { ENEMY_IDS } from '../../core/constants'
import type { EnemyKind } from '../../core/types'

export class EnemyAI {
  static chase(
    kind: EnemyKind,
    enemy: Phaser.Physics.Arcade.Sprite,
    targetX: number,
    targetY: number,
    baseSpeed: number,
    speedMultiplier = 1,
  ): void {
    const direction = new Phaser.Math.Vector2(targetX - enemy.x, targetY - enemy.y)
    if (direction.lengthSq() === 0) {
      enemy.setVelocity(0, 0)
      return
    }

    const normalized = direction.normalize()
    let vx = normalized.x * baseSpeed * speedMultiplier
    let vy = normalized.y * baseSpeed * speedMultiplier

    // Keep behaviors simple and close to MVP while differentiating enemy feel.
    if (kind === ENEMY_IDS.BURNOUT_GHOST) {
      const wobble = Math.sin(enemy.scene.time.now / 120 + enemy.x * 0.03) * 36
      vx += wobble
      vy += Math.cos(enemy.scene.time.now / 140 + enemy.y * 0.03) * 20
    } else if (kind === ENEMY_IDS.SLACK_NOTIFIER) {
      const pulse = Math.sin(enemy.scene.time.now / 90 + enemy.y * 0.02)
      const pulseBoost = pulse > 0.72 ? 1.55 : 1
      vx *= pulseBoost
      vy *= pulseBoost
      // Sideways offset creates a more readable zig-zag "notification spam" path.
      const strafe = new Phaser.Math.Vector2(-normalized.y, normalized.x).scale(Math.sin(enemy.scene.time.now / 85 + enemy.x * 0.03) * 58)
      vx += strafe.x
      vy += strafe.y
      if (pulse > 0.8 && Phaser.Math.Between(0, 100) < 16) {
        const ping = enemy.scene.add.circle(enemy.x, enemy.y, 5, 0x7b8cff, 0.25)
        enemy.scene.tweens.add({
          targets: ping,
          alpha: 0,
          scaleX: 1.8,
          scaleY: 1.8,
          duration: 140,
          onComplete: () => ping.destroy(),
        })
      }
    } else if (kind === ENEMY_IDS.EXCEL_ZOMBIE) {
      vx *= 0.86
      vy *= 0.86
    } else if (kind === ENEMY_IDS.ORCHESTRATOR || kind === ENEMY_IDS.MEETING_MONSTER) {
      vx *= 0.92
      vy *= 0.92
    } else if (kind === ENEMY_IDS.LEGACY_MONOLITH) {
      vx *= 0.78
      vy *= 0.78
    } else if (kind === ENEMY_IDS.CI_CD_BOT) {
      vx *= 1.04
      vy *= 1.04
    }

    enemy.setVelocity(vx, vy)
  }
}
