import Phaser from 'phaser'
import { Enemy } from '../entities/enemies/Enemy'
import { TherapistBoss } from '../entities/bosses/TherapistBoss'
import { Pickup } from '../entities/pickups/Pickup'

type EnemyOverlapCallback = (enemy: Enemy) => void
type BossOverlapCallback = (boss: TherapistBoss) => void
type PickupOverlapCallback = (pickup: Pickup) => void

export class CollisionSystem {
  registerPlayerEnemyOverlap(
    scene: Phaser.Scene,
    playerSprite: Phaser.Physics.Arcade.Sprite,
    enemies: Phaser.Physics.Arcade.Group,
    onOverlap: EnemyOverlapCallback,
  ): Phaser.Physics.Arcade.Collider {
    return scene.physics.add.overlap(playerSprite, enemies, (_, enemyObj) => {
      onOverlap(enemyObj as Enemy)
    })
  }

  registerPlayerPickupOverlap(
    scene: Phaser.Scene,
    playerSprite: Phaser.Physics.Arcade.Sprite,
    pickups: Phaser.Physics.Arcade.Group,
    onOverlap: PickupOverlapCallback,
  ): Phaser.Physics.Arcade.Collider {
    return scene.physics.add.overlap(playerSprite, pickups, (_, pickupObj) => {
      onOverlap(pickupObj as Pickup)
    })
  }

  registerPlayerBossOverlap(
    scene: Phaser.Scene,
    playerSprite: Phaser.Physics.Arcade.Sprite,
    bosses: Phaser.Physics.Arcade.Group,
    onOverlap: BossOverlapCallback,
  ): Phaser.Physics.Arcade.Collider {
    return scene.physics.add.overlap(playerSprite, bosses, (_, bossObj) => {
      onOverlap(bossObj as TherapistBoss)
    })
  }
}
