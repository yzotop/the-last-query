import Phaser from 'phaser'
import { GAME_CONFIG } from '../core/config'
import type { MemeEventId } from '../content/events'

type EnvPoint = { x: number; y: number }
type DataParticle = {
  node: Phaser.GameObjects.Rectangle
  speedX: number
  speedY: number
}

export const ARENA_THEME = {
  OFFICE: 'OFFICE',
  SERVER_ROOM: 'SERVER_ROOM',
  DASHBOARD_HELL: 'DASHBOARD_HELL',
  LEGACY_SYSTEM: 'LEGACY_SYSTEM',
  DATA_CORE: 'DATA_CORE',
} as const

export type ArenaTheme = (typeof ARENA_THEME)[keyof typeof ARENA_THEME]

export class EnvironmentBuilder {
  private readonly scene: Phaser.Scene
  private readonly themedObjects: Phaser.GameObjects.GameObject[] = []
  private readonly monitorLights: Phaser.GameObjects.Rectangle[] = []
  private readonly serverLights: Phaser.GameObjects.Rectangle[] = []
  private readonly terminalLights: Phaser.GameObjects.Rectangle[] = []
  private readonly warningPanels: Phaser.GameObjects.Rectangle[] = []
  private readonly dashboardPanels: Phaser.GameObjects.Rectangle[] = []
  private readonly rackShadows: Phaser.GameObjects.Ellipse[] = []
  private readonly dashboardScanlines: Phaser.GameObjects.Rectangle[] = []
  private readonly dataParticles: DataParticle[] = []
  private activeTheme: ArenaTheme = ARENA_THEME.OFFICE
  private floorLayer!: Phaser.GameObjects.Graphics
  private cableLayer!: Phaser.GameObjects.Graphics
  private debrisLayer!: Phaser.GameObjects.Graphics

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  build(theme: ArenaTheme): void {
    this.activeTheme = theme
    this.clearThemeObjects()
    this.track(this.scene.add.rectangle(GAME_CONFIG.worldCenterX, 270, GAME_CONFIG.worldWidth, GAME_CONFIG.height, 0x090d15).setDepth(-9))
    this.track(
      this.scene.add
      .rectangle(GAME_CONFIG.worldCenterX, 270, GAME_CONFIG.worldWidth - 28, GAME_CONFIG.height - 28, 0x0f1826)
      .setStrokeStyle(2, 0x2a4369)
      .setDepth(-8),
    )
    this.track(
      this.scene.add
      .rectangle(GAME_CONFIG.uiCenterX, 270, GAME_CONFIG.panelWidth, GAME_CONFIG.height, 0x0a1220, 0.92)
      .setDepth(-9)
      .setStrokeStyle(2, 0x304c70),
    )

    this.floorLayer = this.track(this.scene.add.graphics().setDepth(-7))
    this.cableLayer = this.track(this.scene.add.graphics().setDepth(-6))
    this.debrisLayer = this.track(this.scene.add.graphics().setDepth(-5))

    this.buildFloorTiles(theme)
    this.buildGrid()
    this.buildCables()

    if (theme === ARENA_THEME.OFFICE) {
      this.buildOfficeTheme()
    } else if (theme === ARENA_THEME.SERVER_ROOM) {
      this.buildServerRoomTheme()
    } else if (theme === ARENA_THEME.DASHBOARD_HELL) {
      this.buildDashboardHellTheme()
    } else if (theme === ARENA_THEME.LEGACY_SYSTEM) {
      this.buildLegacyTheme()
    } else if (theme === ARENA_THEME.DATA_CORE) {
      this.buildDataCoreTheme()
    }

    this.buildIncidentCorner()
    this.buildSupportDesk()
    this.buildSilhouettes()
    this.buildDataParticles()
  }

  rebuild(theme: ArenaTheme): void {
    this.build(theme)
  }

