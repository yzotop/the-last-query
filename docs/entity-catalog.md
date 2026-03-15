# 1. Game Identity

- Current game title: `THE LAST QUERY` (from `src/core/config.ts`, `index.html`, and `src/scenes/TitleScene.ts`)
- Tagline: `An 8-bit meme survival in a collapsing data universe`
- Premise: `You are the last Data Analyst...Defend reality with a glowing SQL sword...`
- Short theme summary: Tech-apocalypse meme survival in a broken data center / office battlefield.
- Title screen summary: Stylized panel with title, premise, controls, start prompt, and click fallback hint.
- Game over summary: `RUN ENDED` recap with score, survival time, run stats, boss result, flavor line, and restart prompt.

# 2. Player

- Internal id / class / module:
  - Category id: `ENTITY_CATEGORIES.PLAYER` in `src/core/constants.ts`
  - Class: `Player` in `src/entities/player/Player.ts`
  - Controller: `PlayerController` in `src/entities/player/PlayerController.ts`
  - Combat: `PlayerCombat` in `src/entities/player/PlayerCombat.ts`
- Display name(s):
  - Narrative-facing: `Data Analyst` (title premise copy in `src/scenes/TitleScene.ts`)
  - No explicit on-HUD player name label.
- Attack name(s):
  - `glowing SQL sword` (title premise text)
  - `SQL Slash` (HUD control hint text)
- Gameplay role: Single controllable hero; movement, sword attacks, survival loop.
- Visual identity: Pixel sprite key `player` defined in `src/utils/pixelSprites.ts` (blue outfit, cyan sword glow).
- Movement/combat summary:
  - WASD directional movement in `PlayerController`
  - SPACE-triggered melee arc in `PlayerCombat`
  - Supports buffs: speed, damage, invulnerability, damage reduction, slash radius
- Files where defined:
  - `src/entities/player/Player.ts`
  - `src/entities/player/PlayerController.ts`
  - `src/entities/player/PlayerCombat.ts`
  - `src/entities/player/PlayerEffects.ts` (placeholder only)
- Files where referenced:
  - `src/scenes/GameScene.ts`
  - `src/systems/CombatSystem.ts`
  - `src/entities/pickups/PickupEffects.ts`
- Player-facing text tied to player:
  - `You are the last Data Analyst...`
  - `WASD move   |   SPACE attack   |   ESC pause   |   R restart`
  - `WASD move | SPACE SQL Slash`

# 3. Enemies

| internal id | display name | short description | gameplay behavior | visual/theme identity | stats/tuning source | files where defined | files where referenced | notifications / floating text / flavor text |
|---|---|---|---|---|---|---|---|---|
| `CI_CD_BOT` | CI/CD Bot (implicit) | Fast red deploy bot | Fast chase (`EnemyAI` boost) | `enemy-cicd` red pixel block bot | `src/entities/enemies/EnemyTypes.ts` | `src/core/constants.ts`, `src/entities/enemies/EnemyTypes.ts`, `src/utils/pixelSprites.ts` | `src/entities/enemies/EnemyAI.ts`, `src/entities/enemies/EnemySpawner.ts`, `src/content/events.ts`, `src/scenes/GameScene.ts` | No dedicated label; appears via event pressure (`DEPLOY FRIDAY`) |
| `ORCHESTRATOR` | Orchestrator (implicit) | Slower heavier control unit | Slow/heavy chase multiplier | `enemy-orchestrator` purple heavy block | `EnemyTypes.ts` | same pattern as above | `EnemyAI.ts`, `EnemySpawner.ts` | No direct player-facing name string |
| `AUTOMATOR_SWARM` | Automator Swarm (implicit) | Light swarm unit | Simple baseline chase | `enemy-swarm` yellow small unit | `EnemyTypes.ts` | same pattern | `EnemySpawner.ts` | No direct player-facing name string |
| `MEETING_MONSTER` | Meeting Monster (implicit) | Slow, high-contact threat | Slower heavy movement | `enemy-meeting` green large enemy | `EnemyTypes.ts` | same pattern | `EnemyAI.ts`, `EnemySpawner.ts` | No direct player-facing name string |
| `BURNOUT_GHOST` | Burnout Ghost (implicit) | Wobbling ghost-like enemy | Wobble/chase motion; event/boss minion synergy | `enemy-burnout` gray-blue ghost | `EnemyTypes.ts` | same pattern | `EnemyAI.ts`, `EnemySpawner.ts`, `GameScene.ts`, `content/events.ts` | Referenced in boss quote `THERAPIST: "LET OUT YOUR BURNOUT"` and `BURNOUT_WEEK` event context |
| `EXCEL_ZOMBIE` | Excel Zombie (implicit) | Slow durable spreadsheet undead | Slower chase | `enemy-excel-zombie` green spreadsheet palette | `EnemyTypes.ts` | same pattern | `EnemyAI.ts`, `EnemySpawner.ts`, `GameScene.ts` | `Spreadsheet undead returned to cells.` |
| `SLACK_NOTIFIER` | Slack Notifier (implicit) | Fast annoying notifier | Pulse-like speed bursts + ping VFX | `enemy-slack-notifier` blue notification icon look | `EnemyTypes.ts` | same pattern | `EnemyAI.ts`, `EnemySpawner.ts`, `GameScene.ts` | `Muted one noisy notification.` |
| `LEGACY_MONOLITH` | Legacy Monolith (implicit) | Very slow tank | Very slow heavy chase | `enemy-legacy-monolith` dark monolith silhouette | `EnemyTypes.ts` | same pattern | `EnemyAI.ts`, `EnemySpawner.ts`, `GameScene.ts` | `Monolith grudgingly deprecated.` |

