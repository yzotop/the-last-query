import Phaser from 'phaser'
import { DROP_RATES } from '../core/config'
import { PICKUP_IDS } from '../core/constants'
import { Pickup } from '../entities/pickups/Pickup'
import { PickupFactory } from '../entities/pickups/PickupFactory'
import { PICKUP_DROP_POOL } from '../entities/pickups/PickupTypes'

export class DropSystem {
  private readonly scene: Phaser.Scene
  private readonly pickups: Phaser.Physics.Arcade.Group
  private readonly pickupFactory: PickupFactory

  constructor(scene: Phaser.Scene, pickups: Phaser.Physics.Arcade.Group) {
    this.scene = scene
    this.pickups = pickups
    this.pickupFactory = new PickupFactory()
  }

  trySpawnPickupFromEnemyDeath(x: number, y: number, chanceMultiplier = 1): Pickup | null {
    const dropChance = Phaser.Math.Clamp(DROP_RATES.defaultPickupChance * chanceMultiplier, 0, 0.95)
    if (Math.random() > dropChance) {
      return null
    }
    const pickupType =
      PICKUP_DROP_POOL[Phaser.Math.Between(0, PICKUP_DROP_POOL.length - 1)] ?? PICKUP_IDS.THERAPY_SESSION
    const pickup = this.pickupFactory.create(this.scene, x, y, pickupType)
    this.pickups.add(pickup)
    return pickup
  }

  spawnGuaranteedPickup(x: number, y: number): Pickup {
    const pickupType =
      PICKUP_DROP_POOL[Phaser.Math.Between(0, PICKUP_DROP_POOL.length - 1)] ?? PICKUP_IDS.THERAPY_SESSION
    const pickup = this.pickupFactory.create(this.scene, x, y, pickupType)
    this.pickups.add(pickup)
    return pickup
  }
}
