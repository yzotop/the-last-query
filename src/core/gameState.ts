import { PLAYER_TUNING } from './config'
import { GAME_EVENTS } from './constants'
import { eventBus } from './eventBus'
import type { GameStateSnapshot } from './types'

class GameStateStore {
  private state: GameStateSnapshot = {
    hp: PLAYER_TUNING.initialHp,
    maxHp: PLAYER_TUNING.initialHp,
    score: 0,
    elapsedMs: 0,
    buffs: [],
    difficultyTier: 1,
    gameOver: false,
  }

  reset(): void {
    this.state = {
      hp: PLAYER_TUNING.initialHp,
      maxHp: PLAYER_TUNING.initialHp,
      score: 0,
      elapsedMs: 0,
      buffs: [],
      difficultyTier: 1,
      gameOver: false,
    }
    eventBus.emit(GAME_EVENTS.SCORE_CHANGED, this.getSnapshot())
  }

  getSnapshot(): GameStateSnapshot {
    return {
      ...this.state,
      buffs: [...this.state.buffs],
    }
  }

  tick(deltaMs: number): void {
    this.state.elapsedMs += deltaMs
  }

  addScore(amount: number): void {
    this.state.score += Math.max(0, amount)
    eventBus.emit(GAME_EVENTS.SCORE_CHANGED, this.getSnapshot())
  }

  damagePlayer(amount: number): void {
    this.state.hp = Math.max(0, this.state.hp - Math.max(0, amount))
    eventBus.emit(GAME_EVENTS.PLAYER_HIT, this.getSnapshot())
    if (this.state.hp <= 0 && !this.state.gameOver) {
      this.state.gameOver = true
      eventBus.emit(GAME_EVENTS.GAME_OVER, this.getSnapshot())
    }
  }

  healPlayer(amount: number): void {
    this.state.hp = Math.min(this.state.maxHp, this.state.hp + Math.max(0, amount))
    eventBus.emit(GAME_EVENTS.PLAYER_HIT, this.getSnapshot())
  }

  setGameOver(gameOver: boolean): void {
    this.state.gameOver = gameOver
    if (gameOver) {
      eventBus.emit(GAME_EVENTS.GAME_OVER, this.getSnapshot())
    }
  }

  setDifficultyTier(tier: number): void {
    this.state.difficultyTier = Math.max(1, Math.floor(tier))
  }
}

export const gameState = new GameStateStore()
