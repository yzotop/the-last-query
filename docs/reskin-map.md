# 1. Must-change for a basic reskin

- Game title and entry identity:
  - `THE LAST QUERY`
  - Tagline and premise block in `src/scenes/TitleScene.ts`
  - Browser title in `index.html`
- Player-facing hero framing:
  - `Data Analyst` premise line
  - `glowing SQL sword` references
  - `SQL Slash` control hint wording
- Enemy-facing theme terms:
  - Enemy flavor notifications in `src/scenes/GameScene.ts`
  - Event lines that imply specific tech setting
- Boss name and callouts:
  - `THERAPIST BOSS...` strings in `src/scenes/GameScene.ts`
  - Boss HP label template in `src/ui/HUD.ts`
- Pickup names and copy:
  - Labels in `src/entities/pickups/PickupTypes.ts`
  - Effect notifications in `src/entities/pickups/PickupEffects.ts`
- Event names and copy:
  - Labels in `src/content/events.ts`
  - Start/end/flavor messages in `src/scenes/GameScene.ts`

# 2. Recommended-change for a strong reskin

- Flavor lines:
  - All meme text in `TitleScene`, `GameScene`, `GameOverScene`
- Title screen copy:
  - Tagline, premise, setup sentence, control sentence
- Game over copy:
  - `RUN ENDED`, retry prompt, flavor variants
- Event copy:
  - `EVENT START/ENDED` wrapper text and all per-event flavor lines
- Boss copy:
  - Spawn, minion quote, defeat strings
- Pickup copy:
  - Pickup labels and notify strings (for consistency)
- Visual tint/theme references:
  - Pickup tint map in `src/entities/pickups/Pickup.ts`
  - Palette in `src/utils/pixelSprites.ts`

# 3. Optional visual-only changes

- Sprite palette/tints (`src/utils/pixelSprites.ts`, `src/entities/pickups/Pickup.ts`)
- Pickup visuals and animation feel (`Pickup.ts`)
- Boss aura/shadow (`src/entities/bosses/TherapistBoss.ts`)
- Arena/background style and overlays (`src/scenes/GameScene.ts`)
- UI palette and panel accents (`src/ui/HUD.ts`, `src/ui/Notifications.ts`, `src/scenes/TitleScene.ts`, `src/scenes/GameOverScene.ts`, `src/scenes/UIScene.ts`)

# 4. Safe-to-keep mechanical/internal names

These internal symbols can stay unchanged for a pure cosmetic/text reskin:

- Scene keys in `src/core/constants.ts`: `BOOT`, `TITLE`, `GAME`, `UI`, `GAME_OVER`
- Entity categories: `PLAYER`, `ENEMY`, `PICKUP`, `BOSS`
- Core system class names:
  - `CombatSystem`, `CollisionSystem`, `ScoreSystem`, `DifficultySystem`, `DropSystem`, `EventSystem`
- Core gameplay classes:
  - `Player`, `PlayerController`, `PlayerCombat`, `Enemy`, `EnemySpawner`, `Pickup`, `TherapistBoss`
- Core tuning/config types:
  - `GAME_CONFIG`, `PLAYER_TUNING`, `ENEMY_TUNING`, `SCORE_TUNING`, `DROP_RATES`, `BUFF_DURATIONS`

# 5. Table: Rename worksheet

