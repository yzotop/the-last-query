import Phaser from 'phaser'
import { ATTACK_MODE_LABELS, ATTACK_MODES } from '../combat/AttackModes'
import { resolveBuildIdentity } from '../content/artifacts/buildIdentity'
import { ARTIFACT_RARITY } from '../content/artifacts/rarity'
import { ARENA_THEME, EnvironmentBuilder, type ArenaTheme } from '../environment/EnvironmentBuilder'
import { GAME_CONFIG } from '../core/config'
import { ENEMY_IDS, SCENE_KEYS } from '../core/constants'
import type { PickupId } from '../core/types'
import type { EventModifiers, MemeEventConfig, MemeEventId } from '../content/events'
import { BALANCE_CONTENT } from '../content/balance'
import { gameState } from '../core/gameState'
import { TherapistBoss } from '../entities/bosses/TherapistBoss'
import { Enemy } from '../entities/enemies/Enemy'
import { EnemySpawner } from '../entities/enemies/EnemySpawner'
import { PICKUP_TYPE_CONFIGS } from '../entities/pickups/PickupTypes'
import { PickupEffects } from '../entities/pickups/PickupEffects'
import { Player } from '../entities/player/Player'
import { PlayerCombat } from '../entities/player/PlayerCombat'
import { PlayerController } from '../entities/player/PlayerController'
import { UIScene } from './UIScene'
import { CollisionSystem } from '../systems/CollisionSystem'
import { CombatSystem } from '../systems/CombatSystem'
import { DifficultySystem } from '../systems/DifficultySystem'
import { DropSystem } from '../systems/DropSystem'
import { EventSystem } from '../systems/EventSystem'
import { EnemyLabelSystem } from '../systems/EnemyLabelSystem'
import { JokeSystem, type ViralEventId } from '../systems/JokeSystem'
import { ScoreSystem } from '../systems/ScoreSystem'
import { AchievementSystem, ACHIEVEMENT_DEFS, type AchievementId } from '../systems/AchievementSystem'

const ANALYST_LEVELS = ['Junior Analyst', 'Middle Analyst', 'Senior Analyst', 'Lead Analyst', 'Head of Analytics'] as const

export class GameScene extends Phaser.Scene {
  private player!: Player
  private playerController!: PlayerController
  private playerCombat!: PlayerCombat
  private enemies!: Phaser.Physics.Arcade.Group
  private bosses!: Phaser.Physics.Arcade.Group
  private pickups!: Phaser.Physics.Arcade.Group
  private spawner!: EnemySpawner
  private pickupEffects!: PickupEffects
  private environment!: EnvironmentBuilder
  private combatSystem!: CombatSystem
  private collisionSystem!: CollisionSystem
  private scoreSystem!: ScoreSystem
  private difficultySystem!: DifficultySystem
  private dropSystem!: DropSystem
  private eventSystem!: EventSystem
  private enemyLabelSystem!: EnemyLabelSystem
  private jokeSystem!: JokeSystem
  private achievementSystem!: AchievementSystem
  private activeEventId: MemeEventId | null = null
  private glitchOverlay!: Phaser.GameObjects.Rectangle
  private burnoutOverlay!: Phaser.GameObjects.Rectangle
  private eventAccentOverlay!: Phaser.GameObjects.Rectangle
  private scanlineSweep!: Phaser.GameObjects.Rectangle
  private activeEventModifiers: EventModifiers = {
    spawnDelayMultiplier: 1,
    enemySpeedMultiplier: 1,
    reverseControls: false,
    glitchFx: false,
    pickupDropMultiplier: 1,
    macbookRainVisual: false,
    burnoutFog: false,
  }
  private therapistBoss: TherapistBoss | null = null
  private therapistBossSpawned = false
  private enemiesKilled = 0
  private pickupsCollected = 0
  private bossesDefeated = 0
  private incidentsSurvived = 0
  private meetingsAvoided = 0
  private queriesExecuted = 0
  private collectedArtifacts: PickupId[] = []
  private deployFridayMode = false
  private deployModeAnnounced = false
  private analystLevel = 1
  private nextLevelAtMs = 60000
  private levelSpawnMultiplier = 1
  private levelScoreMultiplier = 1
  private viralScoreMultiplier = 1
  private viralScoreBoostUntilMs = 0
  private viralChaosUntilMs = 0
  private lastMeetingVoiceAt = 0
  private lastLegacyVoiceAt = 0
  private currentArenaTheme: ArenaTheme = ARENA_THEME.OFFICE
  private themeTransitionActive = false
  private themeTransitionOverlay: Phaser.GameObjects.Rectangle | null = null
  private gameIsOver = false

  constructor() {
    super(SCENE_KEYS.GAME)
  }

