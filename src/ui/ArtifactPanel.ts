import Phaser from 'phaser'
import { resolveArtifactSynergy } from '../content/artifacts/synergies'
import { ARTIFACT_RARITY_COLOR, ARTIFACT_RARITY_LABEL } from '../content/artifacts/rarity'
import { GAME_CONFIG } from '../core/config'
import type { PickupId } from '../core/types'
import { PICKUP_TYPE_CONFIGS } from '../entities/pickups/PickupTypes'

type ArtifactEntry = {
  id: PickupId
  container: Phaser.GameObjects.Container
}

export class ArtifactPanel {
  private readonly scene: Phaser.Scene
  private readonly panelX = GAME_CONFIG.uiCenterX
  private readonly panelY = 338
  private readonly panelWidth = GAME_CONFIG.panelWidth - 8
  private readonly panelHeight = 336
  private readonly viewportContainer: Phaser.GameObjects.Container
  private readonly contentContainer: Phaser.GameObjects.Container
  private readonly maskShape: Phaser.GameObjects.Graphics
  private readonly countText: Phaser.GameObjects.Text
  private readonly synergyText: Phaser.GameObjects.Text
  private readonly entries: ArtifactEntry[] = []
  private readonly pickedIds: PickupId[] = []
  private scrollY = 0
  private readonly rowHeight = 54

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    scene.add
      .rectangle(this.panelX, this.panelY, this.panelWidth, this.panelHeight, 0x121a29, 0.72)
      .setStrokeStyle(2, 0x2e4c78)
      .setScrollFactor(0)
      .setDepth(12)

    scene.add
      .text(this.panelX - this.panelWidth / 2 + 12, this.panelY - this.panelHeight / 2 + 10, 'АРТЕФАКТЫ АНАЛИТИКА', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffd57a',
        fontStyle: 'bold',
      })
      .setScrollFactor(0)
      .setDepth(13)

    this.countText = scene.add
      .text(this.panelX - this.panelWidth / 2 + 12, this.panelY - this.panelHeight / 2 + 28, 'Собрано: 0', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#9fd8ff',
      })
      .setScrollFactor(0)
      .setDepth(13)

    this.synergyText = scene.add
      .text(this.panelX - this.panelWidth / 2 + 12, this.panelY + this.panelHeight / 2 - 18, 'Синергия: -', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#86ffcf',
      })
      .setScrollFactor(0)
      .setDepth(13)

    scene.add
      .rectangle(
        this.panelX,
        this.panelY + 18,
        this.panelWidth - 16,
        this.panelHeight - 98,
        0x121a29,
        0.5,
      )
      .setStrokeStyle(1, 0x3d4f74)
      .setScrollFactor(0)
      .setDepth(12)

    this.viewportContainer = scene.add.container(
      this.panelX - this.panelWidth / 2 + 10,
      this.panelY - this.panelHeight / 2 + 46,
    )
    this.viewportContainer.setScrollFactor(0).setDepth(13)
    this.contentContainer = scene.add.container(0, 0)
    this.viewportContainer.add(this.contentContainer)

    this.maskShape = scene.add.graphics().setScrollFactor(0).setDepth(13)
    this.maskShape.fillStyle(0xffffff, 1)
    this.maskShape.fillRect(
      this.panelX - this.panelWidth / 2 + 8,
      this.panelY - this.panelHeight / 2 + 44,
      this.panelWidth - 18,
      this.panelHeight - 100,
    )
    this.maskShape.setVisible(false)
    const mask = this.maskShape.createGeometryMask()
    this.viewportContainer.setMask(mask)

    scene.input.on('wheel', (_pointer: Phaser.Input.Pointer, _go: Phaser.GameObjects.GameObject[], _dx: number, dy: number) => {
      this.applyScroll(dy * 0.45)
    })
  }

  reset(): void {
    this.entries.forEach((entry) => entry.container.destroy())
    this.entries.length = 0
    this.pickedIds.length = 0
    this.scrollY = 0
    this.countText.setText('Собрано: 0')
    this.synergyText.setText('Синергия: -')
    this.contentContainer.y = 0
  }

  addPickup(pickupType: PickupId): void {
    const config = PICKUP_TYPE_CONFIGS[pickupType]
    const y = this.entries.length * this.rowHeight
    const rarityHex = ARTIFACT_RARITY_COLOR[config.rarity]
    const rarityNumeric = Number.parseInt(rarityHex.replace('#', ''), 16)

    const rowBg = this.scene.add
      .rectangle(0, y, this.panelWidth - 30, 48, 0x1b2a42, 0.48)
      .setOrigin(0, 0)
      .setStrokeStyle(1, rarityNumeric)
    const icon = this.scene.add
      .text(8, y + 5, config.artifactIcon, {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#fff2bf',
      })
      .setOrigin(0, 0)
    const name = this.scene.add
      .text(34, y + 4, config.artifactTitle, {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#d7e6ff',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0)
    const desc = this.scene.add
      .text(34, y + 21, config.artifactDescription, {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#86ffcf',
        wordWrap: { width: this.panelWidth - 120 },
      })
      .setOrigin(0, 0)
    const rarityTag = this.scene.add
      .text(this.panelWidth - 74, y + 4, ARTIFACT_RARITY_LABEL[config.rarity], {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: rarityHex,
        fontStyle: 'bold',
      })
      .setOrigin(0, 0)

    const row = this.scene.add.container(0, 0, [rowBg, icon, name, desc, rarityTag])
    this.contentContainer.add(row)
    this.entries.push({ id: pickupType, container: row })
    this.pickedIds.push(pickupType)
    this.countText.setText(`Собрано: ${this.entries.length}`)
    const synergy = resolveArtifactSynergy(this.pickedIds)
    this.synergyText.setText(`Синергия: ${synergy ?? '-'}`)
    if (import.meta.env.DEV) {
      console.debug(`[ArtifactPanel] add item ${config.artifactTitle}; count=${this.entries.length}`)
    }

    this.scene.tweens.add({
      targets: row,
      alpha: { from: 0, to: 1 },
      x: { from: 8, to: 0 },
      duration: 130,
    })
    this.scene.tweens.add({
      targets: rowBg,
      alpha: { from: 0.95, to: 0.48 },
      duration: 1000,
    })

    this.scrollY = this.minScroll()
    this.clampAndApplyScroll()
  }

  private applyScroll(deltaY: number): void {
    this.scrollY = Phaser.Math.Clamp(this.scrollY + deltaY, this.minScroll(), 0)
    this.contentContainer.y = this.scrollY
  }

  private clampAndApplyScroll(): void {
    this.scrollY = Phaser.Math.Clamp(this.scrollY, this.minScroll(), 0)
    this.contentContainer.y = this.scrollY
  }

  private minScroll(): number {
    const contentHeight = this.entries.length * this.rowHeight
    const viewportHeight = this.panelHeight - 100
    return Math.min(0, viewportHeight - contentHeight)
  }
}
