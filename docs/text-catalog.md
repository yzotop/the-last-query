# Scope Notes

- Catalog covers runtime player-visible text in first-party project files (`src/*` and `index.html`).
- Excludes debug `console.log` strings and generated/bundled output in `dist/`.
- Includes dynamic templates and data-driven labels used by UI.

# 1. Title Screen Text

| exact text | source file | purpose | notes |
|---|---|---|---|
| `THE LAST QUERY` | `src/scenes/TitleScene.ts` | Main title headline | Also in `index.html` title and `src/core/config.ts` |
| `An 8-bit meme survival in a collapsing data universe` | `src/scenes/TitleScene.ts` | Tagline | Static |
| `You are the last Data Analyst.\nDefend reality with a glowing SQL sword\nagainst automation agents and therapy-tier chaos.` | `src/scenes/TitleScene.ts` | Premise text block | Multiline |
| `Data center down. Dashboards shattered. Meetings still alive.` | `src/scenes/TitleScene.ts` | Flavor setup line | Static |
| `WASD move   |   SPACE attack   |   ESC pause   |   R restart` | `src/scenes/TitleScene.ts` | Control summary | Static |
| `Press ENTER or SPACE to start` | `src/scenes/TitleScene.ts` | Start prompt | Static |
| `Click once if keys don't respond` | `src/scenes/TitleScene.ts` | Input fallback hint | Click-to-start fallback |

# 2. Controls Text

| exact text | source file | purpose | notes |
|---|---|---|---|
| `WASD move   |   SPACE attack   |   ESC pause   |   R restart` | `src/scenes/TitleScene.ts` | Pre-run controls summary | Title screen |
| `WASD move | SPACE SQL Slash` | `src/ui/HUD.ts` | In-game control reminder | HUD hint line |
| `ESC to resume query execution` | `src/scenes/UIScene.ts` | Pause overlay hint | Visible when paused |
| `Press R to query reality again` | `src/scenes/GameOverScene.ts` | Restart instruction | Game-over screen |

# 3. HUD Text

| exact text / format | source file | purpose | notes |
|---|---|---|---|
| `HP: 100` (initial) | `src/ui/HUD.ts` | Initial HP placeholder | Replaced by template update |
| `Score: 0` (initial) | `src/ui/HUD.ts` | Initial score placeholder | Replaced by template update |
| `Time: 00:00` (initial) | `src/ui/HUD.ts` | Initial timer placeholder | Replaced by template update |
| `Tier: 1` (initial) | `src/ui/HUD.ts` | Initial difficulty tier | Replaced by template update |
| `HP: {snapshot.hp}/{snapshot.maxHp}` | `src/ui/HUD.ts` | Runtime HP display | Dynamic template |
| `Score: {snapshot.score}` | `src/ui/HUD.ts` | Runtime score display | Dynamic template |
| `Time: {mm}:{ss}` | `src/ui/HUD.ts` | Runtime survived time | Dynamic template |
| `Tier: {snapshot.difficultyTier}` | `src/ui/HUD.ts` | Runtime difficulty tier | Dynamic template |
| `THERAPIST HP: {bossHp.current}/{bossHp.max}` | `src/ui/HUD.ts` | Boss HP display | Visible only while boss alive |

# 4. Pause Text

| exact text | source file | purpose | notes |
|---|---|---|---|
| `PAUSED` | `src/scenes/UIScene.ts` | Pause overlay title | Static |
| `ESC to resume query execution` | `src/scenes/UIScene.ts` | Pause overlay hint | Static |
| `PAUSED` | `src/scenes/UIScene.ts` | Notification message | Uppercased by notification renderer |
| `RESUMED` | `src/scenes/UIScene.ts` | Notification message | Uppercased by notification renderer |

# 5. Game Over Text

| exact text | source file | purpose | notes |
|---|---|---|---|
| `RUN ENDED` | `src/scenes/GameOverScene.ts` | Game-over heading | Static |
| `Final Score: {score}` | `src/scenes/GameOverScene.ts` | Score recap | Dynamic template |
| `Survived: {mm}:{ss}` | `src/scenes/GameOverScene.ts` | Time recap | Dynamic template |
| `Boss Defeated: {YES/NO}   |   Boss Kills: {bossesDefeated}` | `src/scenes/GameOverScene.ts` | Boss recap | Dynamic template |
| `Enemies Killed: {enemiesKilled}   |   Pickups Collected: {pickupsCollected}` | `src/scenes/GameOverScene.ts` | Run stats recap | Dynamic template |
| `Therapist says: "Progress is nonlinear."` | `src/scenes/GameOverScene.ts` | Flavor variant | Shown if boss defeated |
| `Impressive chaos. Needs more SQL.` | `src/scenes/GameOverScene.ts` | Flavor variant | Shown if many enemies killed |
| `Take a breath. Then run it back.` | `src/scenes/GameOverScene.ts` | Flavor variant | Default flavor |
| `Press R to query reality again` | `src/scenes/GameOverScene.ts` | Restart prompt | Static |