  create(): void {
    gameState.reset()
    this.physics.world.setBounds(0, 0, GAME_CONFIG.worldWidth, GAME_CONFIG.height)
    this.cameras.main.setBounds(0, 0, GAME_CONFIG.worldWidth, GAME_CONFIG.height)
    this.environment = new EnvironmentBuilder(this)
    this.currentArenaTheme = ARENA_THEME.OFFICE
    this.buildArenaBackdrop()

    this.player = new Player(this, GAME_CONFIG.worldCenterX, 270)
    this.playerController = new PlayerController(this)
    this.playerCombat = new PlayerCombat(this.player)
    this.enemies = this.physics.add.group()
    this.bosses = this.physics.add.group()
    this.pickups = this.physics.add.group()
    this.enemyLabelSystem = new EnemyLabelSystem(this)
    this.spawner = new EnemySpawner(this, this.enemies, (enemy) => this.handleEnemySpawned(enemy))
    this.pickupEffects = new PickupEffects(this, this.player, this.playerCombat)
    this.combatSystem = new CombatSystem()
    this.collisionSystem = new CollisionSystem()
    this.scoreSystem = new ScoreSystem()
    this.scoreSystem.setGlobalMultiplier(1)
    this.difficultySystem = new DifficultySystem()
    this.dropSystem = new DropSystem(this, this.pickups)
    this.jokeSystem = new JokeSystem(this)
    this.achievementSystem = new AchievementSystem()
    this.deployFridayMode = Boolean(this.registry.get('deployFridayMode'))
    this.eventSystem = new EventSystem(
      this.deployFridayMode
        ? {
            rollChance: 0.92,
            rollIntervalMs: 15000,
          }
        : undefined,
    )
    this.glitchOverlay = this.add
      .rectangle(GAME_CONFIG.worldCenterX, GAME_CONFIG.height / 2, GAME_CONFIG.worldWidth, GAME_CONFIG.height, 0xff4d4d, 0)
      .setDepth(35)
      .setVisible(false)
    this.burnoutOverlay = this.add
      .rectangle(GAME_CONFIG.worldCenterX, GAME_CONFIG.height / 2, GAME_CONFIG.worldWidth, GAME_CONFIG.height, 0x2a2038, 0)
      .setDepth(34)
      .setVisible(false)
    this.eventAccentOverlay = this.add
      .rectangle(GAME_CONFIG.worldCenterX, GAME_CONFIG.height / 2, GAME_CONFIG.worldWidth, GAME_CONFIG.height, 0xff9900, 0)
      .setDepth(33)
      .setVisible(false)
    this.scanlineSweep = this.add
      .rectangle(GAME_CONFIG.worldCenterX, -8, GAME_CONFIG.worldWidth, 10, 0x87f6ff, 0.05)
      .setDepth(32)
      .setVisible(true)
    this.themeTransitionOverlay = this.add
      .rectangle(GAME_CONFIG.worldCenterX, GAME_CONFIG.height / 2, GAME_CONFIG.worldWidth, GAME_CONFIG.height, 0x02040a, 0)
      .setDepth(65)
      .setVisible(true)
    this.scene.stop(SCENE_KEYS.GAME_OVER)
    this.enemiesKilled = 0
    this.pickupsCollected = 0
    this.bossesDefeated = 0
    this.incidentsSurvived = 0
    this.meetingsAvoided = 0
    this.queriesExecuted = 0
    this.collectedArtifacts = []
    this.analystLevel = 1
    this.nextLevelAtMs = 60000
    this.levelSpawnMultiplier = 1
    this.levelScoreMultiplier = 1
    this.viralScoreMultiplier = 1
    this.viralScoreBoostUntilMs = 0
    this.viralChaosUntilMs = 0
    this.applyScoreMultiplier()
    this.jokeSystem.reset(this.time.now)
    gameState.setDifficultyTier(1)
    this.deployModeAnnounced = false

    this.collisionSystem.registerPlayerEnemyOverlap(this, this.player.sprite, this.enemies, (enemy) => {
      if (this.gameIsOver) {
        return
      }
      const contactOutcome = this.combatSystem.resolveEnemyContact(this.time.now, this.player, enemy)
      if (!contactOutcome.playerHit) {
        return
      }
      gameState.damagePlayer(contactOutcome.damageTaken)
      this.cameras.main.shake(80, 0.003)
      const stateAfterHit = gameState.getSnapshot()
      this.pushUiState(stateAfterHit)
      if (stateAfterHit.hp <= 0) {
        this.handleGameOver()
      }
    })

    this.collisionSystem.registerPlayerPickupOverlap(this, this.player.sprite, this.pickups, (pickup) => {
      if (this.gameIsOver) {
        return
      }
      const pickupType = pickup.getType()
      const pickupPos = pickup.getPosition()
      if (!pickup.collect()) {
        return
      }
      if (import.meta.env.DEV) {
        console.debug(`[GameScene] pickup collected: ${pickupType}`)
      }
      this.pickupsCollected += 1
      this.collectedArtifacts.push(pickupType)
      this.awardAchievements(this.achievementSystem.onPickupCollected(pickupType))
      this.getUIScene()?.recordArtifact(pickupType)
      this.getUIScene()?.logAnalytics('артефакт получен')
      const pickupConfig = PICKUP_TYPE_CONFIGS[pickupType]
      this.spawnPixelBurst(pickupPos.x, pickupPos.y, 8, 0xfff2bf, 9, 2)
      const pickupGlow = this.add.circle(pickupPos.x, pickupPos.y, 6, 0xfff2bf, 0.22).setDepth(37)
      this.tweens.add({
        targets: pickupGlow,
        radius: 20,
        alpha: 0,
        duration: 260,
        onComplete: () => pickupGlow.destroy(),
      })
      if (pickupConfig.rarity === ARTIFACT_RARITY.EPIC || pickupConfig.rarity === ARTIFACT_RARITY.LEGENDARY) {
        this.cameras.main.flash(80, 255, 240, 170)
      }
      this.pickupEffects.apply(pickupType, (message) => {
        this.getUIScene()?.notify(message)
        this.getUIScene()?.floatLabel(this.player.x, this.player.y - 26, message, '#ffd57a')
        this.spawnPixelBurst(this.player.x, this.player.y - 8, 7, 0xffd57a, 7)
        const glow = this.add.circle(this.player.x, this.player.y - 10, 10, 0xffeab2, 0.22).setDepth(37)
        this.tweens.add({
          targets: glow,
          radius: 24,
          alpha: 0,
          duration: 280,
          onComplete: () => glow.destroy(),
        })
      })
      const state = gameState.getSnapshot()
      this.pushUiState(state)
    })

    this.collisionSystem.registerPlayerBossOverlap(this, this.player.sprite, this.bosses, (boss) => {
      if (this.gameIsOver) {
        return
      }
      const contactOutcome = this.combatSystem.resolveBossContact(this.time.now, this.player, boss)
      if (!contactOutcome.playerHit) {
        return
      }
      gameState.damagePlayer(contactOutcome.damageTaken)
      this.cameras.main.shake(100, 0.004)
      const stateAfterHit = gameState.getSnapshot()
      this.pushUiState(stateAfterHit)
      if (stateAfterHit.hp <= 0) {
        this.handleGameOver()
      }
    })
  }