  update(now: number, activeEventId: MemeEventId | null): void {
    this.monitorLights.forEach((light, idx) => {
      if (Phaser.Math.Between(0, 100) < 14) {
        light.setAlpha(0.32 + Math.sin(now / 380 + idx) * 0.25 + Phaser.Math.FloatBetween(0, 0.14))
      }
    })
    this.serverLights.forEach((light, idx) => {
      const blink = Math.sin(now / 240 + idx * 0.7) > 0.2
      light.setAlpha(blink ? 0.85 : 0.2)
    })
    this.rackShadows.forEach((shadow, idx) => {
      shadow.setAlpha(0.2 + (Math.sin(now / 850 + idx * 0.5) + 1) * 0.03)
    })
    this.terminalLights.forEach((light, idx) => {
      light.setAlpha(0.28 + (Math.sin(now / 260 + idx) + 1) * 0.25)
    })
    this.dashboardScanlines.forEach((line, idx) => {
      line.setY(line.y + 0.2 + idx * 0.002)
      if (line.y > GAME_CONFIG.height - 12) {
        line.setY(28 + (idx % 8) * 6)
      }
      line.setAlpha(0.08 + Math.abs(Math.sin(now / 500 + idx)) * 0.08)
    })
    this.dataParticles.forEach((particle) => {
      particle.node.x += particle.speedX
      particle.node.y += particle.speedY
      if (particle.node.x > GAME_CONFIG.worldWidth - 12) {
        particle.node.x = 14
      }
      if (particle.node.x < 12) {
        particle.node.x = GAME_CONFIG.worldWidth - 14
      }
      if (particle.node.y > GAME_CONFIG.height - 10) {
        particle.node.y = 16
      }
      if (particle.node.y < 10) {
        particle.node.y = GAME_CONFIG.height - 16
      }
    })

    if (activeEventId === 'PRODUCTION_INCIDENT') {
      this.warningPanels.forEach((panel) => panel.setAlpha(Phaser.Math.FloatBetween(0.26, 0.52)))
    } else if (activeEventId === 'DEPLOY_FRIDAY') {
      this.warningPanels.forEach((panel, idx) => {
        panel.setAlpha(0.15 + Math.abs(Math.sin(now / 180 + idx)) * 0.35)
      })
    } else {
      this.warningPanels.forEach((panel) => panel.setAlpha(0.12))
    }

    if (activeEventId === 'CEO_DASHBOARD') {
      this.dashboardPanels.forEach((panel) => panel.setAlpha(Phaser.Math.FloatBetween(0.45, 0.72)))
    } else {
      this.dashboardPanels.forEach((panel, idx) => panel.setAlpha(0.22 + (Math.sin(now / 600 + idx) + 1) * 0.05))
    }

    if (this.activeTheme === ARENA_THEME.DATA_CORE && Phaser.Math.Between(0, 100) < 5) {
      const pulse = this.track(
        this.scene.add.circle(
          Phaser.Math.Between(160, GAME_CONFIG.worldWidth - 100),
          Phaser.Math.Between(90, GAME_CONFIG.height - 70),
          10,
          0x7ef5ff,
          0.08,
        ),
      ).setDepth(-4)
      this.scene.tweens.add({
        targets: pulse,
        radius: 24,
        alpha: 0,
        duration: 420,
        onComplete: () => {
          const idx = this.themedObjects.indexOf(pulse)
          if (idx >= 0) {
            this.themedObjects.splice(idx, 1)
          }
          pulse.destroy()
        },
      })
    }
  }

  pulseLocalAlarm(x: number, y: number, color = 0xff7b7b): void {
    const pulse = this.scene.add.circle(x, y, 12, color, 0.14).setDepth(-2)
    this.scene.tweens.add({
      targets: pulse,
      radius: 60,
      alpha: 0,
      duration: 360,
      onComplete: () => pulse.destroy(),
    })
  }

  private buildGrid(): void {
    const g = this.track(this.scene.add.graphics().setDepth(-6))
    g.lineStyle(1, 0x1e2f4a, 0.2)
    for (let x = 24; x < GAME_CONFIG.worldWidth - 18; x += 46) {
      g.lineBetween(x, 18, x, GAME_CONFIG.height - 18)
    }
    for (let y = 24; y < GAME_CONFIG.height - 18; y += 34) {
      g.lineBetween(18, y, GAME_CONFIG.worldWidth - 18, y)
    }
  }

