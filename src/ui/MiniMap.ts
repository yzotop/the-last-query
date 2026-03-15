import Phaser from 'phaser'
import { GAME_CONFIG } from '../core/config'

type RadarPoint = {
  x: number
  y: number
  kind: 'enemy' | 'pickup' | 'boss'
}

export class MiniMap {
  private readonly graphics: Phaser.GameObjects.Graphics
  private readonly panel: Phaser.GameObjects.Rectangle
  private readonly centerX = GAME_CONFIG.uiCenterX
  private readonly centerY = 102
  private readonly radius = 46
  private readonly worldWidth: number
  private readonly worldHeight: number

  constructor(scene: Phaser.Scene, worldWidth: number, worldHeight: number) {
    this.worldWidth = worldWidth
    this.worldHeight = worldHeight
    this.panel = scene.add
      .rectangle(this.centerX, this.centerY, 118, 118, 0x121a29, 0.66)
      .setStrokeStyle(1, 0x35537a)
      .setScrollFactor(0)
      .setDepth(12)
    this.graphics = scene.add.graphics().setScrollFactor(0).setDepth(13)
  }

  update(playerX: number, playerY: number, radarPoints: RadarPoint[]): void {
    this.graphics.clear()
    this.graphics.lineStyle(1, 0x3f5f8e, 0.8)
    this.graphics.strokeCircle(this.centerX, this.centerY, this.radius)
    this.graphics.lineStyle(1, 0x3f5f8e, 0.4)
    this.graphics.strokeCircle(this.centerX, this.centerY, this.radius * 0.6)

    this.graphics.fillStyle(0x86ffcf, 1)
    this.graphics.fillCircle(this.centerX, this.centerY, 2.5)

    for (let i = 0; i < radarPoints.length; i += 1) {
      const point = radarPoints[i]
      const dx = (point.x - playerX) / this.worldWidth
      const dy = (point.y - playerY) / this.worldHeight
      const px = Phaser.Math.Clamp(this.centerX + dx * this.radius * 2.2, this.centerX - this.radius, this.centerX + this.radius)
      const py = Phaser.Math.Clamp(this.centerY + dy * this.radius * 2.2, this.centerY - this.radius, this.centerY + this.radius)
      const color = point.kind === 'boss' ? 0xff7bd4 : point.kind === 'pickup' ? 0xfff2bf : 0xffa86a
      const size = point.kind === 'boss' ? 3 : 2
      this.graphics.fillStyle(color, point.kind === 'boss' ? 1 : 0.82)
      this.graphics.fillRect(px - 1, py - 1, size, size)
    }
  }

  setVisible(visible: boolean): void {
    this.panel.setVisible(visible)
    this.graphics.setVisible(visible)
    if (!visible) {
      this.graphics.clear()
    }
  }

  destroy(): void {
    this.panel.destroy()
    this.graphics.destroy()
  }
}