  update(time: number, delta: number): void {
    if (this.gameIsOver) {
      return
    }

    if (this.viralScoreBoostUntilMs > 0 && this.time.now >= this.viralScoreBoostUntilMs) {
      this.viralScoreBoostUntilMs = 0
      this.viralScoreMultiplier = 1
      this.applyScoreMultiplier()
      this.getUIScene()?.notify('VIRAL BONUS ENDED')
    }
    const jokeTick = this.jokeSystem.update(this.time.now, GAME_CONFIG.worldCenterX)
    if (jokeTick.viralEvent) {
      this.applyViralEvent(jokeTick.viralEvent.id, jokeTick.viralEvent.durationMs)
      this.getUIScene()?.showEventBanner(
        `${jokeTick.viralEvent.icon} ${jokeTick.viralEvent.title}`,
        jokeTick.viralEvent.subtitle,
      )
      this.getUIScene()?.logAnalytics(`viral: ${jokeTick.viralEvent.title.toLowerCase()}`)
    }

    const elapsedMs = gameState.getSnapshot().elapsedMs
    if (this.deployFridayMode && !this.deployModeAnnounced) {
      this.getUIScene()?.showEventBanner('⚠ DEPLOY FRIDAY MODE', 'опасный режим активирован')
      this.getUIScene()?.notify('DEPLOY FRIDAY MODE ACTIVE')
      this.deployModeAnnounced = true
    }
    const eventTick = this.eventSystem.update(this.time.now, elapsedMs)
    this.activeEventId = this.eventSystem.getActiveEventId()
    this.activeEventModifiers = eventTick.modifiers

    if (eventTick.startedEvent) {
      this.handleEventStart(eventTick.startedEvent)
    }
    if (eventTick.endedEvent) {
      this.handleEventEnd(eventTick.endedEvent)
    }

    this.playerController.update(this.player, {
      reverseControls: eventTick.modifiers.reverseControls,
    })

    const attackMode = this.playerController.consumeAttackInput()
    if (attackMode) {
      const attackOutcome = this.combatSystem.resolvePlayerAttack(
        this,
        time,
        attackMode,
        this.playerCombat,
        this.enemies,
        this.bosses,
      )
      if (attackOutcome.attackPerformed) {
        this.applySqlSpellSideEffect(attackMode)
      }
      if (attackOutcome.attackPerformed) {
        this.queriesExecuted += 1
        if (attackOutcome.hitLanded) {
          this.scoreSystem.registerAttackHit(this.time.now)
        } else {
          this.scoreSystem.registerAttackMiss(this.time.now)
        }
      }
      attackOutcome.enemiesKilled.forEach((enemy) => {
        const enemyPosition = enemy.getPosition()
        this.enemiesKilled += 1
        if (enemy.getKind() === ENEMY_IDS.MEETING_MONSTER) {
          this.meetingsAvoided += 1
          this.awardAchievements(this.achievementSystem.onMeetingAvoided(this.meetingsAvoided))
        }
        const ceoScoreMultiplier = this.activeEventId === 'CEO_DASHBOARD' ? 1.2 : 1
        this.scoreSystem.addKillScore(Math.round(enemy.getScoreValue() * ceoScoreMultiplier))
        this.dropSystem.trySpawnPickupFromEnemyDeath(
          enemyPosition.x,
          enemyPosition.y,
          this.activeEventModifiers.pickupDropMultiplier * (this.deployFridayMode ? 1.45 : 1),
        )
        this.tryEnemyFlavorText(enemy)
        this.spawnEnemyDeathFx(enemy, enemyPosition)
        const reaction = this.jokeSystem.maybeReactionText()
        if (reaction) {
          this.getUIScene()?.floatLabel(enemyPosition.x, enemyPosition.y - 18, reaction, '#b3f5ff')
        }
        this.getUIScene()?.logAnalytics(this.rollKillLogMessage())
        this.cameras.main.shake(80, 0.0028)
        this.awardAchievements(this.achievementSystem.onEnemyKilled())
      })
      const swingDir = this.playerCombat.getLastSwingDirection()
      const swingOrigin = this.playerCombat.getLastSwingOrigin()
      attackOutcome.hitDetails.forEach((hit) => {
        this.spawnDirectionalSparks(hit.position.x, hit.position.y, swingDir, hit.damage >= 50, hit.isBoss)
        if (hit.isCritical) {
          this.getUIScene()?.floatLabel(hit.position.x, hit.position.y - 12, `${hit.damage} CRIT`, '#ffe066')
        } else if (hit.damage >= 50) {
          this.getUIScene()?.floatLabel(hit.position.x, hit.position.y - 12, 'CRITICAL!', '#ffd86a')
        } else {
          this.getUIScene()?.floatLabel(hit.position.x, hit.position.y - 10, `${hit.damage}`, '#9fd8ff')
        }
      })
      if (attackMode !== ATTACK_MODES.SELECT_SLASH && attackOutcome.attackPerformed) {
        this.getUIScene()?.notify(ATTACK_MODE_LABELS[attackMode])
      }
      if (attackOutcome.hitLanded) {
        const heavyHit = attackOutcome.criticalHits > 0 || attackOutcome.totalDamageDealt >= 8
        this.cameras.main.shake(heavyHit ? 85 : 60, attackOutcome.bossHit ? 0.0044 : heavyHit ? 0.003 : 0.0022)
        if (attackOutcome.criticalHits > 0) {
          this.cameras.main.flash(55, 255, 245, 170)
        }
      }
      if (attackMode === ATTACK_MODES.GROUP_BY_SHOCKWAVE && attackOutcome.hitLanded) {
        this.spawnPixelBurst(swingOrigin.x, swingOrigin.y, 12, 0xffcc84, 18, 2)
      }
      if (attackOutcome.massiveHitLanded) {
        this.getUIScene()?.notify('STACK OVERFLOW CRITICAL!')
        this.cameras.main.flash(90, 255, 230, 130)
        this.spawnPixelBurst(this.player.x, this.player.y, 16, 0xffe76a, 14)
      }
      if (attackOutcome.bossDefeated) {
        this.handleTherapistBossDefeated()
      }
    }

    const viralChaosSpeedMultiplier = this.time.now < this.viralChaosUntilMs ? 1.2 : 1
    EnemySpawner.updateEnemies(
      this.enemies,
      this.player.x,
      this.player.y,
      eventTick.modifiers.enemySpeedMultiplier * viralChaosSpeedMultiplier,
      (enemy, request) => {
        this.spawner.spawnAt(enemy.x, enemy.y, request.count, request.kind)
        if (enemy.getKind() === ENEMY_IDS.LEGACY_MONOLITH) {
          this.getUIScene()?.notify('Legacy Monolith forked another subsystem.')
          this.getUIScene()?.logAnalytics('legacy monolith emitted mini services')
        } else if (enemy.getKind() === ENEMY_IDS.MEETING_MONSTER) {
          this.getUIScene()?.notify('Meeting Monster invited more attendees.')
          this.getUIScene()?.logAnalytics('meeting spawned extra attendees')
        }
      },
    )
    this.updateTherapistBoss(time, eventTick.modifiers.enemySpeedMultiplier * viralChaosSpeedMultiplier)
    this.enemyLabelSystem.update(this.player.x, this.player.y)

    gameState.tick(delta)
    this.scoreSystem.addSurvivalScore(delta)
    if (this.activeEventId === 'CEO_DASHBOARD' && Phaser.Math.Between(0, 100) < 35) {
      gameState.addScore(1)
    }
    this.scoreSystem.updateCombo(this.time.now)
    const updatedElapsedMs = gameState.getSnapshot().elapsedMs
    this.updateAnalystLevel(updatedElapsedMs)
    this.difficultySystem.update(updatedElapsedMs)
    const baseSpawnDelay = this.difficultySystem.getSpawnDelayMs(updatedElapsedMs)
    const deployMultiplier = this.deployFridayMode ? 0.5 : 1
    const sqlInProdMultiplier = this.activeEventId === 'SQL_IN_PROD' ? 0.78 : 1
    const viralChaosSpawnMultiplier = this.time.now < this.viralChaosUntilMs ? 0.76 : 1
    const eventSpawnDelay = Math.floor(
      baseSpawnDelay *
        eventTick.modifiers.spawnDelayMultiplier *
        deployMultiplier *
        sqlInProdMultiplier *
        this.levelSpawnMultiplier *
        viralChaosSpawnMultiplier,
    )
    this.spawner.setSpawnDelayMs(eventSpawnDelay)
    this.updateIncidentVisual(eventTick.modifiers.glitchFx)
    this.updateEventMoodVisuals()
    this.updateAmbientBackdrop()
    const snapshot = gameState.getSnapshot()
    this.pushUiState(snapshot)
  }

