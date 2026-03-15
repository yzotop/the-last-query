import Phaser from 'phaser'

type NotificationItem = {
  bg: Phaser.GameObjects.Rectangle
  text: Phaser.GameObjects.Text
}

export class Notifications {
  private readonly scene: Phaser.Scene
  private readonly active: NotificationItem[] = []

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  push(message: string): void {
    const y = 18 + this.active.length * 20
    const bg = this.scene.add
      .rectangle(944, y + 8, 268, 18, 0x1b2334, 0.78)
      .setOrigin(1, 0)
      .setStrokeStyle(1, 0x3d4f74)
      .setScrollFactor(0)
      .setDepth(19)
    const text = this.scene.add
      .text(944, y, message.toUpperCase(), {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#fff2bf',
        fontStyle: 'bold',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(20)
    text.setShadow(1, 1, '#000000', 2, false, true)

    const item: NotificationItem = { bg, text }
    this.active.push(item)

    this.scene.tweens.add({
      targets: [bg, text],
      scaleX: { from: 1.05, to: 1 },
      duration: 110,
    })

    this.scene.tweens.add({
      targets: [bg, text],
      alpha: 0,
      duration: 1200,
      delay: 950,
      onComplete: () => {
        bg.destroy()
        text.destroy()
        this.removeItem(item)
      },
    })
  }

  private removeItem(item: NotificationItem): void {
    const idx = this.active.indexOf(item)
    if (idx < 0) {
      return
    }
    this.active.splice(idx, 1)
    this.active.forEach((entry, i) => {
      this.scene.tweens.add({
        targets: [entry.bg, entry.text],
        y: 18 + i * 20,
        duration: 120,
      })
    })
  }
}
