# THE LAST QUERY - Architecture (Incremental Refactor)

## Goal

Evolve the MVP into a modular architecture while keeping the game playable at every step.

## Scene Responsibilities

- `BootScene`: setup generated textures and global initialization.
- `GameScene`: world simulation orchestration only.
- `UIScene`: HUD, buff bars, notifications, floating text.
- `GameOverScene`: final score, survival time, restart flow.

## Core Runtime

- `core/config.ts`: central tuning/config values.
- `core/constants.ts`: scene keys, ids, event names.
- `core/types.ts`: shared runtime types.
- `core/gameState.ts`: state store for hp/score/time/buffs.
- `core/eventBus.ts`: pub/sub for gameplay events.
- `core/timers.ts`: cooldown and timed-effect helpers.

## Data Flow

1. Input enters `PlayerController`.
2. `PlayerCombat` produces attack intents.
3. Systems resolve combat/collision/spawns.
4. Systems emit events through `eventBus`.
5. `gameState` updates snapshot values.
6. `UIScene` reads state + events and renders HUD feedback.

## Step 1 Status

- Core modules scaffolded and wired into current MVP.
- Existing gameplay preserved (movement, attack, spawn, hp, score, game over).
- Future architecture modules scaffolded as placeholders for next steps.

## Step 2 Status

- Player logic is split into:
  - `entities/player/Player.ts` for player entity state + sprite ownership
  - `entities/player/PlayerController.ts` for keyboard input and movement
  - `entities/player/PlayerCombat.ts` for sword cooldown and slash resolution
- `GameScene` now delegates movement and attack to controller/combat modules.

## Step 3 Status

- Enemy architecture is split into:
  - `entities/enemies/Enemy.ts` for enemy entity state/lifecycle
  - `entities/enemies/EnemyTypes.ts` for kind configs and spawn pool
  - `entities/enemies/EnemyAI.ts` for per-kind movement behavior
  - `entities/enemies/EnemyFactory.ts` for centralized creation
  - `entities/enemies/EnemySpawner.ts` for spawn timing and enemy updates
- `GameScene` now uses the new enemy modules and no longer depends on legacy `src/game` enemy code.

## Step 4 Status

- Pickup architecture is implemented in:
  - `entities/pickups/Pickup.ts`
  - `entities/pickups/PickupTypes.ts`
  - `entities/pickups/PickupFactory.ts`
  - `entities/pickups/PickupEffects.ts`
- Pickups now drop on enemy kill with a simple chance and can be collected by overlap.
- Minimal player hooks were added for speed boost, damage boost, invulnerability, and next-hit massive damage.

## Step 5 Status

- Systems extracted and wired:
  - `systems/CombatSystem.ts` for sword-hit and contact damage resolution outcomes
  - `systems/CollisionSystem.ts` for overlap registration (player-enemy, player-pickup)
  - `systems/ScoreSystem.ts` for kill and survival score updates
  - `systems/DifficultySystem.ts` for elapsed-time difficulty tier and spawn delay scaling
  - `systems/DropSystem.ts` for pickup drop chance and type selection
- `GameScene` remains orchestrator, but no longer owns detailed combat/contact/drop/score logic.

## Step 6 Status

- UI scene separation is active:
  - `scenes/UIScene.ts` now owns gameplay HUD updates and overlay UI widgets.
  - `scenes/GameOverScene.ts` now owns game-over presentation and restart flow.
- UI modules implemented:
  - `ui/HUD.ts` shows HP, score, survived time, and difficulty tier.
  - `ui/StatusBar.ts` shows active timed buffs and remaining seconds.
  - `ui/Notifications.ts` shows pickup notifications.
  - `ui/FloatingText.ts` renders lightweight floating labels.
- `GameScene` no longer draws HUD text or game-over overlay directly.

## Step 7 Status

- Meme/random event architecture implemented with:
  - `content/events.ts` for event definitions and tuning.
  - `systems/EventSystem.ts` for event scheduling, lifecycle, and modifiers.
- Implemented events:
  - `DEPLOY_FRIDAY`
  - `PRODUCTION_INCIDENT`
  - `AGENT_INVASION`
  - `RETROGRADE_MERCURY`
- `GameScene` now applies event modifiers to controls, enemy speed, and spawn pressure, and forwards event notifications to `UIScene`.

## Step 8 Status

- First boss architecture added with `entities/bosses/TherapistBoss.ts`.
- `GameScene` now supports a timed Therapist Boss encounter with:
  - one active boss at a time,
  - boss contact damage,
  - boss damage via player attacks,
  - periodic `BURNOUT_GHOST` minion spawns,
  - boss defeat score reward and guaranteed pickup drop.
- UI notifications now announce boss spawn and boss defeat.