  private handleGameOver(): void {
    this.gameIsOver = true
    this.jokeSystem.destroyTransientUi()
    this.enemyLabelSystem.clear()
    gameState.setGameOver(true)
    this.player.stop()
    this.spawner.stop()
    this.therapistBoss?.setVelocity(0, 0)
    this.glitchOverlay.setVisible(false)
    this.burnoutOverlay.setVisible(false)
    this.eventAccentOverlay.setVisible(false)
    const snapshot = gameState.getSnapshot()
    this.scene.launch(SCENE_KEYS.GAME_OVER, {
      score: snapshot.score,
      elapsedMs: snapshot.elapsedMs,
      enemiesKilled: this.enemiesKilled,
      pickupsCollected: this.pickupsCollected,
      bossesDefeated: this.bossesDefeated,
      incidentsSurvived: this.incidentsSurvived,
      meetingsAvoided: this.meetingsAvoided,
      queriesExecuted: this.queriesExecuted,
      buildSummary: resolveBuildIdentity(this.collectedArtifacts),
      bossDefeated: this.bossesDefeated > 0,
    })
    this.scene.pause(SCENE_KEYS.GAME)
  }

  private updateAnalystLevel(elapsedMs: number): void {
    while (this.analystLevel < ANALYST_LEVELS.length && elapsedMs >= this.nextLevelAtMs) {
      this.analystLevel += 1
      this.nextLevelAtMs += 60000
      this.levelSpawnMultiplier = Phaser.Math.Clamp(1 - (this.analystLevel - 1) * 0.08, 0.62, 1)
      this.levelScoreMultiplier = 1 + (this.analystLevel - 1) * 0.2
      this.applyScoreMultiplier()
      gameState.setDifficultyTier(this.analystLevel)
      this.dropSystem.spawnGuaranteedPickup(this.player.x, this.player.y)
      this.getUIScene()?.showEventBanner('LEVEL UP', `${this.analystLevel} — ${ANALYST_LEVELS[this.analystLevel - 1]}`)
      this.getUIScene()?.notify(`LEVEL UP: ${ANALYST_LEVELS[this.analystLevel - 1]}`)
      this.spawnPixelBurst(this.player.x, this.player.y, 14, 0x86ffcf, 12, 2)
      const nextTheme = this.resolveThemeForLevel(this.analystLevel)
      if (nextTheme !== this.currentArenaTheme) {
        this.transitionArenaTheme(nextTheme)
      }
    }
  }

  private applyScoreMultiplier(): void {
    this.scoreSystem.setGlobalMultiplier(this.levelScoreMultiplier * this.viralScoreMultiplier)
  }

  private applyViralEvent(eventId: ViralEventId, durationMs: number): void {
    if (eventId === 'PRODUCT_MANAGER_ARRIVED') {
      this.spawner.spawnBurst(4)
      this.getUIScene()?.notify('PRODUCT MANAGER ARRIVED')
      this.cameras.main.shake(70, 0.0026)
      return
    }
    if (eventId === 'CEO_OPENED_DASHBOARD') {
      this.viralScoreMultiplier = 1.45
      this.viralScoreBoostUntilMs = this.time.now + durationMs
      this.applyScoreMultiplier()
      this.getUIScene()?.notify('CEO BONUS: score x1.45')
      this.environment.pulseLocalAlarm(486, 410, 0xffe29f)
      return
    }
    if (eventId === 'METRIC_CHANGED') {
      this.getUIScene()?.triggerHudFlicker(durationMs)
      this.getUIScene()?.notify('METRIC CHANGED: numbers flicker')
      return
    }
    if (eventId === 'DATA_TEAM_PANIC') {
      this.viralChaosUntilMs = this.time.now + durationMs
      this.getUIScene()?.notify('DATA TEAM PANIC: chaos spike')
      this.cameras.main.shake(110, 0.0032)
    }
  }

  private getUIScene(): UIScene | null {
    const ui = this.scene.get(SCENE_KEYS.UI)
    return ui instanceof UIScene ? ui : null
  }

  private handleEventStart(event: MemeEventConfig): void {
    this.getUIScene()?.notify(`EVENT START: ${event.label}`)
    this.getUIScene()?.logAnalytics(`event started: ${event.label.toLowerCase()}`)
    this.showEventBannerFor(event)
    this.getUIScene()?.floatLabel(GAME_CONFIG.worldCenterX, 58, `>> ${event.label} <<`, '#ff9fab')
    if (event.onStartBurstCount && event.onStartBurstCount > 0) {
      this.spawner.spawnBurst(event.onStartBurstCount, event.burstEnemyKind)
    }
    if (event.id === 'PRODUCTION_INCIDENT') {
      this.cameras.main.flash(180, 255, 90, 90)
      this.cameras.main.shake(160, 0.005)
      this.environment.pulseLocalAlarm(GAME_CONFIG.worldCenterX, GAME_CONFIG.height / 2, 0xff6f6f)
    } else if (event.id === 'DEPLOY_FRIDAY') {
      this.cameras.main.flash(120, 255, 170, 80)
      this.getUIScene()?.notify('деплой в пятницу')
      this.cameras.main.shake(110, 0.0034)
      this.environment.pulseLocalAlarm(560, 118, 0xffa35c)
    } else if (event.id === 'AGENT_INVASION') {
      this.getUIScene()?.notify('Agent swarm scaling out...')
      this.cameras.main.flash(90, 150, 120, 255)
    } else if (event.id === 'RETROGRADE_MERCURY') {
      this.getUIScene()?.notify('Controls are cursed. Blame the cosmos.')
      this.cameras.main.flash(90, 90, 220, 255)
    } else if (event.id === 'MACBOOK_RAIN') {
      this.getUIScene()?.notify('Free hardware storm! Catch the chaos.')
    } else if (event.id === 'BURNOUT_WEEK') {
      this.getUIScene()?.notify('Everyone is tired. Ghosts are thriving.')
    } else if (event.id === 'DATA_LEAK') {
      this.getUIScene()?.notify('Data leak! Incident channel is on fire.')
      this.cameras.main.flash(100, 255, 110, 110)
    } else if (event.id === 'KPI_RECALCULATION') {
      this.getUIScene()?.notify('KPI recalculation wiped your multiplier.')
      this.scoreSystem.resetCombo()
      this.cameras.main.flash(90, 130, 180, 255)
    } else if (event.id === 'EXECUTIVE_MEETING') {
      this.getUIScene()?.notify('Executive meeting summoned a therapist immediately.')
      if (!this.therapistBoss || !this.therapistBoss.isAlive()) {
        this.spawnTherapistBoss()
      }
    } else if (event.id === 'CEO_DASHBOARD') {
      this.getUIScene()?.notify('CEO открыл дашборд, метрики срочно растут')
      this.environment.pulseLocalAlarm(486, 410, 0xffe29f)
    } else if (event.id === 'SQL_IN_PROD') {
      this.getUIScene()?.notify('SQL изменен прямо в проде')
    } else if (event.id === 'METRIC_RENAMED') {
      this.getUIScene()?.notify('conversion теперь называется success')
    } else if (event.id === 'PRODUCTION_TABLE_DELETED') {
      this.getUIScene()?.notify('кто-то удалил production таблицу')
    }
  }