# 4. Bosses

| internal id / class | display name | short description | gameplay role | minion relationship | spawn rule | defeat rule/reward | files where defined | files where referenced | all boss-related UI text / notifications / labels |
|---|---|---|---|---|---|---|---|---|---|
| `THERAPIST_BOSS` / `TherapistBoss` | Therapist Boss | Meme mini-boss with high HP and aura | Heavy single-target pressure boss | Spawns `BURNOUT_GHOST` via cooldown (`shouldSpawnMinion`) | Spawned once after `elapsedMs >= BALANCE_CONTENT.boss.therapistSpawnAtMs` | Defeat on HP <= 0; rewards score (`therapistDefeatScore`) + guaranteed pickup | `src/core/constants.ts`, `src/entities/bosses/TherapistBoss.ts`, `src/content/balance.ts`, `src/utils/pixelSprites.ts` | `src/scenes/GameScene.ts`, `src/systems/CombatSystem.ts`, `src/systems/CollisionSystem.ts`, `src/ui/HUD.ts` | `THERAPIST BOSS INCOMING`, `THERAPIST BOSS`, `THERAPIST: "LET OUT YOUR BURNOUT"`, `THERAPIST BOSS DEFEATED`, `BOSS DEFEATED +{score}`, `+{score} SCORE`, `THERAPIST HP: {current}/{max}`, `Boss Defeated: YES/NO` |

# 5. Pickups

| internal id | display name | short description | gameplay effect | duration | visual identity | files where defined | files where referenced | HUD/status text | notification text | floating label text |
|---|---|---|---|---|---|---|---|---|---|---|
| `PUMPKIN_LATTE` | Pumpkin Latte | Speed buff drink | +30% move speed | 8s | Orange latte icon + orange tint | `core/constants.ts`, `entities/pickups/PickupTypes.ts`, `utils/pixelSprites.ts` | `Pickup.ts`, `PickupFactory.ts`, `PickupEffects.ts`, `DropSystem.ts` | `> PUMPKIN LATTE {n}s` | `Pumpkin Latte: speed boosted` | Same message shown as floating label |
| `NEW_MACBOOK` | New MacBook | Damage buff item | +50% sword damage | 10s | Blue laptop icon | same | same | `> NEW MACBOOK {n}s` | `New MacBook: SQL damage boosted` | Same message |
| `THERAPY_SESSION` | Therapy Session | Heal pickup | Heal +40 HP (clamped) | Instant | Green cross-like icon | same | same | Not timed buff line | `Therapy Session: +{healed} HP` | Same message |
| `STACKOVERFLOW_SCROLL` | StackOverflow Scroll | Next-hit modifier | Next sword hit massive damage | Until consumed | Beige scroll icon | same | same | Not timed buff line | `StackOverflow Scroll: next hit is massive` | Same message |
| `VACATION_TICKET` | Vacation Ticket | Invulnerability pickup | Temporary invulnerability | 3s | Cyan ticket icon | same | same | `> VACATION TICKET {n}s` | `Vacation Ticket: invulnerable` | Same message |
| `NOISE_CANCELLING_AIRPODS` | Noise Cancelling AirPods | Defense pickup | Reduced incoming damage | 9s | White earbuds icon | same | same | `> NOISE CANCELLING AIRPODS {n}s` | `AirPods: noise cancelled, damage reduced` | Same message |
| `SECOND_MONITOR` | Second Monitor | Range pickup | Wider sword slash radius | 9s | Dual-monitor icon | same | same | `> SECOND MONITOR {n}s` | `Second Monitor: wider SQL slash` | Same message |

# 6. Events