  private buildFloorTiles(theme: ArenaTheme): void {
    const tile = 18
    const themeBase =
      theme === ARENA_THEME.OFFICE
        ? 0x1e2b3f
        : theme === ARENA_THEME.SERVER_ROOM
          ? 0x151f2e
          : theme === ARENA_THEME.DASHBOARD_HELL
            ? 0x22324d
            : theme === ARENA_THEME.LEGACY_SYSTEM
              ? 0x1a271d
              : 0x1b2138
    for (let y = 18; y < GAME_CONFIG.height - 18; y += tile) {
      for (let x = 18; x < GAME_CONFIG.worldWidth - 18; x += tile) {
        const roll = Phaser.Math.Between(0, 100)
        let color = themeBase
        let alpha = 0.8
        if (roll < 14) {
          color = theme === ARENA_THEME.LEGACY_SYSTEM ? 0x203427 : 0x1e2b3f // office floor tile
        } else if (roll < 24) {
          color = theme === ARENA_THEME.DATA_CORE ? 0x2a2d50 : 0x243550 // dashboard panel tile
          alpha = 0.76
        } else if (roll < 30) {
          color = 0x3b2b2b // warning tile
          alpha = 0.84
        }
        this.floorLayer.fillStyle(color, alpha)
        this.floorLayer.fillRect(x, y, tile - 1, tile - 1)
      }
    }
  }

  private buildCables(): void {
    this.cableLayer.lineStyle(2, 0x1d2a3d, 0.85)
    for (let i = 0; i < 12; i += 1) {
      const startX = Phaser.Math.Between(36, GAME_CONFIG.worldWidth - 120)
      const startY = Phaser.Math.Between(54, GAME_CONFIG.height - 54)
      const midX = startX + Phaser.Math.Between(26, 72)
      const midY = startY + Phaser.Math.Between(-22, 22)
      const endX = Math.min(GAME_CONFIG.worldWidth - 20, midX + Phaser.Math.Between(18, 64))
      const endY = Phaser.Math.Clamp(midY + Phaser.Math.Between(-28, 28), 24, GAME_CONFIG.height - 24)
      this.cableLayer.beginPath()
      this.cableLayer.moveTo(startX, startY)
      this.cableLayer.lineTo(midX, midY)
      this.cableLayer.lineTo(endX, endY)
      this.cableLayer.strokePath()
    }
    // Ethernet bundles
    this.cableLayer.lineStyle(1, 0x2f4462, 0.75)
    for (let i = 0; i < 14; i += 1) {
      const x = Phaser.Math.Between(30, GAME_CONFIG.worldWidth - 30)
      const y = Phaser.Math.Between(34, GAME_CONFIG.height - 34)
      this.cableLayer.strokeLineShape(new Phaser.Geom.Line(x, y, x + Phaser.Math.Between(8, 18), y + Phaser.Math.Between(-4, 4)))
    }
  }

  private buildOfficeTheme(): void {
    this.buildWorkstationCluster()
  }

  private buildServerRoomTheme(): void {
    this.buildServerAisle()
    this.buildTerminalPanels(5)
  }

  private buildDashboardHellTheme(): void {
    this.buildDashboardStrip()
    this.buildBrokenDashboardFragments(26)
  }

  private buildLegacyTheme(): void {
    this.buildLegacyCabinets()
    this.buildTerminalPanels(6, true)
  }

  private buildDataCoreTheme(): void {
    this.buildServerAisle()
    this.buildDashboardStrip()
    this.buildBrokenDashboardFragments(30)
    this.buildDataCore()
  }