  private handleEventEnd(event: MemeEventConfig): void {
    this.getUIScene()?.notify(`EVENT ENDED: ${event.label}`)
    this.getUIScene()?.logAnalytics(`event ended: ${event.label.toLowerCase()}`)
    this.awardAchievements(this.achievementSystem.onEventEnded(event.id))
    this.incidentsSurvived += 1
    if (event.id === 'PRODUCTION_INCIDENT') {
      this.glitchOverlay.setVisible(false)
    }
  }

  private updateIncidentVisual(isActive: boolean): void {
    if (!isActive) {
      this.glitchOverlay.setVisible(false)
      return
    }
    this.glitchOverlay.setVisible(true)
    this.glitchOverlay.setAlpha(Phaser.Math.FloatBetween(0.05, 0.16))
    if (Phaser.Math.Between(0, 100) < 7) {
      this.cameras.main.shake(70, 0.0028)
    }
  }

  private updateEventMoodVisuals(): void {
    if (this.activeEventModifiers.burnoutFog) {
      this.burnoutOverlay.setVisible(true)
      this.burnoutOverlay.setAlpha(Phaser.Math.FloatBetween(0.1, 0.17))
      if (Phaser.Math.Between(0, 100) < 3) {
        this.spawner.spawnBurst(1, ENEMY_IDS.BURNOUT_GHOST)
      }
    } else {
      this.burnoutOverlay.setVisible(false)
    }

    if (this.activeEventModifiers.macbookRainVisual && Phaser.Math.Between(0, 100) < 36) {
      const x = Phaser.Math.Between(20, GAME_CONFIG.worldWidth - 20)
      const startY = -10
      const laptop = this.add.rectangle(x, startY, 8, 6, 0xa7c3ff, 0.95).setDepth(36)
      this.tweens.add({
        targets: laptop,
        y: GAME_CONFIG.height + 12,
        angle: Phaser.Math.Between(-22, 22),
        alpha: 0.6,
        duration: Phaser.Math.Between(700, 1100),
        onComplete: () => laptop.destroy(),
      })
    }

    const id = this.activeEventId
    if (!id) {
      this.eventAccentOverlay.setVisible(false)
      return
    }

    this.eventAccentOverlay.setVisible(true)
    if (id === 'DEPLOY_FRIDAY') {
      this.eventAccentOverlay.setFillStyle(0xff8a47, Phaser.Math.FloatBetween(0.02, 0.06))
      if (Phaser.Math.Between(0, 100) < 5) {
        this.cameras.main.shake(50, 0.0016)
      }
    } else if (id === 'PRODUCTION_INCIDENT') {
      this.eventAccentOverlay.setFillStyle(0xff4d4d, Phaser.Math.FloatBetween(0.03, 0.09))
    } else if (id === 'AGENT_INVASION') {
      this.eventAccentOverlay.setFillStyle(0x8c7dff, Phaser.Math.FloatBetween(0.02, 0.05))
      if (Phaser.Math.Between(0, 100) < 4) {
        this.spawnPixelBurst(
          Phaser.Math.Between(80, GAME_CONFIG.worldWidth - 80),
          Phaser.Math.Between(80, GAME_CONFIG.height - 80),
          4,
          0x8c7dff,
          8,
          1,
        )
      }
    } else if (id === 'RETROGRADE_MERCURY') {
      this.eventAccentOverlay.setFillStyle(0x59d7ff, Phaser.Math.FloatBetween(0.015, 0.05))
      this.scanlineSweep.setAngle(Math.sin(this.time.now / 240) * 4)
    } else if (id === 'MACBOOK_RAIN') {
      this.eventAccentOverlay.setFillStyle(0xa7c3ff, Phaser.Math.FloatBetween(0.02, 0.05))
    } else if (id === 'BURNOUT_WEEK') {
      this.eventAccentOverlay.setFillStyle(0x5f4a87, Phaser.Math.FloatBetween(0.03, 0.08))
    } else if (id === 'DATA_LEAK') {
      this.eventAccentOverlay.setFillStyle(0xff6f6f, Phaser.Math.FloatBetween(0.03, 0.08))
    } else if (id === 'KPI_RECALCULATION') {
      this.eventAccentOverlay.setFillStyle(0x7cb7ff, Phaser.Math.FloatBetween(0.02, 0.05))
    } else if (id === 'EXECUTIVE_MEETING') {
      this.eventAccentOverlay.setFillStyle(0xff9fd8, Phaser.Math.FloatBetween(0.03, 0.07))
    } else if (id === 'CEO_DASHBOARD') {
      this.eventAccentOverlay.setFillStyle(0xffd57a, Phaser.Math.FloatBetween(0.02, 0.06))
    } else if (id === 'SQL_IN_PROD') {
      this.eventAccentOverlay.setFillStyle(0xff8866, Phaser.Math.FloatBetween(0.03, 0.08))
    } else if (id === 'METRIC_RENAMED') {
      this.eventAccentOverlay.setFillStyle(0x8ec0ff, Phaser.Math.FloatBetween(0.03, 0.08))
    } else if (id === 'PRODUCTION_TABLE_DELETED') {
      this.eventAccentOverlay.setFillStyle(0xff9b9b, Phaser.Math.FloatBetween(0.03, 0.09))
    } else {
      this.eventAccentOverlay.setVisible(false)
      this.scanlineSweep.setAngle(0)
    }
  }