| category | internal id | current display name | current meaning/theme | file paths to update | suggested new name | suggested new meaning | priority |
|---|---|---|---|---|---|---|---|
| game identity | `GAME_CONFIG.title` | THE LAST QUERY | Tech meme apocalypse title | `src/core/config.ts`, `src/scenes/TitleScene.ts`, `index.html` |  |  | high |
| game identity | n/a | An 8-bit meme survival in a collapsing data universe | Tagline | `src/scenes/TitleScene.ts` |  |  | high |
| game identity | n/a | You are the last Data Analyst... | Premise copy | `src/scenes/TitleScene.ts` |  |  | high |
| player | `ENTITY_CATEGORIES.PLAYER` | Data Analyst (narrative only) | Hero archetype | `src/scenes/TitleScene.ts`, `src/ui/HUD.ts` |  |  | high |
| attack | player combat text | SQL sword / SQL Slash | SQL-themed melee identity | `src/scenes/TitleScene.ts`, `src/ui/HUD.ts`, `src/entities/pickups/PickupEffects.ts`, `src/scenes/GameOverScene.ts` |  |  | high |
| enemy | `CI_CD_BOT` | CI/CD Bot (implicit) | Deploy automation enemy | `src/entities/enemies/EnemyTypes.ts`, `src/utils/pixelSprites.ts`, `src/content/events.ts`, `src/scenes/GameScene.ts` |  |  | high |
| enemy | `ORCHESTRATOR` | Orchestrator (implicit) | Heavy coordinator enemy | `src/entities/enemies/EnemyTypes.ts`, `src/utils/pixelSprites.ts` |  |  | medium |
| enemy | `AUTOMATOR_SWARM` | Automator Swarm (implicit) | Swarm fodder enemy | `src/entities/enemies/EnemyTypes.ts`, `src/utils/pixelSprites.ts` |  |  | medium |
| enemy | `MEETING_MONSTER` | Meeting Monster (implicit) | Slow heavy office enemy | `src/entities/enemies/EnemyTypes.ts`, `src/utils/pixelSprites.ts` |  |  | medium |
| enemy | `BURNOUT_GHOST` | Burnout Ghost (implicit) | Wobbling burnout enemy | `src/entities/enemies/EnemyTypes.ts`, `src/utils/pixelSprites.ts`, `src/content/events.ts`, `src/scenes/GameScene.ts` |  |  | high |
| enemy | `EXCEL_ZOMBIE` | Excel Zombie (implicit) | Spreadsheet undead | `src/entities/enemies/EnemyTypes.ts`, `src/utils/pixelSprites.ts`, `src/scenes/GameScene.ts` |  |  | high |
| enemy | `SLACK_NOTIFIER` | Slack Notifier (implicit) | Notification harasser | `src/entities/enemies/EnemyTypes.ts`, `src/utils/pixelSprites.ts`, `src/scenes/GameScene.ts` |  |  | high |
| enemy | `LEGACY_MONOLITH` | Legacy Monolith (implicit) | Old heavy system tank | `src/entities/enemies/EnemyTypes.ts`, `src/utils/pixelSprites.ts`, `src/scenes/GameScene.ts` |  |  | high |
| boss | `THERAPIST_BOSS` | Therapist Boss | Meme mini-boss | `src/entities/bosses/TherapistBoss.ts`, `src/scenes/GameScene.ts`, `src/ui/HUD.ts`, `src/scenes/GameOverScene.ts`, `src/content/balance.ts` |  |  | high |
| pickup | `PUMPKIN_LATTE` | Pumpkin Latte | Speed buff item | `src/entities/pickups/PickupTypes.ts`, `src/entities/pickups/PickupEffects.ts`, `src/utils/pixelSprites.ts`, `src/entities/pickups/Pickup.ts` |  |  | high |
| pickup | `NEW_MACBOOK` | New MacBook | Damage buff item | same |  |  | high |
| pickup | `THERAPY_SESSION` | Therapy Session | Heal item | same |  |  | high |
| pickup | `STACKOVERFLOW_SCROLL` | StackOverflow Scroll | Massive next-hit item | same |  |  | high |
| pickup | `VACATION_TICKET` | Vacation Ticket | Invulnerability item | same |  |  | high |
| pickup | `NOISE_CANCELLING_AIRPODS` | Noise Cancelling AirPods | Damage reduction item | same |  |  | high |
| pickup | `SECOND_MONITOR` | Second Monitor | Slash-width buff item | same |  |  | high |
| event | `DEPLOY_FRIDAY` | DEPLOY FRIDAY | Sudden deploy pressure | `src/content/events.ts`, `src/scenes/GameScene.ts` |  |  | high |
| event | `PRODUCTION_INCIDENT` | PRODUCTION INCIDENT | Glitch/failure period | same |  |  | high |
| event | `AGENT_INVASION` | AGENT INVASION | Enemy speed/pressure spike | same |  |  | high |
| event | `RETROGRADE_MERCURY` | MERCURY RETROGRADE | Reverse controls weirdness | same |  |  | high |
| event | `MACBOOK_RAIN` | MACBOOK RAIN | Hardware chaos period | same |  |  | high |
| event | `BURNOUT_WEEK` | BURNOUT WEEK | Burnout fog and pressure | same |  |  | high |
| game over | n/a | RUN ENDED | Current run-end tone | `src/scenes/GameOverScene.ts` |  |  | medium |
| game over | n/a | Therapist says: "Progress is nonlinear." | Themed flavor variant | `src/scenes/GameOverScene.ts` |  |  | high |
| pause | n/a | ESC to resume query execution | Themed pause line | `src/scenes/UIScene.ts` |  |  | medium |
| flavor | n/a | Spreadsheet undead returned to cells. | Enemy kill quip | `src/scenes/GameScene.ts` |  |  | medium |
| flavor | n/a | Muted one noisy notification. | Enemy kill quip | `src/scenes/GameScene.ts` |  |  | medium |
| flavor | n/a | Monolith grudgingly deprecated. | Enemy kill quip | `src/scenes/GameScene.ts` |  |  | medium |

# 6. Recommended future refactor

Practical lightweight plan (no mechanic changes):

1. Central strings registry
   - Add `src/content/strings.ts` with grouped exports (`title`, `hud`, `gameOver`, `notifications`, `flavor`).
   - Replace hardcoded scene/UI literals with imports.
2. Theme config
   - Add `src/content/theme.ts` for palette and style constants used by Title/HUD/GameOver/Notifications.
3. Display-name mapping
   - Add `enemyDisplayNames` and `pickupDisplayNames` maps keyed by internal IDs.
   - Keep `EnemyTypes` and `PickupTypes` focused on mechanics fields.
4. Flavor text mapping
   - Move enemy flavor quips and game-over variants into `content/flavor.ts`.
5. Event copy registry
   - Extend `src/content/events.ts` with `startText`, `endText`, optional `flavorText` per event.
6. Title/game-over copy config
   - Move full title and game-over copy blocks to `content/titleCopy.ts` and `content/gameOverCopy.ts`.

Result: future reskin changes become mostly data-file edits, with minimal touch to scene/system logic.