  private buildWorkstationCluster(): void {
    const points: EnvPoint[] = [
      { x: 150, y: 116 },
      { x: 222, y: 134 },
      { x: 182, y: 196 },
      { x: 268, y: 178 },
    ]
    points.forEach((p, idx) => {
      this.addShadow(p.x, p.y + 10, 32, 12, 0.2)
      this.track(this.scene.add.rectangle(p.x, p.y, 40, 18, 0x1a2738, 0.9).setDepth(-5).setStrokeStyle(1, 0x3b5678))
      const monitor = this.track(this.scene.add.rectangle(p.x + 8, p.y - 6, 12, 8, 0x8ec0ff, 0.55).setDepth(-4))
      this.monitorLights.push(monitor)
      this.addShadow(p.x + 8, p.y - 1, 11, 5, 0.14)
      this.track(this.scene.add.rectangle(p.x - 10, p.y + 8, 7, 6, 0x3c4a5d, 0.92).setDepth(-5)) // chair
      this.track(this.scene.add.rectangle(p.x + 15, p.y + 6, 3, 3, idx % 2 === 0 ? 0xffc37a : 0xb5e5ff, 0.9).setDepth(-4)) // mug
      this.track(this.scene.add.circle(p.x + 8, p.y - 6, 8, 0x8ec0ff, 0.08).setDepth(-5))
      // Laptop variants
      const laptopState = idx % 4
      if (laptopState === 0) {
        this.track(this.scene.add.rectangle(p.x - 4, p.y - 2, 9, 6, 0x7f95b2, 0.95).setDepth(-4)) // open
      } else if (laptopState === 1) {
        this.track(this.scene.add.rectangle(p.x - 4, p.y - 1, 9, 4, 0x6f8198, 0.95).setDepth(-4)) // closed
      } else if (laptopState === 2) {
        this.track(this.scene.add.rectangle(p.x - 4, p.y - 2, 9, 6, 0x7f95b2, 0.75).setDepth(-4)) // broken
        this.track(this.scene.add.rectangle(p.x - 2, p.y - 2, 5, 1, 0xff6f6f, 0.9).setDepth(-3))
      } else {
        this.track(this.scene.add.rectangle(p.x - 4, p.y - 2, 9, 6, 0x84c8ff, 0.98).setDepth(-4)) // glowing
      }
    })
  }

  private buildServerAisle(): void {
    for (let i = 0; i < 6; i += 1) {
      const x = 360 + i * 38
      const y = 144 + (i % 2) * 70
      const shadow = this.track(this.scene.add.ellipse(x, y + 16, 24, 14, 0x000000, 0.2).setDepth(-6))
      this.rackShadows.push(shadow)
      // 2x3 tile server rack block
      const rackTint = i % 3 === 0 ? 0x1a2232 : i % 3 === 1 ? 0x222d40 : 0x2b2332
      this.track(this.scene.add.rectangle(x, y, 28, 38, rackTint, 0.95).setDepth(-5).setStrokeStyle(1, 0x4b5f7c))
      const light1 = this.track(this.scene.add.rectangle(x - 5, y - 8, 2, 2, 0x88ffd4, 0.9).setDepth(-4))
      const light2 = this.track(this.scene.add.rectangle(x + 4, y - 8, 2, 2, 0xff8b8b, 0.9).setDepth(-4))
      this.serverLights.push(light1, light2)
      this.track(this.scene.add.rectangle(x, y + 18, 20, 2, 0x2d394f, 0.8).setDepth(-4))
      this.track(this.scene.add.rectangle(x + 12, y + 4, 6, 1, 0xffb34a, 0.7).setDepth(-4)) // warning strip
    }
  }

  private buildIncidentCorner(): void {
    const warningPositions: EnvPoint[] = [
      { x: 542, y: 96 },
      { x: 590, y: 118 },
      { x: 548, y: 154 },
    ]
    warningPositions.forEach((p) => {
      this.track(this.scene.add.rectangle(p.x, p.y, 34, 18, 0x3a2b2b, 0.9).setDepth(-5).setStrokeStyle(1, 0x864c4c))
      const panel = this.track(this.scene.add.rectangle(p.x, p.y, 26, 10, 0xff6f6f, 0.12).setDepth(-4))
      this.warningPanels.push(panel)
      this.track(this.scene.add.circle(p.x, p.y, 12, 0xff5a5a, 0.05).setDepth(-5))
    })
    // Large warning dashboard screen
    const sx = 560
    const sy = 208
    this.addShadow(sx, sy + 12, 52, 14, 0.2)
    this.track(this.scene.add.rectangle(sx, sy, 58, 30, 0x232c3a, 0.95).setDepth(-5).setStrokeStyle(1, 0x4f5f73))
    const alertPanel = this.track(this.scene.add.rectangle(sx, sy, 48, 20, 0xff7171, 0.22).setDepth(-4))
    this.warningPanels.push(alertPanel)
  }