  private updateTherapistBoss(now: number, speedMultiplier: number): void {
    const elapsedMs = gameState.getSnapshot().elapsedMs
    if (!this.therapistBossSpawned && elapsedMs >= BALANCE_CONTENT.boss.therapistSpawnAtMs) {
      this.spawnTherapistBoss()
    }

    if (!this.therapistBoss || !this.therapistBoss.isAlive()) {
      return
    }

    this.therapistBoss.update(this.player.x, this.player.y, speedMultiplier)
    if (this.therapistBoss.shouldSpawnMinion(now)) {
      this.spawner.spawnBurst(1, ENEMY_IDS.BURNOUT_GHOST)
      this.getUIScene()?.notify('THERAPIST: "LET OUT YOUR BURNOUT"')
      this.getUIScene()?.logAnalytics('therapist emitted burnout ghost')
      this.spawnPixelBurst(this.therapistBoss.x, this.therapistBoss.y, 6, 0x89a1b8, 8)
    }
  }

  private spawnTherapistBoss(): void {
    this.therapistBossSpawned = true
    const marker = this.add.ellipse(GAME_CONFIG.worldCenterX, 88, 110, 52, 0xff7bd4, 0.18).setDepth(19)
    this.tweens.add({
      targets: marker,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.4,
      duration: 520,
      onComplete: () => marker.destroy(),
    })
    const boss = new TherapistBoss(this, GAME_CONFIG.worldCenterX, 88)
    this.therapistBoss = boss
    this.bosses.add(boss)
    this.enemyLabelSystem.setBossLabel(boss)
    this.getUIScene()?.notify('THERAPIST BOSS INCOMING')
    this.getUIScene()?.showEventBanner('THERAPIST BOSS', 'Расскажите, что вас тревожит')
    this.getUIScene()?.logAnalytics('boss spawned: therapist')
    this.getUIScene()?.floatLabel(GAME_CONFIG.worldCenterX, 84, 'THERAPIST BOSS', '#ff7bd4')
    this.spawnPixelBurst(boss.x, boss.y, 22, 0xff7bd4, 14)
    this.environment.pulseLocalAlarm(boss.x, boss.y, 0xff7bd4)
    this.cameras.main.flash(220, 255, 100, 200)
    this.cameras.main.shake(120, 0.0032)
    this.tweens.add({
      targets: boss,
      scaleX: { from: 1.45, to: 1.1 },
      scaleY: { from: 1.45, to: 1.1 },
      duration: 360,
      ease: 'Back.Out',
    })
  }

  private handleTherapistBossDefeated(): void {
    const bossPos = this.therapistBoss?.getPosition()
    this.therapistBoss = null
    this.bossesDefeated += 1
    this.scoreSystem.addKillScore(BALANCE_CONTENT.boss.therapistDefeatScore)
    this.applySlowMotion(200, 0.2)
    this.triggerHitStop(80)
    if (bossPos) {
      this.dropSystem.spawnGuaranteedPickup(bossPos.x, bossPos.y)
      this.spawnPixelBurst(bossPos.x, bossPos.y, 26, 0xff9fd8, 16)
      this.spawnPixelBurst(bossPos.x, bossPos.y, 30, 0xffffff, 20, 2)
    }
    this.getUIScene()?.notify('THERAPIST BOSS DEFEATED')
    const bossDefeatLines = ['инцидент закрыт', 'pipeline восстановлен']
    this.getUIScene()?.showEventBanner('BOSS DEFEATED', bossDefeatLines[Phaser.Math.Between(0, bossDefeatLines.length - 1)])
    this.getUIScene()?.floatLabel(
      this.player.x,
      this.player.y - 40,
      `BOSS DEFEATED +${BALANCE_CONTENT.boss.therapistDefeatScore}`,
      '#ff9fd8',
    )
    this.getUIScene()?.floatLabel(GAME_CONFIG.worldCenterX, 112, `+${BALANCE_CONTENT.boss.therapistDefeatScore} SCORE`, '#ffd57a')
    this.cameras.main.flash(260, 255, 160, 220)
    this.cameras.main.shake(360, 0.007)
  }

  private tryEnemyFlavorText(enemy: Enemy): void {
    const roll = Phaser.Math.Between(0, 100)
    if (roll > 12) {
      return
    }
    const rareLines = ['CEO посмотрел дашборд, метрики срочно растут', 'кто-то удалил таблицу, хаос x3']
    if (roll < 2) {
      this.getUIScene()?.notify(rareLines[Phaser.Math.Between(0, rareLines.length - 1)])
      return
    }
    const ambientLines = [
      'дашборд стабилизирован',
      'данные очищены',
      'метрика пересчитана',
      'pipeline восстановлен',
      'таблица нормализована',
    ]
    if (roll < 8) {
      this.getUIScene()?.notify(ambientLines[Phaser.Math.Between(0, ambientLines.length - 1)])
      return
    }
    const kind = enemy.getKind()
    if (kind === ENEMY_IDS.EXCEL_ZOMBIE) {
      this.getUIScene()?.notify('Spreadsheet undead returned to cells.')
    } else if (kind === ENEMY_IDS.SLACK_NOTIFIER) {
      this.getUIScene()?.notify('Muted one noisy notification.')
    } else if (kind === ENEMY_IDS.LEGACY_MONOLITH) {
      this.getUIScene()?.notify('Monolith grudgingly deprecated.')
    }
  }

  private pushUiState(snapshot = gameState.getSnapshot()): void {
    const ui = this.getUIScene()
    if (!ui) {
      return
    }
    const radarPoints: Array<{ x: number; y: number; kind: 'enemy' | 'pickup' | 'boss' }> = []
    this.enemies.children.each((entry, idx) => {
      if (idx > 24) {
        return false
      }
      const enemy = entry as Enemy
      if (enemy.active && enemy.isAlive()) {
        radarPoints.push({ x: enemy.x, y: enemy.y, kind: 'enemy' })
      }
      return false
    })
    this.pickups.children.each((entry, idx) => {
      if (idx > 16) {
        return false
      }
      const pickup = entry as Phaser.Physics.Arcade.Sprite
      if (pickup.active) {
        radarPoints.push({ x: pickup.x, y: pickup.y, kind: 'pickup' })
      }
      return false
    })
    if (this.therapistBoss && this.therapistBoss.isAlive()) {
      radarPoints.push({ x: this.therapistBoss.x, y: this.therapistBoss.y, kind: 'boss' })
    }
    const bossHp =
      this.therapistBoss && this.therapistBoss.isAlive()
        ? { current: this.therapistBoss.getHp(), max: this.therapistBoss.getMaxHp() }
        : undefined
    ui.syncWithBoss(
      snapshot,
      this.pickupEffects.getActiveTimedBuffs(this.time.now),
      bossHp,
      this.scoreSystem.getComboState(),
      {
        player: { x: this.player.x, y: this.player.y },
        points: radarPoints,
      },
      this.activeEventId,
    )
  }

