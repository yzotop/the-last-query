import Phaser from 'phaser'
import { SCENE_KEYS } from '../core/constants'
import { GAME_CONFIG } from '../core/config'
import { recordLifetimeRun } from '../systems/LifetimeStats'

type GameOverPayload = {
  score: number
  elapsedMs: number
  enemiesKilled?: number
  pickupsCollected?: number
  bossesDefeated?: number
  incidentsSurvived?: number
  meetingsAvoided?: number
  queriesExecuted?: number
  buildSummary?: string
  bossDefeated?: boolean
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.GAME_OVER)
  }

  create(data: GameOverPayload): void {
    const elapsedSeconds = Math.floor((data?.elapsedMs ?? 0) / 1000)
    const minutes = Math.floor(elapsedSeconds / 60)
    const seconds = elapsedSeconds % 60

    const enemiesKilled = data?.enemiesKilled ?? 0
    const pickupsCollected = data?.pickupsCollected ?? 0
    const bossesDefeated = data?.bossesDefeated ?? 0
    const incidentsSurvived = data?.incidentsSurvived ?? 0
    const meetingsAvoided = data?.meetingsAvoided ?? 0
    const queriesExecuted = data?.queriesExecuted ?? 0
    const buildSummary = data?.buildSummary ?? 'SQL Sword Core = Last Analyst Survival Build'
    const bossDefeated = data?.bossDefeated ?? false
    const deathReasons = [
      'слишком много совещаний',
      'инцидент без логов',
      'кто-то удалил таблицу',
      'SQL изменен прямо в проде',
    ]
    const deathReason = deathReasons[Phaser.Math.Between(0, deathReasons.length - 1)]
    recordLifetimeRun({
      score: data?.score ?? 0,
      elapsedMs: data?.elapsedMs ?? 0,
      pickupsCollected,
      bossesDefeated,
      incidentsSurvived,
    })
    const flavor =
      bossDefeated
        ? 'Терапевт подтверждает: прогресс нелинеен, но SQL стабилен.'
        : enemiesKilled > 80
          ? 'Хаос под контролем. Добавьте индекс и повторите забег.'
          : 'Сделайте кофе, пересчитайте KPI и запустите снова.'

    this.add
      .rectangle(GAME_CONFIG.width / 2, GAME_CONFIG.height / 2, GAME_CONFIG.width, GAME_CONFIG.height, 0x000000, 0.66)
      .setDepth(50)
      .setScrollFactor(0)
    this.add
      .rectangle(GAME_CONFIG.width / 2, GAME_CONFIG.height / 2, GAME_CONFIG.width - 64, GAME_CONFIG.height - 84, 0x121a29, 0.8)
      .setStrokeStyle(2, 0x2e4c78)
      .setDepth(50)
      .setScrollFactor(0)
    this.add.rectangle(GAME_CONFIG.width / 2, 148, GAME_CONFIG.width - 120, 22, 0xff668a, 0.14).setDepth(50)

    this.add
      .text(GAME_CONFIG.width / 2, 176, 'АНАЛИТИЧЕСКИЙ ОТЧЁТ', {
        fontFamily: 'monospace',
        fontSize: '40px',
        color: '#ff668a',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(51)

    this.add
      .text(GAME_CONFIG.width / 2, 232, `Очки: ${data?.score ?? 0}`, {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#d7e6ff',
      })
      .setOrigin(0.5)
      .setDepth(51)

    this.add
      .text(GAME_CONFIG.width / 2, 260, `Выжил: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`, {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffd57a',
      })
      .setOrigin(0.5)
      .setDepth(51)

    this.add
      .text(GAME_CONFIG.width / 2, 300, '=== ДАШБОРД ВЫЖИВАНИЯ ===', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#9fd8ff',
      })
      .setOrigin(0.5)
      .setDepth(51)

    this.add
      .text(
        GAME_CONFIG.width / 2,
        326,
        `Запросов выполнено: ${queriesExecuted}   |   Сущностей зачищено: ${enemiesKilled}   |   Артефактов собрано: ${pickupsCollected}`,
        {
          fontFamily: 'monospace',
          fontSize: '13px',
          color: '#9fd8ff',
        },
      )
      .setOrigin(0.5)
      .setDepth(51)

    this.add
      .text(
        GAME_CONFIG.width / 2,
        346,
        `Инцидентов пережито: ${incidentsSurvived}   |   Совещаний избегнуто: ${meetingsAvoided}   |   Боссов устранено: ${bossesDefeated}`,
        {
          fontFamily: 'monospace',
          fontSize: '13px',
          color: '#ff9fd8',
        },
      )
      .setOrigin(0.5)
      .setDepth(51)

    this.add
      .text(GAME_CONFIG.width / 2, 366, 'ВАШ БИЛД', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#86ffcf',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(51)

    this.add
      .text(GAME_CONFIG.width / 2, 384, buildSummary, {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#d7e6ff',
      })
      .setOrigin(0.5)
      .setDepth(51)

    this.add
      .text(GAME_CONFIG.width / 2, 402, `Терапевт побежден: ${bossDefeated ? 'ДА' : 'НЕТ'}`, {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ff9fd8',
      })
      .setOrigin(0.5)
      .setDepth(51)

    this.add
      .text(GAME_CONFIG.width / 2, 422, flavor, {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffd57a',
      })
      .setOrigin(0.5)
      .setDepth(51)

    this.add
      .text(GAME_CONFIG.width / 2, 442, 'Причина смерти:', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ff9fab',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(51)
    this.add
      .text(GAME_CONFIG.width / 2, 460, deathReason, {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#d7e6ff',
      })
      .setOrigin(0.5)
      .setDepth(51)

    this.add
      .text(GAME_CONFIG.width / 2, 490, 'Press R to query reality again', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#86ffcf',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(51)

    this.input.keyboard?.once('keydown-R', () => {
      this.scene.stop(SCENE_KEYS.GAME_OVER)
      this.scene.stop(SCENE_KEYS.UI)
      this.scene.stop(SCENE_KEYS.GAME)
      this.scene.start(SCENE_KEYS.GAME)
      this.scene.start(SCENE_KEYS.UI)
    })
  }
}
