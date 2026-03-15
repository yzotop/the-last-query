import Phaser from 'phaser'
import { GAME_CONFIG } from '../core/config'
import { SCENE_KEYS } from '../core/constants'
import { getUnlockedAchievementDefs } from '../systems/AchievementSystem'
import { readLifetimeStats } from '../systems/LifetimeStats'

export class TitleScene extends Phaser.Scene {
  private hasStarted = false
  private enterKey: Phaser.Input.Keyboard.Key | null = null
  private spaceKey: Phaser.Input.Keyboard.Key | null = null
  private deployFridayMode = false
  private deployModeText: Phaser.GameObjects.Text | null = null

  constructor() {
    super(SCENE_KEYS.TITLE)
  }

  create(): void {
    const lifetimeStats = readLifetimeStats()
    const unlockedAchievements = getUnlockedAchievementDefs()
    const bestMinutes = Math.floor(lifetimeStats.longestSurvivalMs / 60000)
    const bestSeconds = Math.floor((lifetimeStats.longestSurvivalMs % 60000) / 1000)

    console.log('[TitleScene] create()')
    this.scene.stop(SCENE_KEYS.GAME_OVER)
    this.scene.stop(SCENE_KEYS.UI)
    this.scene.stop(SCENE_KEYS.GAME)

    this.add.rectangle(GAME_CONFIG.width / 2, GAME_CONFIG.height / 2, GAME_CONFIG.width, GAME_CONFIG.height, 0x090d15)
    this.add
      .rectangle(GAME_CONFIG.width / 2, GAME_CONFIG.height / 2, GAME_CONFIG.width - 32, GAME_CONFIG.height - 32, 0x111b2a)
      .setStrokeStyle(2, 0x2e4c78)
    this.add.rectangle(GAME_CONFIG.width / 2, 84, GAME_CONFIG.width - 80, 26, 0xffb34a, 0.18)

    this.add
      .text(GAME_CONFIG.width / 2, 116, 'THE LAST QUERY', {
        fontFamily: 'monospace',
        fontSize: '56px',
        color: '#7ce8ff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    this.add
      .text(GAME_CONFIG.width / 2, 162, '8-bit выживание в рушащейся data-вселенной', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffd57a',
      })
      .setOrigin(0.5)

    this.add
      .text(
        GAME_CONFIG.width / 2,
        242,
        'Вы — последний Data Analyst.\nЗащищайте реальность SQL-мечом\nпротив автоматизации, встреч и хаоса.',
        {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: '#d7e6ff',
          align: 'center',
        },
      )
      .setOrigin(0.5)

    this.add
      .text(GAME_CONFIG.width / 2, 292, 'Дата-центр упал. Дашборды разбиты. Встречи живы.', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#9fd8ff',
      })
      .setOrigin(0.5)

    this.add
      .rectangle(206, 390, 320, 118, 0x121a29, 0.68)
      .setStrokeStyle(1, 0x2e4c78)
    this.add
      .text(62, 344, 'ЛУЧШИЙ RUN', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffd57a',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0)
    this.add
      .text(
        62,
        366,
        `Очки: ${lifetimeStats.bestScore}\nВыживание: ${String(bestMinutes).padStart(2, '0')}:${String(bestSeconds).padStart(2, '0')}`,
        {
          fontFamily: 'monospace',
          fontSize: '13px',
          color: '#d7e6ff',
        },
      )
      .setOrigin(0, 0)

    this.add
      .rectangle(754, 390, 320, 118, 0x121a29, 0.68)
      .setStrokeStyle(1, 0x2e4c78)
    this.add
      .text(610, 344, 'СТАТИСТИКА', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#86ffcf',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0)
    this.add
      .text(
        610,
        366,
        `Всего RUN'ов: ${lifetimeStats.totalRuns}\nВсего артефактов: ${lifetimeStats.totalArtifactsCollected}\nБоссов побеждено: ${lifetimeStats.bossesDefeated}\nИнцидентов пережито: ${lifetimeStats.incidentsSurvived}`,
        {
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#d7e6ff',
        },
      )
      .setOrigin(0, 0)

    const achLines = unlockedAchievements.slice(0, 3).map((item) => `- ${item.title}`).join('\n') || '- (none yet)'
    this.add
      .text(62, 430, `ДОСТИЖЕНИЯ\n${achLines}`, {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#9fd8ff',
      })
      .setOrigin(0, 0)

    this.add
      .text(
        GAME_CONFIG.width / 2,
        320,
        'WASD | SPACE SELECT | ALT+SPACE JOIN STORM | E GROUP EXP | X DELETE FROM | ESC',
        {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#86ffcf',
      },
      )
      .setOrigin(0.5)

    this.add
      .text(GAME_CONFIG.width / 2, 462, 'Нажмите ENTER или SPACE для старта', {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#ff9fd8',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    this.add
      .text(GAME_CONFIG.width / 2, 488, 'Если клавиши не работают — кликните по экрану', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#9fd8ff',
      })
      .setOrigin(0.5)

    this.deployModeText = this.add
      .text(GAME_CONFIG.width / 2, 514, 'РЕЖИМ DEPLOY FRIDAY: OFF (клавиша F)', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#ffb6cf',
      })
      .setOrigin(0.5)

    this.tweens.add({
      targets: this.add.rectangle(GAME_CONFIG.width / 2, 462, 360, 30, 0xff9fd8, 0.09).setDepth(-1),
      alpha: 0.02,
      yoyo: true,
      repeat: -1,
      duration: 640,
    })

    // Ensure keyboard input is explicitly registered and canvas is focusable.
    const keyboard = this.input.keyboard
    if (keyboard) {
      keyboard.enabled = true
      this.enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
      this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

      keyboard.on('keydown-ENTER', () => {
        console.log('[TitleScene] ENTER pressed')
        this.startGame()
      })
      keyboard.on('keydown-SPACE', () => {
        console.log('[TitleScene] SPACE pressed')
        this.startGame()
      })
      keyboard.on('keydown-F', () => {
        this.toggleDeployMode()
      })
    }

    // Click/tap to focus canvas so key events reliably arrive.
    this.input.on('pointerdown', () => {
      const canvas = this.game.canvas as HTMLCanvasElement | undefined
      canvas?.focus()
      console.log('[TitleScene] pointerdown')
      this.startGame()
    })
  }

  update(): void {
    if (this.enterKey && Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      console.log('[TitleScene] ENTER JustDown')
      this.startGame()
      return
    }
    if (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      console.log('[TitleScene] SPACE JustDown')
      this.startGame()
    }
  }

  private startGame(): void {
    if (this.hasStarted) {
      return
    }
    this.hasStarted = true
    console.log('[TitleScene] startGame()')
    this.registry.set('deployFridayMode', this.deployFridayMode)

    this.scene.stop(SCENE_KEYS.TITLE)
    this.scene.start(SCENE_KEYS.GAME)
    if (!this.scene.isActive(SCENE_KEYS.UI)) {
      this.scene.launch(SCENE_KEYS.UI)
    }
  }

  private toggleDeployMode(): void {
    this.deployFridayMode = !this.deployFridayMode
    const nextText = this.deployFridayMode
      ? 'РЕЖИМ DEPLOY FRIDAY: ON (клавиша F)'
      : 'РЕЖИМ DEPLOY FRIDAY: OFF (клавиша F)'
    this.deployModeText?.setText(nextText).setColor(this.deployFridayMode ? '#ffd57a' : '#ffb6cf')
  }
}