  private buildDashboardStrip(): void {
    for (let i = 0; i < 8; i += 1) {
      const x = 186 + i * 52
      const y = 402 + (i % 2) * 18
      this.addShadow(x, y + 7, 22, 8, 0.16)
      this.track(this.scene.add.rectangle(x, y, 32, 14, 0x253146, 0.88).setDepth(-5).setStrokeStyle(1, 0x4f6180))
      const panel = this.track(this.scene.add.rectangle(x, y, 24, 8, i % 3 === 0 ? 0xff6d7a : 0x8bc4ff, 0.26).setDepth(-4))
      this.dashboardPanels.push(panel)
      const scan = this.track(this.scene.add.rectangle(x, y - 3, 22, 1, 0xd7ebff, 0.08).setDepth(-3))
      this.dashboardScanlines.push(scan)
      if (i % 3 === 1) {
        this.track(this.scene.add.rectangle(x + 6, y + 5, 10, 1, 0x3f4e64, 0.9).setDepth(-4)) // crack
      }
      if (i % 4 === 0) {
        this.track(this.scene.add.rectangle(x - 9, y - 7, 3, 3, 0x7f8fa8, 0.7).setDepth(-3)) // debris
      }
    }
  }

  private buildSupportDesk(): void {
    const x = 278
    const y = 320
    this.addShadow(x, y + 12, 38, 12, 0.2)
    this.track(this.scene.add.rectangle(x, y, 52, 22, 0x1d2b3f, 0.92).setDepth(-5).setStrokeStyle(1, 0x3f587a))
    const monitor = this.track(this.scene.add.rectangle(x + 8, y - 7, 14, 10, 0x89c3ff, 0.55).setDepth(-4))
    this.monitorLights.push(monitor)
    this.addShadow(x + 8, y - 2, 10, 5, 0.14)
    this.track(this.scene.add.rectangle(x - 12, y + 8, 9, 6, 0x3b4658, 0.9).setDepth(-5))
    // Coffee mug variants
    const mugVariant = Phaser.Math.Between(0, 2)
    if (mugVariant === 0) {
      this.track(this.scene.add.rectangle(x + 17, y + 8, 4, 3, 0xffc37a, 0.9).setDepth(-4)) // full
    } else if (mugVariant === 1) {
      this.track(this.scene.add.rectangle(x + 17, y + 8, 4, 3, 0xb8c5d5, 0.9).setDepth(-4)) // empty
    } else {
      this.track(this.scene.add.rectangle(x + 16, y + 10, 5, 2, 0x9a7352, 0.85).setDepth(-4)) // tipped
    }
    // Terminal station with green glow
    const terminal = this.track(
      this.scene.add.rectangle(338, 324, 22, 14, 0x1a2536, 0.95).setDepth(-5).setStrokeStyle(1, 0x4b5f7a),
    )
    this.addShadow(338, 332, 16, 7, 0.18)
    const terminalGlow = this.track(this.scene.add.rectangle(338, 324, 14, 7, 0x8aff8a, 0.26).setDepth(-4))
    this.terminalLights.push(terminalGlow)
    void terminal
    // Tiny maintenance bot
    this.track(this.scene.add.rectangle(322, 338, 8, 6, 0x6f7f95, 0.9).setDepth(-4).setStrokeStyle(1, 0x9daec5))
  }

  private buildBrokenDashboardFragments(count: number): void {
    for (let i = 0; i < count; i += 1) {
      const x = Phaser.Math.Between(40, GAME_CONFIG.worldWidth - 32)
      const y = Phaser.Math.Between(34, GAME_CONFIG.height - 34)
      const isAlert = i % 4 === 0
      this.debrisLayer.fillStyle(isAlert ? 0xff6d7a : 0x8bc4ff, isAlert ? 0.38 : 0.24)
      this.debrisLayer.fillRect(x, y, Phaser.Math.Between(4, 8), Phaser.Math.Between(2, 4))
      if (i % 3 === 0) {
        this.debrisLayer.lineStyle(1, 0x3e536f, 0.7)
        this.debrisLayer.strokeLineShape(new Phaser.Geom.Line(x, y, x + Phaser.Math.Between(6, 12), y + Phaser.Math.Between(-4, 4)))
      }
    }
  }

  private buildSilhouettes(): void {
    const silhouettes: EnvPoint[] = [
      { x: 138, y: 150 },
      { x: 262, y: 356 },
      { x: 442, y: 242 },
    ]
    silhouettes.forEach((p) => {
      this.addShadow(p.x, p.y + 8, 10, 6, 0.14)
      this.track(this.scene.add.rectangle(p.x, p.y, 8, 14, 0x0d1119, 0.72).setDepth(-4))
      this.track(this.scene.add.circle(p.x, p.y - 8, 4, 0x0d1119, 0.72).setDepth(-4))
    })
  }

