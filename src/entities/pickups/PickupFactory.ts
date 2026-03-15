import Phaser from 'phaser'
import type { PickupId } from '../../core/types'
import { Pickup } from './Pickup'
import { PICKUP_TYPE_CONFIGS } from './PickupTypes'

export class PickupFactory {
  create(scene: Phaser.Scene, x: number, y: number, type: PickupId): Pickup {
    const config = PICKUP_TYPE_CONFIGS[type]
    return new Pickup(scene, x, y, {
      pickupType: type,
      texture: config.texture,
      value: config.magnitude,
      durationMs: config.durationMs,
    })
  }
}
