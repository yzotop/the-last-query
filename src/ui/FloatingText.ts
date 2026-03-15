import Phaser from 'phaser'

export class FloatingText {
  private readonly scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  show(x: number, y: number, label: string, color = '#ffd57a'): void {
    const text = this.scene.add
      .text(x, y, label, {
        fontFamily: 'monospace',
        fontSize: '12px',
        color,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(21)

    this.scene.tweens.add({
      targets: text,
      y: y - 14,
      alpha: 0,
      duration: 650,
      onComplete: () => text.destroy(),
    })
  }
}
