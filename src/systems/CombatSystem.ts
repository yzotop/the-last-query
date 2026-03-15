import Phaser from 'phaser'
import { ENEMY_TUNING } from '../core/config'
import type { EnemyKind } from '../core/types'
import type { AttackMode } from '../combat/AttackModes'
import { TherapistBoss } from '../entities/bosses/TherapistBoss'
import { Enemy } from '../entities/enemies/Enemy'
import { Player } from '../entities/player/Player'
import { PlayerCombat } from '../entities/player/PlayerCombat'

export type HitDetail = {
  position: Phaser.Math.Vector2
  damage: number
  isCritical: boolean
  isBoss: boolean
  attackMode: AttackMode
  enemyKind?: EnemyKind
}

export type AttackOutcome = {
  hitLanded: boolean
  enemiesKilled: Enemy[]
  bossDefeated: boolean
  bossHit: boolean
  hitPositions: Phaser.Math.Vector2[]
  hitDetails: HitDetail[]
  massiveHitLanded: boolean
  totalDamageDealt: number
  attackMode: AttackMode
  criticalHits: number
  attackPerformed: boolean
}

export type ContactOutcome = {
  playerHit: boolean
  damageTaken: number
}

export class CombatSystem {
  private lastContactHitAt = 0
  private lastBossContactHitAt = 0

  resolvePlayerAttack(
    scene: Phaser.Scene,
    now: number,
    attackMode: AttackMode,
    playerCombat: PlayerCombat,
    enemies: Phaser.Physics.Arcade.Group,
    bosses?: Phaser.Physics.Arcade.Group,
  ): AttackOutcome {
    const outcome: AttackOutcome = {
      hitLanded: false,
      enemiesKilled: [],
      bossDefeated: false,
      bossHit: false,
      hitPositions: [],
      hitDetails: [],
      massiveHitLanded: false,
      totalDamageDealt: 0,
      attackMode,
      criticalHits: 0,
      attackPerformed: false,
    }

    const targetGroups = bosses ? [enemies, bosses] : [enemies]
    const attackPerformed = playerCombat.attack(scene, now, attackMode, targetGroups, (enemySprite, hit) => {
      let damage = hit.damage
      const isCritical = Math.random() < 0.1
      if (isCritical) {
        damage = Math.max(1, Math.round(damage * 2))
        outcome.criticalHits += 1
      }
      if (damage > 0) {
        outcome.hitLanded = true
        outcome.totalDamageDealt += damage
        if (damage >= 50) {
          outcome.massiveHitLanded = true
        }
      }

      if (enemySprite instanceof TherapistBoss) {
        enemySprite.flashHit()
        outcome.bossHit = true
        const pos = enemySprite.getPosition()
        outcome.hitPositions.push(pos)
        outcome.hitDetails.push({
          position: pos,
          damage,
          isCritical,
          isBoss: true,
          attackMode: hit.attackMode,
        })
        if (enemySprite.applyDamage(damage)) {
          outcome.bossDefeated = true
        }
        return
      }

      const enemy = enemySprite as Enemy
      enemy.flashHit()
      const pos = enemy.getPosition()
      outcome.hitPositions.push(pos)
      outcome.hitDetails.push({
        position: pos,
        damage,
        isCritical,
        isBoss: false,
        attackMode: hit.attackMode,
        enemyKind: enemy.getKind(),
      })
      if (hit.knockback > 0) {
        const origin = playerCombat.getLastSwingOrigin()
        enemy.applyKnockbackFrom(origin.x, origin.y, hit.knockback)
      }
      if (enemy.applyDamage(damage)) {
        outcome.enemiesKilled.push(enemy)
      }
    })
    outcome.attackPerformed = attackPerformed

    return outcome
  }

  resolveEnemyContact(now: number, player: Player, enemy: Enemy): ContactOutcome {
    if (now - this.lastContactHitAt < ENEMY_TUNING.touchCooldownMs) {
      return { playerHit: false, damageTaken: 0 }
    }
    const damageTaken = player.applyDamage(enemy.getContactDamage())
    if (damageTaken <= 0) {
      return { playerHit: false, damageTaken: 0 }
    }
    this.lastContactHitAt = now
    return { playerHit: true, damageTaken }
  }

  resolveBossContact(now: number, player: Player, boss: TherapistBoss): ContactOutcome {
    if (now - this.lastBossContactHitAt < ENEMY_TUNING.touchCooldownMs) {
      return { playerHit: false, damageTaken: 0 }
    }
    const damageTaken = player.applyDamage(boss.getContactDamage())
    if (damageTaken <= 0) {
      return { playerHit: false, damageTaken: 0 }
    }
    this.lastBossContactHitAt = now
    return { playerHit: true, damageTaken }
  }
}
