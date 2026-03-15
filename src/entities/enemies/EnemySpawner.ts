import Phaser from 'phaser'
import { ENEMY_TUNING, GAME_CONFIG } from '../../core/config'
import type { EnemyKind } from '../../core/types'
import { Enemy, type EnemySpawnRequest } from './Enemy'
import { EnemyFactory } from './EnemyFactory'
import { ENEMY_SPAWN_POOL } from './EnemyTypes'

export class EnemySpawner {
  private readonly scene: Phaser.Scene
  private readonly enemies: Phaser.Physics.Arcade.Group
  private readonly worldBounds: Phaser.Geom.Rectangle
  private spawnTimer: Phaser.Time.TimerEvent
  private readonly factory: EnemyFactory
  private readonly onEnemySpawned?: (enemy: Enemy) => void
  private currentSpawnDelayMs: number = ENEMY_TUNING.spawnDelayMs

  constructor(scene: Phaser.Scene, enemies: Phaser.Physics.Arcade.Group, onEnemySpawned?: (enemy: Enemy) => void) {
    this.scene = scene
    this.enemies = enemies
    this.worldBounds = scene.physics.world.bounds
    this.factory = new EnemyFactory()
    this.onEnemySpawned = onEnemySpawned
    this.spawnTimer = this.createSpawnTimer(this.currentSpawnDelayMs)
  }

  stop(): void {
    this.spawnTimer.destroy()
  }

  pause(): void {
    this.spawnTimer.paused = true
  }

  resume(): void {
    this.spawnTimer.paused = false
  }

  setSpawnDelayMs(delayMs: number): void {
    const nextDelay = Math.max(100, Math.floor(delayMs))
    if (nextDelay === this.currentSpawnDelayMs) {
      return
    }
    this.currentSpawnDelayMs = nextDelay
    this.spawnTimer.destroy()
    this.spawnTimer = this.createSpawnTimer(this.currentSpawnDelayMs)
  }

  private spawnEnemy(): void {
    const spawnPoint = this.pickEdgeSpawnPoint()
    const kind = ENEMY_SPAWN_POOL[Phaser.Math.Between(0, ENEMY_SPAWN_POOL.length - 1)] as EnemyKind
    this.spawnEnemyByKind(kind, spawnPoint.x, spawnPoint.y)
  }

  spawnBurst(count: number, forcedKind?: EnemyKind): void {
    for (let i = 0; i < count; i += 1) {
      const spawnPoint = this.pickEdgeSpawnPoint()
      const kind =
        forcedKind ?? (ENEMY_SPAWN_POOL[Phaser.Math.Between(0, ENEMY_SPAWN_POOL.length - 1)] as EnemyKind)
      this.spawnEnemyByKind(kind, spawnPoint.x, spawnPoint.y)
    }
  }

  spawnAt(x: number, y: number, count: number, forcedKind: EnemyKind): void {
    for (let i = 0; i < count; i += 1) {
      const jitterX = Phaser.Math.Between(-16, 16)
      const jitterY = Phaser.Math.Between(-16, 16)
      this.spawnEnemyByKind(forcedKind, x + jitterX, y + jitterY)
    }
  }

  private createSpawnTimer(delay: number): Phaser.Time.TimerEvent {
    return this.scene.time.addEvent({
      delay,
      loop: true,
      callback: this.spawnEnemy,
      callbackScope: this,
    })
  }

  private pickEdgeSpawnPoint(): Phaser.Math.Vector2 {
    const side = Phaser.Math.Between(0, 3)
    switch (side) {
      case 0:
        return new Phaser.Math.Vector2(
          Phaser.Math.Between(this.worldBounds.left, this.worldBounds.right),
          this.worldBounds.top + GAME_CONFIG.worldInset,
        )
      case 1:
        return new Phaser.Math.Vector2(
          this.worldBounds.right - GAME_CONFIG.worldInset,
          Phaser.Math.Between(this.worldBounds.top, this.worldBounds.bottom),
        )
      case 2:
        return new Phaser.Math.Vector2(
          Phaser.Math.Between(this.worldBounds.left, this.worldBounds.right),
          this.worldBounds.bottom - GAME_CONFIG.worldInset,
        )
      default:
        return new Phaser.Math.Vector2(
          this.worldBounds.left + GAME_CONFIG.worldInset,
          Phaser.Math.Between(this.worldBounds.top, this.worldBounds.bottom),
        )
    }
  }

  static updateEnemies(
    enemies: Phaser.Physics.Arcade.Group,
    targetX: number,
    targetY: number,
    speedMultiplier = 1,
    onSpawnRequest?: (enemy: Enemy, request: EnemySpawnRequest) => void,
  ): void {
    enemies.children.each((entry) => {
      const enemy = entry as Enemy
      if (!enemy.active || !enemy.isAlive()) {
        return false
      }
      const spawnRequest = enemy.updateBehavior(targetX, targetY, speedMultiplier)
      if (spawnRequest && onSpawnRequest) {
        onSpawnRequest(enemy, spawnRequest)
      }
      return false
    })
  }

  private spawnEnemyByKind(kind: EnemyKind, x: number, y: number): void {
    const enemy = this.factory.create(this.scene, x, y, kind)
    this.enemies.add(enemy)
    this.onEnemySpawned?.(enemy)
  }
}