  private rollKillLogMessage(): string {
    const rareLines = [
      'CEO посмотрел дашборд, все начали паниковать',
      'продукт поменял KPI',
      'таблица оказалась staging',
      'кто-то удалил таблицу',
      'кто-то удалил таблицу, хаос x3',
    ]
    if (Phaser.Math.Between(0, 100) < 12) {
      return rareLines[Phaser.Math.Between(0, rareLines.length - 1)]
    }
    const commonLines = [
      'дашборд стабилизирован',
      'данные очищены',
      'метрика пересчитана',
      'pipeline восстановлен',
      'таблица нормализована',
    ]
    return commonLines[Phaser.Math.Between(0, commonLines.length - 1)]
  }

  private showEventBannerFor(event: MemeEventConfig): void {
    if (event.id === 'PRODUCTION_INCIDENT') {
      this.getUIScene()?.showEventBanner('⚠ ПРОДАКШН ИНЦИДЕНТ', 'Метрики падают')
    } else if (event.id === 'DEPLOY_FRIDAY') {
      this.getUIScene()?.showEventBanner('⚠ ДЕПЛОЙ В ПЯТНИЦУ', 'опасный режим активирован')
    } else if (event.id === 'EXECUTIVE_MEETING') {
      this.getUIScene()?.showEventBanner('⚠ СОВЕЩАНИЕ', 'Productivity -20%')
    } else if (event.id === 'CEO_DASHBOARD') {
      this.getUIScene()?.showEventBanner('⚠ CEO ОТКРЫЛ ДАШБОРД', 'метрики срочно растут')
    } else if (event.id === 'SQL_IN_PROD') {
      this.getUIScene()?.showEventBanner('⚠ SQL В ПРОДЕ', 'хаос увеличен')
    } else if (event.id === 'METRIC_RENAMED') {
      this.getUIScene()?.showEventBanner('⚠ КТО-ТО ПЕРЕИМЕНОВАЛ МЕТРИКУ', 'данные больше не сходятся')
    } else if (event.id === 'PRODUCTION_TABLE_DELETED') {
      this.getUIScene()?.showEventBanner('⚠ PRODUCTION TABLE DELETED', 'minimap offline')
    } else {
      this.getUIScene()?.showEventBanner(`⚠ ${event.label}`, 'Аналитическая турбулентность')
    }
  }

  private awardAchievements(ids: AchievementId[]): void {
    if (!ids.length) {
      return
    }
    ids.forEach((id) => {
      const def = ACHIEVEMENT_DEFS.find((item) => item.id === id)
      if (!def) {
        return
      }
      this.getUIScene()?.showAchievement(def.title, def.description)
      this.getUIScene()?.logAnalytics(`achievement unlocked: ${def.title.toLowerCase()}`)
    })
  }

  private applySqlSpellSideEffect(mode: (typeof ATTACK_MODES)[keyof typeof ATTACK_MODES]): void {
    if (mode === ATTACK_MODES.JOIN_STORM) {
      this.castJoinStorm()
      return
    }
    if (mode === ATTACK_MODES.GROUP_BY_EXPLOSION) {
      this.castGroupByExplosion()
      return
    }
    if (mode === ATTACK_MODES.DELETE_FROM) {
      this.castDeleteFrom()
    }
  }

  private castJoinStorm(): void {
    const origin = this.playerCombat.getLastSwingOrigin()
    const chained: Enemy[] = []
    this.enemies.children.each((entry) => {
      const enemy = entry as Enemy
      if (!enemy.active || !enemy.isAlive()) {
        return false
      }
      const d = Phaser.Math.Distance.Between(origin.x, origin.y, enemy.x, enemy.y)
      if (d <= 124) {
        chained.push(enemy)
      }
      return false
    })
    if (chained.length < 2) {
      return
    }
    const sorted = chained.sort((a, b) => a.x - b.x).slice(0, 5)
    for (let i = 0; i < sorted.length - 1; i += 1) {
      const from = sorted[i]
      const to = sorted[i + 1]
      const bolt = this.add.line(0, 0, from.x, from.y, to.x, to.y, 0x9fb8ff, 0.85).setDepth(38).setLineWidth(2, 2)
      this.tweens.add({
        targets: bolt,
        alpha: 0,
        duration: 140,
        onComplete: () => bolt.destroy(),
      })
      if (to.applyDamage(2)) {
        this.enemiesKilled += 1
        this.scoreSystem.addKillScore(to.getScoreValue())
      }
    }
    this.getUIScene()?.notify('JOIN STORM chained chaos')
  }

  private castGroupByExplosion(): void {
    let seedKind: string | null = null
    this.enemies.children.each((entry) => {
      const enemy = entry as Enemy
      if (enemy.active && enemy.isAlive()) {
        seedKind = enemy.getKind()
        return true
      }
      return false
    })
    if (!seedKind) {
      return
    }
    this.enemies.children.each((entry) => {
      const enemy = entry as Enemy
      if (!enemy.active || !enemy.isAlive() || enemy.getKind() !== seedKind) {
        return false
      }
      this.spawnPixelBurst(enemy.x, enemy.y, 6, 0xb98cff, 10, 2)
      if (enemy.applyDamage(2)) {
        this.enemiesKilled += 1
        this.scoreSystem.addKillScore(enemy.getScoreValue())
      }
      return false
    })
    this.getUIScene()?.notify(`GROUP BY exploded ${seedKind}`)
  }

  private castDeleteFrom(): void {
    const center = this.playerCombat.getLastSwingOrigin()
    const ring = this.add.circle(center.x, center.y, 16, 0xff8f8f, 0.2).setDepth(38)
    this.tweens.add({
      targets: ring,
      radius: 128,
      alpha: 0,
      duration: 260,
      onComplete: () => ring.destroy(),
    })
    this.enemies.children.each((entry) => {
      const enemy = entry as Enemy
      if (!enemy.active || !enemy.isAlive()) {
        return false
      }
      const d = Phaser.Math.Distance.Between(center.x, center.y, enemy.x, enemy.y)
      if (d > 118) {
        return false
      }
      const damage = Phaser.Math.Between(6, 10)
      if (enemy.applyDamage(damage)) {
        this.enemiesKilled += 1
        this.scoreSystem.addKillScore(enemy.getScoreValue())
      } else {
        enemy.flashHit()
      }
      return false
    })
    this.getUIScene()?.notify('DELETE FROM executed')
  }

