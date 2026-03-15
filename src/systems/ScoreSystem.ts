import Phaser from 'phaser'
import { SCORE_TUNING } from '../core/config'
import { gameState } from '../core/gameState'

export type ComboState = {
  comboCount: number
  multiplier: number
}

export class ScoreSystem {
  private comboCount = 0
  private comboMultiplier = 1
  private globalMultiplier = 1
  private comboEndsAtMs = 0

  addKillScore(scoreValue: number): void {
    const adjusted = Math.max(1, Math.round(scoreValue * this.comboMultiplier * this.globalMultiplier))
    gameState.addScore(adjusted)
  }

  addSurvivalScore(deltaMs: number): void {
    const gain = Math.floor((deltaMs / 100) * SCORE_TUNING.survivalPointsPer100ms)
    if (gain > 0) {
      gameState.addScore(Math.max(1, Math.round(gain * this.comboMultiplier * this.globalMultiplier)))
    }
  }

  setGlobalMultiplier(multiplier: number): void {
    this.globalMultiplier = Phaser.Math.Clamp(multiplier, 1, 3)
  }

  registerAttackHit(nowMs: number): void {
    this.comboCount += 1
    this.comboMultiplier = Phaser.Math.Clamp(1 + Math.floor(this.comboCount / 4) * 0.1, 1, 2.4)
    this.comboEndsAtMs = nowMs + 3200
  }

  registerAttackMiss(nowMs: number): void {
    if (nowMs > this.comboEndsAtMs) {
      this.comboCount = 0
      this.comboMultiplier = 1
    }
  }

  updateCombo(nowMs: number): void {
    if (this.comboCount > 0 && nowMs > this.comboEndsAtMs) {
      this.comboCount = 0
      this.comboMultiplier = 1
    }
  }

  resetCombo(): void {
    this.comboCount = 0
    this.comboMultiplier = 1
    this.comboEndsAtMs = 0
  }

  getComboState(): ComboState {
    return {
      comboCount: this.comboCount,
      multiplier: this.comboMultiplier,
    }
  }
}
