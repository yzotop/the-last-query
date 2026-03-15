import Phaser from 'phaser'
import type { EnemyKind } from '../../core/types'
import { Enemy } from './Enemy'
import { ENEMY_TYPE_CONFIGS } from './EnemyTypes'

export class EnemyFactory {
  create(scene: Phaser.Scene, x: number, y: number, kind: EnemyKind): Enemy {
    return new Enemy(scene, x, y, ENEMY_TYPE_CONFIGS[kind])
  }
}
