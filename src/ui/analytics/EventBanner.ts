import Phaser from 'phaser'
import { GAME_CONFIG } from '../../core/config'

export class EventBanner {
  private readonly container: Phaser.GameObjects.Container
  private readonly title: Phaser.GameObjects.Text
  private readonly subtitle: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene) {
    const bg = scene.add
      .rectangle(0, 0, 420, 58, 0x1b2334, 0.9)
      .setStrokeStyle(2, 0xff9fab)
      .setOrigin(0.5)
    this.title = scene.add
      .text(0, -10, '', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffd57a',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
    this.subtitle = scene.add
      .text(0, 10, '', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#d7e6ff',
      })
      .setOrigin(0.5)
    this.container = scene.add
      .container(GAME_CONFIG.worldCenterX, 46, [bg, this.title, this.subtitle])
      .setScrollFactor(0)
      .setDepth(40)
      .setVisible(false)
  }

  show(scene: Phaser.Scene, title: string, subtitle: string): void {
    this.title.setText(title)
    this.subtitle.setText(subtitle)
    this.container.setVisible(true)
    this.container.setAlpha(0)
    this.container.setScale(0.94)
    scene.tweens.add({
      targets: this.container,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 120,
      yoyo: false,
    })
    scene.tweens.add({
      targets: this.container,
      alpha: 0,
      delay: 1100,
      duration: 260,
      onComplete: () => this.container.setVisible(false),
    })
  }
}