| internal id | display name | short description | gameplay effect | visual identity / atmosphere | duration | files where defined | files where referenced | event start text | event end text | any special flavor text |
|---|---|---|---|---|---|---|---|---|---|---|
| `DEPLOY_FRIDAY` | DEPLOY FRIDAY | Sudden bad deploy wave | Faster spawning (`spawnDelayMultiplier`), CI/CD burst | Orange warning accent and flash | 14s | `src/content/events.ts` | `src/systems/EventSystem.ts`, `src/scenes/GameScene.ts` | `EVENT START: DEPLOY FRIDAY` | `EVENT ENDED: DEPLOY FRIDAY` | `Deploy pipeline panic: all hands!` |
| `PRODUCTION_INCIDENT` | PRODUCTION INCIDENT | Glitch/failure incident | Spawn pressure increase + glitchFx + burst | Red glitch overlay, shake, flash | 10s | same | same | `EVENT START: PRODUCTION INCIDENT` | `EVENT ENDED: PRODUCTION INCIDENT` | strong camera flash/shake, no extra line besides template |
| `AGENT_INVASION` | AGENT INVASION | Swarm escalation | Enemy speed multiplier + spawn pressure | Purple overrun accent + burst particles | 12s | same | same | `EVENT START: AGENT INVASION` | `EVENT ENDED: AGENT INVASION` | `Agent swarm scaling out...` |
| `RETROGRADE_MERCURY` | MERCURY RETROGRADE | Control inversion event | `reverseControls: true` | Blue weirdness accent + scanline angle drift | 8.5s | same | same | `EVENT START: MERCURY RETROGRADE` | `EVENT ENDED: MERCURY RETROGRADE` | `Controls are cursed. Blame the cosmos.` |
| `MACBOOK_RAIN` | MACBOOK RAIN | Hardware-storm chaos | Increased pickup drop chance | Falling laptop rectangles + pale blue accent | 11s | same | same | `EVENT START: MACBOOK RAIN` | `EVENT ENDED: MACBOOK RAIN` | `Free hardware storm! Catch the chaos.` |
| `BURNOUT_WEEK` | BURNOUT WEEK | Burnout pressure period | Spawn pressure/speed increase + burnout fog + burnout burst | Purple fog mood overlay | 12.5s | same | same | `EVENT START: BURNOUT WEEK` | `EVENT ENDED: BURNOUT WEEK` | `Everyone is tired. Ghosts are thriving.` |

# 7. Scenes

| scene key | file path | purpose | visible text owned by the scene | entities/systems it touches directly |
|---|---|---|---|---|
| `BootScene` | `src/scenes/BootScene.ts` | Bootstraps textures and registry title, starts title scene | none | `GAME_CONFIG`, `createPixelTextures`, scene transitions |
| `TitleScene` | `src/scenes/TitleScene.ts` | Start screen and input handoff into gameplay | Title, tagline, premise, controls, start prompt, click fallback hint | `SCENE_KEYS`, keyboard/pointer input, launches `GameScene` and `UIScene` |
| `GameScene` | `src/scenes/GameScene.ts` | World simulation orchestrator | Event/boss notifications via `UIScene`; floating labels; flavor text | `Player`, `PlayerController`, `PlayerCombat`, `EnemySpawner`, `TherapistBoss`, `PickupEffects`, `CombatSystem`, `CollisionSystem`, `ScoreSystem`, `DifficultySystem`, `DropSystem`, `EventSystem`, `gameState` |
| `UIScene` | `src/scenes/UIScene.ts` | Overlay UI, pause, notifications | Pause overlay text, pause/resume notifications, delegated HUD/status/notifications/floating text | `HUD`, `StatusBar`, `Notifications`, `FloatingText`, `gameState`, scene pause/resume control |
| `GameOverScene` | `src/scenes/GameOverScene.ts` | End-of-run recap and restart flow | Run ended headline, score/time recap, stats, flavor line, restart prompt | Reads run payload from `GameScene`; controls restart scene transitions |

# 8. UI Modules

| module | file path | purpose | text/content it renders | hardcoded or data-driven |
|---|---|---|---|---|
| `HUD` | `src/ui/HUD.ts` | Main HUD panel | HP, score, time, tier, controls hint, boss HP label | Mixed: hardcoded templates + dynamic values |
| `StatusBar` | `src/ui/StatusBar.ts` | Buff list panel | `Buffs:` title and `> {LABEL} {seconds}s` lines | Template hardcoded, labels data-driven from pickup configs |
| `Notifications` | `src/ui/Notifications.ts` | Top-right notification queue | Uppercased message strings from callers | Data-driven messages, styling hardcoded |
| `FloatingText` | `src/ui/FloatingText.ts` | Temporary floating labels | Arbitrary text labels from callers | Fully data-driven text |
| `UIScene` pause overlay | `src/scenes/UIScene.ts` | Pause modal | `PAUSED`, `ESC to resume query execution` | Hardcoded |

# 9. Systems