  private handleEnemySpawned(enemy: Enemy): void {
    this.enemyLabelSystem.onEnemySpawned(enemy)
    this.handleEnemySpawnVoice(enemy)
  }

  private handleEnemySpawnVoice(enemy: Enemy): void {
    const now = this.time.now
    const kind = enemy.getKind()
    if (kind === ENEMY_IDS.MEETING_MONSTER && now - this.lastMeetingVoiceAt > 9000) {
      this.lastMeetingVoiceAt = now
      const lines = ['добавил еще одно совещание', 'перенес встречу на 18:30']
      this.getUIScene()?.showEventBanner('MEETING MONSTER', lines[Phaser.Math.Between(0, lines.length - 1)])
      this.getUIScene()?.logAnalytics('meeting monster spawned another call')
      this.cameras.main.shake(80, 0.0028)
      return
    }
    if (kind === ENEMY_IDS.LEGACY_MONOLITH && now - this.lastLegacyVoiceAt > 11000) {
      this.lastLegacyVoiceAt = now
      const lines = ['я переписан на Java 6', 'добавлен новый микросервис']
      this.getUIScene()?.showEventBanner('LEGACY MONOLITH', lines[Phaser.Math.Between(0, lines.length - 1)])
      this.getUIScene()?.logAnalytics('legacy monolith entered runtime')
      this.cameras.main.shake(70, 0.0026)
    }
  }

  private spawnPixelBurst(
    x: number,
    y: number,
    count: number,
    color: number,
    speed = 10,
    size = 2,
  ): void {
    for (let i = 0; i < count; i += 1) {
      const particle = this.add.rectangle(x, y, size, size, color, 0.95).setDepth(36)
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2)
      const distance = Phaser.Math.Between(6, speed)
      const tx = x + Math.cos(angle) * distance
      const ty = y + Math.sin(angle) * distance
      this.tweens.add({
        targets: particle,
        x: tx,
        y: ty,
        alpha: 0,
        duration: Phaser.Math.Between(180, 360),
        onComplete: () => particle.destroy(),
      })
    }
  }

  private spawnDirectionalSparks(
    x: number,
    y: number,
    direction: Phaser.Math.Vector2,
    massive: boolean,
    bossHit: boolean,
  ): void {
    const count = massive ? 10 : 5
    const color = massive ? 0xffd86a : bossHit ? 0xff9fd8 : 0x86e8ff
    for (let i = 0; i < count; i += 1) {
      const spread = Phaser.Math.FloatBetween(-0.55, 0.55)
      const dir = direction.clone().rotate(spread).normalize()
      const speed = Phaser.Math.Between(massive ? 12 : 7, massive ? 20 : 13)
      const spark = this.add.rectangle(x, y, massive ? 3 : 2, 2, color, 0.95).setDepth(37)
      this.tweens.add({
        targets: spark,
        x: x + dir.x * speed,
        y: y + dir.y * speed,
        alpha: 0,
        duration: Phaser.Math.Between(140, 240),
        onComplete: () => spark.destroy(),
      })
    }
  }

  private spawnEnemyDeathFx(enemy: Enemy, pos: Phaser.Math.Vector2): void {
    const kind = enemy.getKind()
    if (kind === ENEMY_IDS.EXCEL_ZOMBIE) {
      this.spawnPixelBurst(pos.x, pos.y, 14, 0x8fdf81, 11, 2)
      this.spawnPixelBurst(pos.x, pos.y, 8, 0x2f7d32, 9, 1)
      return
    }
    if (kind === ENEMY_IDS.SLACK_NOTIFIER) {
      this.spawnPixelBurst(pos.x, pos.y, 12, 0x8f9bff, 13, 2)
      const ring = this.add.circle(pos.x, pos.y, 4, 0x8f9bff, 0.18).setDepth(37)
      this.tweens.add({
        targets: ring,
        radius: 16,
        alpha: 0,
        duration: 220,
        onComplete: () => ring.destroy(),
      })
      return
    }
    if (kind === ENEMY_IDS.LEGACY_MONOLITH) {
      this.spawnPixelBurst(pos.x, pos.y, 18, 0x404553, 15, 3)
      this.spawnPixelBurst(pos.x, pos.y, 8, 0x1e2230, 10, 2)
      return
    }
    this.spawnPixelBurst(pos.x, pos.y, 11, 0xff6f6f, 12)
  }

  private triggerHitStop(durationMs: number): void {
    this.physics.world.pause()
    this.tweens.pauseAll()
    setTimeout(() => {
      this.physics.world.resume()
      this.tweens.resumeAll()
    }, durationMs)
  }

  private applySlowMotion(durationMs: number, timeScale: number): void {
    const previousTimeScale = this.time.timeScale
    const previousTweenScale = this.tweens.timeScale
    const previousPhysicsScale = this.physics.world.timeScale
    this.time.timeScale = timeScale
    this.tweens.timeScale = timeScale
    this.physics.world.timeScale = timeScale
    setTimeout(() => {
      this.time.timeScale = previousTimeScale
      this.tweens.timeScale = previousTweenScale
      this.physics.world.timeScale = previousPhysicsScale
    }, durationMs)
  }

  private buildArenaBackdrop(): void {
    this.environment.build(this.currentArenaTheme)
  }

  private updateAmbientBackdrop(): void {
    this.environment.update(this.time.now, this.activeEventId)

    if (this.time.now % 1400 < 20) {
      this.scanlineSweep.setY(-8)
      this.scanlineSweep.setAlpha(0.09)
      this.tweens.add({
        targets: this.scanlineSweep,
        y: GAME_CONFIG.height + 8,
        alpha: 0.01,
        duration: 700,
      })
    }
  }

  private resolveThemeForLevel(level: number): ArenaTheme {
    if (level <= 1) {
      return ARENA_THEME.OFFICE
    }
    if (level === 2) {
      return ARENA_THEME.SERVER_ROOM
    }
    if (level === 3) {
      return ARENA_THEME.DASHBOARD_HELL
    }
    if (level === 4) {
      return ARENA_THEME.LEGACY_SYSTEM
    }
    return ARENA_THEME.DATA_CORE
  }

  private transitionArenaTheme(theme: ArenaTheme): void {
    if (this.themeTransitionActive || !this.themeTransitionOverlay) {
      this.currentArenaTheme = theme
      this.environment.rebuild(theme)
      return
    }
    this.themeTransitionActive = true
    this.currentArenaTheme = theme
    const overlay = this.themeTransitionOverlay
    this.tweens.add({
      targets: overlay,
      alpha: 0.45,
      duration: 300,
      onComplete: () => {
        this.environment.rebuild(theme)
        this.tweens.add({
          targets: overlay,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            this.themeTransitionActive = false
          },
        })
      },
    })
  }
}
