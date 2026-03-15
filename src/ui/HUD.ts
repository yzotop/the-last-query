import Phaser from 'phaser'
import type { GameStateSnapshot } from '../core/types'

export class HUD {
  private readonly hpText: Phaser.GameObjects.Text
  private readonly scoreText: Phaser.GameObjects.Text
  private readonly timeText: Phaser.GameObjects.Text
  private readonly tierText: Phaser.GameObjects.Text
  private readonly comboText: Phaser.GameObjects.Text
  private readonly hintText: Phaser.GameObjects.Text
  private readonly bossText: Phaser.GameObjects.Text
  private readonly panel: Phaser.GameObjects.Rectangle
  private readonly bossPanel: Phaser.GameObjects.Rectangle
  private flickerTween: Phaser.Tweens.Tween | null = null

  constructor(scene: Phaser.Scene) {
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#d7e6ff',
    }

    this.panel = scene.add
      .rectangle(170, 78, 316, 150, 0x121a29, 0.72)
      .setStrokeStyle(2, 0x2e4c78)
      .setScrollFactor(0)
      .setDepth(12)

    this.hpText = scene.add.text(16, 12, 'HP: 100', textStyle).setScrollFactor(0).setDepth(13)
    this.scoreText = scene.add.text(16, 32, 'Score: 0', textStyle).setScrollFactor(0).setDepth(13)
    this.timeText = scene.add.text(16, 52, 'Time: 00:00', textStyle).setScrollFactor(0).setDepth(13)
    this.tierText = scene.add.text(16, 72, 'Tier: 1', textStyle).setScrollFactor(0).setDepth(13)
    this.comboText = scene
      .add.text(16, 92, 'Combo: x1.0 (0)', {
        ...textStyle,
        fontSize: '14px',
        color: '#ffd57a',
      })
      .setScrollFactor(0)
      .setDepth(13)
    this.hintText = scene
      .add.text(16, 112, 'SPACE SELECT | ALT+SPACE JOIN STORM | E GROUP EXP | X DELETE FROM', {
        ...textStyle,
        fontSize: '11px',
        color: '#86ffcf',
      })
      .setScrollFactor(0)
      .setDepth(13)

    this.bossPanel = scene.add
      .rectangle(840, 24, 224, 36, 0x21182d, 0.72)
      .setStrokeStyle(2, 0x6a3f77)
      .setScrollFactor(0)
      .setDepth(12)
      .setVisible(false)

    this.bossText = scene.add
      .text(944, 12, '', {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: '#ff9fd8',
        fontStyle: 'bold',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(13)
      .setVisible(false)
  }

  update(
    snapshot: GameStateSnapshot,
    bossHp?: { current: number; max: number } | null,
    combo?: { comboCount: number; multiplier: number },
  ): void {
    const totalSeconds = Math.floor(snapshot.elapsedMs / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    this.hpText.setText(`Ресурс: ${snapshot.hp}/${snapshot.maxHp}`)
    this.scoreText.setText(`Очки: ${snapshot.score}`)
    this.timeText.setText(`Время выживания: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`)
    this.tierText.setText(`Уровень хаоса: ${snapshot.difficultyTier}`)
    this.comboText.setText(`Combo: x${(combo?.multiplier ?? 1).toFixed(1)} (${combo?.comboCount ?? 0})`)
    if (bossHp && bossHp.current > 0) {
      this.bossText.setText(`THERAPIST HP: ${bossHp.current}/${bossHp.max}`)
      this.bossPanel.setVisible(true)
      this.bossText.setVisible(true)
    } else {
      this.bossPanel.setVisible(false)
      this.bossText.setVisible(false)
    }
  }

  flicker(durationMs: number): void {
    if (this.flickerTween) {
      this.flickerTween.stop()
      this.flickerTween = null
    }
    const targets = [this.panel, this.hpText, this.scoreText, this.timeText, this.tierText, this.comboText]
    this.flickerTween = this.panel.scene.tweens.add({
      targets,
      alpha: { from: 1, to: 0.45 },
      yoyo: true,
      repeat: -1,
      duration: 90,
    })
    this.panel.scene.time.delayedCall(durationMs, () => {
      this.flickerTween?.stop()
      this.flickerTween = null
      targets.forEach((target) => target.setAlpha(1))
    })
  }

  destroy(): void {
    this.flickerTween?.stop()
    this.panel.destroy()
    this.bossPanel.destroy()
    this.hpText.destroy()
    this.scoreText.destroy()
    this.timeText.destroy()
    this.tierText.destroy()
    this.comboText.destroy()
    this.hintText.destroy()
    this.bossText.destroy()
  }
}
