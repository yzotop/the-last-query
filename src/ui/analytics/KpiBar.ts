import Phaser from 'phaser'
import type { MemeEventId } from '../../content/events'
import { GAME_CONFIG } from '../../core/config'

export class KpiBar {
  private readonly stabilityText: Phaser.GameObjects.Text
  private readonly qualityText: Phaser.GameObjects.Text
  private readonly pipelineText: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene) {
    scene.add
      .rectangle(GAME_CONFIG.uiCenterX, 20, GAME_CONFIG.panelWidth - 20, 30, 0x121a29, 0.72)
      .setStrokeStyle(1, 0x2e4c78)
      .setScrollFactor(0)
      .setDepth(12)

    this.stabilityText = scene.add
      .text(GAME_CONFIG.uiStartX + 10, 10, 'STABILITY INDEX: 80%', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#9fd8ff',
      })
      .setScrollFactor(0)
      .setDepth(13)
    this.qualityText = scene.add
      .text(GAME_CONFIG.uiStartX + 112, 10, 'DATA QUALITY: 80%', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#86ffcf',
      })
      .setScrollFactor(0)
      .setDepth(13)
    this.pipelineText = scene.add
      .text(GAME_CONFIG.uiStartX + 214, 10, 'PIPELINE HEALTH: 80%', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#ffd57a',
      })
      .setScrollFactor(0)
      .setDepth(13)
  }

  update(elapsedMs: number, activeEventId: MemeEventId | null): void {
    const t = elapsedMs / 1000
    let stability = 76 + Math.sin(t * 0.7) * 9
    let quality = 82 + Math.sin(t * 0.52 + 1.3) * 7
    let pipeline = 72 + Math.sin(t * 0.84 + 0.6) * 10

    if (activeEventId === 'PRODUCTION_INCIDENT' || activeEventId === 'DATA_LEAK') {
      stability -= 22
      pipeline -= 14
    } else if (activeEventId === 'DEPLOY_FRIDAY') {
      pipeline -= 18
    } else if (activeEventId === 'SQL_IN_PROD') {
      pipeline -= 16
      stability -= 10
    } else if (activeEventId === 'CEO_DASHBOARD') {
      quality += 12
      stability -= 7
    } else if (activeEventId === 'METRIC_RENAMED') {
      quality -= 18
    } else if (activeEventId === 'KPI_RECALCULATION') {
      quality += 10
      stability -= 8
    } else if (activeEventId === 'EXECUTIVE_MEETING') {
      quality -= 6
      pipeline -= 8
    }

    const s = Phaser.Math.Clamp(Math.round(stability), 24, 99)
    const q = Phaser.Math.Clamp(Math.round(quality), 24, 99)
    const p = Phaser.Math.Clamp(Math.round(pipeline), 20, 99)

    if (activeEventId === 'METRIC_RENAMED' && Phaser.Math.Between(0, 100) < 25) {
      const wrongS = Phaser.Math.Between(10, 120)
      const wrongQ = Phaser.Math.Between(10, 120)
      const wrongP = Phaser.Math.Between(10, 120)
      this.stabilityText.setText(`STABILITY INDEX: ${wrongS}%`)
      this.qualityText.setText(`DATA QUALITY: ${wrongQ}%`)
      this.pipelineText.setText(`PIPELINE HEALTH: ${wrongP}%`)
      return
    }

    this.stabilityText.setText(`STABILITY INDEX: ${s}%`)
    this.qualityText.setText(`DATA QUALITY: ${q}%`)
    this.pipelineText.setText(`PIPELINE HEALTH: ${p}%`)
  }
}
