import Phaser from 'phaser'
import { GAME_CONFIG } from '../../core/config'

export class AnalyticsLog {
  private readonly lines: Phaser.GameObjects.Text[] = []
  private readonly maxLines = 5

  constructor(scene: Phaser.Scene) {
    scene.add
      .rectangle(198, GAME_CONFIG.height - 56, 372, 106, 0x121a29, 0.64)
      .setStrokeStyle(1, 0x2e4c78)
      .setScrollFactor(0)
      .setDepth(12)
    scene.add
      .text(18, GAME_CONFIG.height - 104, 'ANALYTICS LOG', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#ffd57a',
      })
      .setScrollFactor(0)
      .setDepth(13)

    for (let i = 0; i < this.maxLines; i += 1) {
      this.lines.push(
        scene.add
          .text(18, GAME_CONFIG.height - 86 + i * 16, '> -', {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#d7e6ff',
          })
          .setScrollFactor(0)
          .setDepth(13),
      )
    }
  }

  push(message: string): void {
    for (let i = 0; i < this.lines.length - 1; i += 1) {
      this.lines[i].setText(this.lines[i + 1].text)
    }
    this.lines[this.lines.length - 1].setText(`> ${message}`)
    this.refreshLineFade()
  }

  private refreshLineFade(): void {
    const maxIndex = this.lines.length - 1
    this.lines.forEach((line, idx) => {
      const t = maxIndex === 0 ? 1 : idx / maxIndex
      line.setAlpha(0.42 + t * 0.58)
    })
  }
}