  private buildDataParticles(): void {
    for (let i = 0; i < 26; i += 1) {
      const p = this.track(
        this.scene.add
        .rectangle(
          Phaser.Math.Between(18, GAME_CONFIG.worldWidth - 18),
          Phaser.Math.Between(18, GAME_CONFIG.height - 18),
          2,
          2,
          i % 4 === 0 ? 0x88ffd4 : 0x8bc4ff,
          0.35,
        )
        .setDepth(-3),
      )
      this.dataParticles.push({
        node: p,
        speedX: Phaser.Math.FloatBetween(-0.08, 0.12),
        speedY: Phaser.Math.FloatBetween(-0.06, 0.08),
      })
    }
  }

  private addShadow(x: number, y: number, width: number, height: number, alpha: number): void {
    this.track(this.scene.add.ellipse(x, y, width, height, 0x000000, alpha).setDepth(-6))
  }

  private buildTerminalPanels(count: number, crt = false): void {
    for (let i = 0; i < count; i += 1) {
      const x = Phaser.Math.Between(90, GAME_CONFIG.worldWidth - 120)
      const y = Phaser.Math.Between(70, GAME_CONFIG.height - 70)
      this.addShadow(x, y + 10, 24, 10, 0.18)
      this.track(this.scene.add.rectangle(x, y, 30, 18, 0x1f2838, 0.95).setDepth(-5).setStrokeStyle(1, 0x4d5e79))
      const glowColor = crt ? 0x87ff96 : 0x8aff8a
      const screen = this.track(this.scene.add.rectangle(x, y - 2, 18, 9, glowColor, crt ? 0.3 : 0.24).setDepth(-4))
      this.terminalLights.push(screen)
      this.track(this.scene.add.rectangle(x - 8, y + 5, 10, 2, 0x32435f, 0.85).setDepth(-4))
    }
  }

  private buildLegacyCabinets(): void {
    for (let i = 0; i < 7; i += 1) {
      const x = 126 + i * 70
      const y = i % 2 === 0 ? 156 : 226
      const shadow = this.track(this.scene.add.ellipse(x, y + 16, 22, 12, 0x000000, 0.2).setDepth(-6))
      this.rackShadows.push(shadow)
      this.track(this.scene.add.rectangle(x, y, 24, 36, 0x2b3532, 0.95).setDepth(-5).setStrokeStyle(1, 0x4a6b56))
      const crt = this.track(this.scene.add.rectangle(x, y - 10, 12, 6, 0x87ff96, 0.28).setDepth(-4))
      this.terminalLights.push(crt)
      this.track(this.scene.add.rectangle(x, y + 8, 14, 2, 0x31453b, 0.88).setDepth(-4))
    }
  }

  private buildDataCore(): void {
    const x = GAME_CONFIG.worldCenterX
    const y = 216
    this.addShadow(x, y + 24, 62, 18, 0.24)
    this.track(this.scene.add.circle(x, y, 28, 0x142843, 0.95).setDepth(-5).setStrokeStyle(2, 0x5fa2ff))
    this.track(this.scene.add.circle(x, y, 18, 0x7ef5ff, 0.2).setDepth(-4))
    for (let i = 0; i < 12; i += 1) {
      const dx = Math.cos((Math.PI * 2 * i) / 12) * 40
      const dy = Math.sin((Math.PI * 2 * i) / 12) * 20
      this.track(this.scene.add.rectangle(x + dx, y + dy, 8, 4, 0x6c82ff, 0.3).setDepth(-4))
    }
  }

  private track<T extends Phaser.GameObjects.GameObject>(obj: T): T {
    this.themedObjects.push(obj)
    return obj
  }

  private clearThemeObjects(): void {
    this.themedObjects.forEach((obj) => obj.destroy())
    this.themedObjects.length = 0
    this.monitorLights.length = 0
    this.serverLights.length = 0
    this.terminalLights.length = 0
    this.warningPanels.length = 0
    this.dashboardPanels.length = 0
    this.rackShadows.length = 0
    this.dashboardScanlines.length = 0
    this.dataParticles.length = 0
  }
}
