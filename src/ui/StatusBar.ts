import Phaser from 'phaser'

export type BuffView = {
  label: string
  remainingMs: number
}

export class StatusBar {
  private readonly title: Phaser.GameObjects.Text
  private readonly lines: Phaser.GameObjects.Text[] = []

  constructor(scene: Phaser.Scene) {
    this.title = scene.add
      .text(16, 122, 'Баффы:', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffd57a',
      })
      .setScrollFactor(0)

    for (let i = 0; i < 4; i += 1) {
      this.lines.push(
        scene.add
          .text(16, 142 + i * 16, '-', {
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#fff7dc',
          })
          .setScrollFactor(0),
      )
    }
  }

  update(buffs: BuffView[]): void {
    const visible = buffs.slice(0, this.lines.length)
    this.lines.forEach((line, idx) => {
      const buff = visible[idx]
      if (!buff) {
        line.setText('-')
        return
      }
      const seconds = Math.max(0, Math.ceil(buff.remainingMs / 1000))
      line.setText(`> ${buff.label.toUpperCase()}  ${seconds}s`)
    })
  }

  destroy(): void {
    this.title.destroy()
    this.lines.forEach((line) => line.destroy())
  }
}