# 6. Notifications

| exact text | source file | trigger | notes |
|---|---|---|---|
| `Pumpkin Latte: speed boosted` | `src/entities/pickups/PickupEffects.ts` | Pickup collected | Routed via `GameScene -> UIScene.notify` |
| `New MacBook: SQL damage boosted` | `src/entities/pickups/PickupEffects.ts` | Pickup collected | same |
| `Therapy Session: +{healed} HP` | `src/entities/pickups/PickupEffects.ts` | Pickup collected/heal | Dynamic |
| `StackOverflow Scroll: next hit is massive` | `src/entities/pickups/PickupEffects.ts` | Pickup collected | same |
| `Vacation Ticket: invulnerable` | `src/entities/pickups/PickupEffects.ts` | Pickup collected | same |
| `AirPods: noise cancelled, damage reduced` | `src/entities/pickups/PickupEffects.ts` | Pickup collected | same |
| `Second Monitor: wider SQL slash` | `src/entities/pickups/PickupEffects.ts` | Pickup collected | same |
| `STACK OVERFLOW CRITICAL!` | `src/scenes/GameScene.ts` | Massive hit landed | Combat feedback |
| `EVENT START: {event.label}` | `src/scenes/GameScene.ts` | Event begins | Dynamic label |
| `EVENT ENDED: {event.label}` | `src/scenes/GameScene.ts` | Event ends | Dynamic label |
| `Deploy pipeline panic: all hands!` | `src/scenes/GameScene.ts` | `DEPLOY_FRIDAY` start | Flavor |
| `Agent swarm scaling out...` | `src/scenes/GameScene.ts` | `AGENT_INVASION` start | Flavor |
| `Controls are cursed. Blame the cosmos.` | `src/scenes/GameScene.ts` | `RETROGRADE_MERCURY` start | Flavor |
| `Free hardware storm! Catch the chaos.` | `src/scenes/GameScene.ts` | `MACBOOK_RAIN` start | Flavor |
| `Everyone is tired. Ghosts are thriving.` | `src/scenes/GameScene.ts` | `BURNOUT_WEEK` start | Flavor |
| `THERAPIST: "LET OUT YOUR BURNOUT"` | `src/scenes/GameScene.ts` | Boss minion spawn tick | Flavor/combat callout |
| `THERAPIST BOSS INCOMING` | `src/scenes/GameScene.ts` | Boss spawn | Boss intro |
| `THERAPIST BOSS DEFEATED` | `src/scenes/GameScene.ts` | Boss defeated | Boss outro |
| `Spreadsheet undead returned to cells.` | `src/scenes/GameScene.ts` | Random flavor on `EXCEL_ZOMBIE` kill | Low chance |
| `Muted one noisy notification.` | `src/scenes/GameScene.ts` | Random flavor on `SLACK_NOTIFIER` kill | Low chance |
| `Monolith grudgingly deprecated.` | `src/scenes/GameScene.ts` | Random flavor on `LEGACY_MONOLITH` kill | Low chance |
| `PAUSED` | `src/scenes/UIScene.ts` | Pause toggle on | Notification variant |
| `RESUMED` | `src/scenes/UIScene.ts` | Pause toggle off | Notification variant |

# 7. Floating Labels / Damage Text

| exact text or template | source file | trigger | notes |
|---|---|---|---|
| `CRITICAL!` | `src/scenes/GameScene.ts` | High-damage hit (massive/50+) | Floating combat label |
| `{hit.damage}` | `src/scenes/GameScene.ts` | Normal hit | Numeric damage label |
| `>> {event.label} <<` | `src/scenes/GameScene.ts` | Event start | Center-top event callout |
| `THERAPIST BOSS` | `src/scenes/GameScene.ts` | Boss spawn | Spawn callout |
| `BOSS DEFEATED +{therapistDefeatScore}` | `src/scenes/GameScene.ts` | Boss defeat | Near player |
| `+{therapistDefeatScore} SCORE` | `src/scenes/GameScene.ts` | Boss defeat | Center score splash |
| `{pickup notify message}` | `src/scenes/GameScene.ts` + `src/entities/pickups/PickupEffects.ts` | Pickup collected | Uses same text as pickup notification |

# 8. Status/Buff Text

| exact text | source file | purpose | notes |
|---|---|---|---|
| `Buffs:` | `src/ui/StatusBar.ts` | Buff panel title | Static |
| `-` | `src/ui/StatusBar.ts` | Empty buff line placeholder | Repeated lines |
| `> {BUFF_LABEL_UPPERCASE}  {seconds}s` | `src/ui/StatusBar.ts` | Active timed buff line | Dynamic from pickup labels + remaining time |
| `Pumpkin Latte` | `src/entities/pickups/PickupTypes.ts` | Buff label source | Converted to uppercase in status bar |
| `New MacBook` | `src/entities/pickups/PickupTypes.ts` | Buff label source | same |
| `Vacation Ticket` | `src/entities/pickups/PickupTypes.ts` | Buff label source | same |
| `Noise Cancelling AirPods` | `src/entities/pickups/PickupTypes.ts` | Buff label source | same |
| `Second Monitor` | `src/entities/pickups/PickupTypes.ts` | Buff label source | same |