| system | file path | purpose | entity/content ids depended on | visible text? |
|---|---|---|---|---|
| `CombatSystem` | `src/systems/CombatSystem.ts` | Resolves attack hits and contact damage | `Enemy`, `TherapistBoss`, player combat, enemy tuning | No direct text |
| `CollisionSystem` | `src/systems/CollisionSystem.ts` | Registers overlaps for player/enemy/pickup/boss | `Enemy`, `Pickup`, `TherapistBoss` | No text |
| `ScoreSystem` | `src/systems/ScoreSystem.ts` | Kill + survival score updates | `gameState`, score tuning | No text |
| `DifficultySystem` | `src/systems/DifficultySystem.ts` | Tier progression and spawn delay scaling | enemy tuning, `gameState` tier | No text |
| `DropSystem` | `src/systems/DropSystem.ts` | Pickup drops and guaranteed drops | `DROP_RATES`, `PICKUP_DROP_POOL`, pickup IDs | No text |
| `EventSystem` | `src/systems/EventSystem.ts` | Event scheduling, active modifiers | `MEME_EVENT_CONFIGS`, event ids/modifiers | No direct display text (labels come from content file) |
| `SpawnSystem` | `src/systems/SpawnSystem.ts` | Placeholder only | none | No text |
| `EffectsSystem` | `src/systems/EffectsSystem.ts` | Placeholder only | none | No text |

# 10. Content and Tuning Sources

| file | what it defines | ids live there | labels/text there? | mechanics-only? |
|---|---|---|---|---|
| `src/content/enemies.ts` | Placeholder object | none | no | yes (currently empty) |
| `src/content/pickups.ts` | Placeholder object | none | no | yes (currently empty) |
| `src/content/events.ts` | Event configs, labels, durations, weights, modifiers | event ids | yes (`label`) | mixed |
| `src/content/balance.ts` | Boss balance numbers | boss tuning values | no | yes |
| `src/core/constants.ts` | Scene/entity/event ids | scene keys, enemy ids, pickup ids, boss ids, game event ids | no display labels | mostly mechanics identifiers |
| `src/core/types.ts` | Shared TS types | type aliases for ids, buffs, state snapshots | no | yes |
| `src/core/config.ts` | Global game/player/enemy/score/drop/buff tuning + title | title and tuning constants | title only | mixed |
| `src/entities/enemies/EnemyTypes.ts` | Enemy per-kind stats + spawn pool | enemy kinds | no explicit display labels | yes |
| `src/entities/pickups/PickupTypes.ts` | Pickup labels, texture keys, durations/magnitudes | pickup ids | yes (`label`) | mixed |

# 11. Asset / Visual Identity Sources

| file path | what visuals it controls | theme-specific vs generic |
|---|---|---|
| `src/utils/pixelSprites.ts` | All generated textures for player, enemies, boss, pickups | Strongly theme-specific (enemy/pickup silhouettes and palette) |
| `src/entities/pickups/Pickup.ts` | Pickup tint mapping + bob/pulse idle animation | Mostly theme-specific tint identities |
| `src/entities/bosses/TherapistBoss.ts` | Boss aura, shadow, scale/angle pulse | Theme-specific boss presence |
| `src/scenes/GameScene.ts` | Arena backdrop, overlays (glitch/burnout/event accents), event laptop rain, combat particles | Mixed: arena style/theme-specific; many FX generic reusable |
| `src/scenes/TitleScene.ts` | Title screen palette, framing, text layout | Theme-specific copy + style |
| `src/scenes/GameOverScene.ts` | Game-over panel styling and accents | Theme-specific copy + style |
| `src/ui/HUD.ts` | HUD panel and boss panel visual style | Mostly generic UI shell, boss label is theme-specific |
| `src/ui/Notifications.ts` | Notification panel style | Generic style, content is data-driven/theme-dependent |

# 12. Summary

- Total player count: **1**
- Total enemy count: **8**
- Total boss count: **1**
- Total pickup count: **7**
- Total event count: **6**
- Total scene count: **5**

- Key files to edit for a fast reskin:
  - `src/scenes/TitleScene.ts`
  - `src/scenes/GameOverScene.ts`
  - `src/content/events.ts`
  - `src/entities/pickups/PickupTypes.ts`
  - `src/scenes/GameScene.ts` (notifications/flavor lines)

- Key files to edit for a full thematic rewrite:
  - `src/utils/pixelSprites.ts`
  - `src/entities/enemies/EnemyTypes.ts`
  - `src/entities/enemies/EnemyAI.ts` (if behavior fantasy should match new fantasy)
  - `src/entities/pickups/Pickup.ts` (tints/animation identity)
  - `src/entities/bosses/TherapistBoss.ts`
  - `src/core/config.ts` (title + tone-adjacent defaults)
