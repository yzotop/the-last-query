import { ENEMY_TUNING } from '../core/config'
import { gameState } from '../core/gameState'

export class DifficultySystem {
  getTier(elapsedMs: number): number {
    // Increase roughly every 30 seconds.
    return Math.min(6, 1 + Math.floor(elapsedMs / 30000))
  }

  getSpawnDelayMs(elapsedMs: number): number {
    const tier = this.getTier(elapsedMs)
    const scaled = Math.floor(ENEMY_TUNING.spawnDelayMs * (1 - (tier - 1) * 0.08))
    return Math.max(520, scaled)
  }

  update(elapsedMs: number): void {
    gameState.setDifficultyTier(this.getTier(elapsedMs))
  }
}