# 9. Flavor Text

| exact text | source file | context |
|---|---|---|
| `An 8-bit meme survival in a collapsing data universe` | `src/scenes/TitleScene.ts` | Title tagline |
| `You are the last Data Analyst...` | `src/scenes/TitleScene.ts` | Premise |
| `Data center down. Dashboards shattered. Meetings still alive.` | `src/scenes/TitleScene.ts` | Premise flavor |
| `Deploy pipeline panic: all hands!` | `src/scenes/GameScene.ts` | Event flavor |
| `Agent swarm scaling out...` | `src/scenes/GameScene.ts` | Event flavor |
| `Controls are cursed. Blame the cosmos.` | `src/scenes/GameScene.ts` | Event flavor |
| `Free hardware storm! Catch the chaos.` | `src/scenes/GameScene.ts` | Event flavor |
| `Everyone is tired. Ghosts are thriving.` | `src/scenes/GameScene.ts` | Event flavor |
| `THERAPIST: "LET OUT YOUR BURNOUT"` | `src/scenes/GameScene.ts` | Boss flavor |
| `Spreadsheet undead returned to cells.` | `src/scenes/GameScene.ts` | Enemy flavor |
| `Muted one noisy notification.` | `src/scenes/GameScene.ts` | Enemy flavor |
| `Monolith grudgingly deprecated.` | `src/scenes/GameScene.ts` | Enemy flavor |
| `Therapist says: "Progress is nonlinear."` | `src/scenes/GameOverScene.ts` | Game-over flavor variant |
| `Impressive chaos. Needs more SQL.` | `src/scenes/GameOverScene.ts` | Game-over flavor variant |
| `Take a breath. Then run it back.` | `src/scenes/GameOverScene.ts` | Game-over flavor variant |

# 10. Dynamic Text Templates

| template | source file | variables used |
|---|---|---|
| `HP: {snapshot.hp}/{snapshot.maxHp}` | `src/ui/HUD.ts` | `snapshot.hp`, `snapshot.maxHp` |
| `Score: {snapshot.score}` | `src/ui/HUD.ts` | `snapshot.score` |
| `Time: {mm}:{ss}` | `src/ui/HUD.ts` | `snapshot.elapsedMs` |
| `Tier: {snapshot.difficultyTier}` | `src/ui/HUD.ts` | `snapshot.difficultyTier` |
| `THERAPIST HP: {current}/{max}` | `src/ui/HUD.ts` | `bossHp.current`, `bossHp.max` |
| `Final Score: {data.score}` | `src/scenes/GameOverScene.ts` | `data.score` |
| `Survived: {mm}:{ss}` | `src/scenes/GameOverScene.ts` | `data.elapsedMs` |
| `Boss Defeated: {YES/NO}   |   Boss Kills: {bossesDefeated}` | `src/scenes/GameOverScene.ts` | `bossDefeated`, `bossesDefeated` |
| `Enemies Killed: {enemiesKilled}   |   Pickups Collected: {pickupsCollected}` | `src/scenes/GameOverScene.ts` | `enemiesKilled`, `pickupsCollected` |
| `EVENT START: {event.label}` | `src/scenes/GameScene.ts` | `event.label` |
| `EVENT ENDED: {event.label}` | `src/scenes/GameScene.ts` | `event.label` |
| `>> {event.label} <<` | `src/scenes/GameScene.ts` | `event.label` |
| `{hit.damage}` | `src/scenes/GameScene.ts` | `hit.damage` |
| `BOSS DEFEATED +{score}` | `src/scenes/GameScene.ts` | `BALANCE_CONTENT.boss.therapistDefeatScore` |
| `+{score} SCORE` | `src/scenes/GameScene.ts` | `BALANCE_CONTENT.boss.therapistDefeatScore` |
| `Therapy Session: +{healed} HP` | `src/entities/pickups/PickupEffects.ts` | `healed` |
| `> {buff.label.toUpperCase()}  {seconds}s` | `src/ui/StatusBar.ts` | `buff.label`, `buff.remainingMs` |

---

- Total text string count (runtime player-facing entries, including templates and repeated-context lines): **88**
- Top files containing the most hardcoded text:
  1. `src/scenes/GameScene.ts`
  2. `src/scenes/TitleScene.ts`
  3. `src/scenes/GameOverScene.ts`
  4. `src/entities/pickups/PickupEffects.ts`
  5. `src/ui/HUD.ts`
- Recommended files to centralize first for future reskinning:
  - `src/scenes/TitleScene.ts`
  - `src/scenes/GameScene.ts`
  - `src/scenes/GameOverScene.ts`
  - `src/entities/pickups/PickupTypes.ts`
  - `src/content/events.ts`
  - `src/entities/pickups/PickupEffects.ts`
