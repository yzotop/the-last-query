# GAME_DESIGN - THE LAST QUERY

## Core Concept

Top-down arcade survival game with a satire tech theme.  
The player is the "last data analyst" battling waves of automation agents.

## Player

- Character: Data Analyst
- Weapon: Glowing SQL sword
- Base stats:
  - HP: 100
  - Movement speed: fast, responsive
- Input:
  - Move: WASD
  - Attack: SPACE

## Enemy Roster

Implemented as visual and behavioral variants with shared chase logic:

- CI/CD bots
- Orchestrators
- Automation swarms
- Meeting monsters
- Burnout ghosts
- Excel Zombie
- Slack Notifier
- Legacy Monolith
- Therapist boss

## Powerups

- Pumpkin Latte
- New MacBook
- Therapy Session
- StackOverflow Scroll
- Vacation Ticket
- Noise Cancelling AirPods
- Second Monitor

Current MVP behavior:

- `Pumpkin Latte`: +30% movement speed for 8 seconds
- `New MacBook`: +50% sword damage for 10 seconds
- `Therapy Session`: restore 40 HP instantly
- `StackOverflow Scroll`: next sword hit deals massive damage
- `Vacation Ticket`: invulnerability for 3 seconds
- `Noise Cancelling AirPods`: reduced incoming contact damage for 9 seconds
- `Second Monitor`: wider SQL slash radius for 9 seconds

Powerups drop with a simple chance when enemies die and are collected by overlap.

## Gameplay Loop

1. Start in arena.
2. Enemies spawn from screen edges continuously.
3. Player dodges and uses SQL slash to clear enemies.
4. Score rises over time and per enemy kill.
5. If HP reaches 0, Game Over appears with restart prompt.

## UI Behavior (Current)

- In-run UI shows HP, score, survived time, and difficulty tier.
- Active timed buffs are shown with remaining seconds.
- Pickup notifications and floating labels are rendered in UI overlays.
- Artifact panel keeps a persistent per-run list of collected artifacts (with count, rarity accent, and scrollable history).
- Game over screen shows final score, survived time, and restart prompt.
- Boss HP is shown while Therapist Boss is active.
- Title screen introduces premise, controls, and start prompt.
- ESC toggles pause/resume with an in-run pause overlay.
- Game over recap shows run stats (kills, pickups, boss results).

## Meme Events (Current)

Random timed events (one active at a time):

- `DEPLOY_FRIDAY`: CI/CD bot surge and faster spawn pressure.
- `PRODUCTION_INCIDENT`: strong warning with glitch/flash feedback and pressure spike.
- `AGENT_INVASION`: enemies move faster and pressure increases.
- `RETROGRADE_MERCURY`: player movement controls are temporarily reversed.
- `MACBOOK_RAIN`: visual laptop storm and increased pickup chaos.
- `BURNOUT_WEEK`: extra burnout pressure with darker mood.

## Boss Encounter (Current)

- `THERAPIST_BOSS` spawns later in a run (time-gated).
- Boss has high HP, heavy pursuit movement, and contact damage.
- While active, the boss periodically spawns `BURNOUT_GHOST` adds.
- Defeating the boss grants a large score bonus and a guaranteed pickup drop.
- UI announces boss spawn and boss defeat.

## Polish Notes (Phase 9)

- Sword slashes now have clearer arc/trail readability and stronger critical-hit impact.
- Enemy and boss damage uses quick hit flashes and stronger camera feedback.
- Pixel particle bursts are emitted on hits, kills, pickups, and boss defeat.
- Event notifications are more dramatic, and `PRODUCTION_INCIDENT` glitch feel is stronger.
- Light balance tuning keeps the run fair-chaotic:
  - slightly slower base spawn pressure
  - slightly higher pickup drop chance
  - slightly later, cleaner boss pacing

## Visual Style

- Dark datacenter-like background
- Pixel-art sprites generated in code via Phaser Graphics
- No external sprite assets

## Visual Identity (Phase 12)

- Arena now reads as a broken data-center office battlefield with panel grids, racks, warning stripes, dead monitor tiles, and dashboard debris.
- Ambient atmosphere includes monitor flicker, pulsing floor elements, and scanline sweeps.
- Event visuals now have clearer identity overlays and mood shifts (deploy alerts, incident instability, invasion pressure, mercury weirdness, burnout fog, laptop rain).
- Pickups use stronger idle readability (bobbing, pulse, silhouette tinting).
- Therapist boss now has stronger presence (aura, shadow, spawn marker) and clearer contrast from normal enemies.
- UI panels across title, HUD, pause, notifications, and game-over are visually more cohesive.

## Near-Term Extensions

- Add collectible powerups with temporary buffs
- Add enemy-specific behavior patterns (stun, zig-zag, charge)
- Add wave escalation and mini-boss milestones
- Add simple SFX for sword hit and pickup events

## Architecture Direction

The codebase is being incrementally refactored into:

- `core` modules for state/config/events/types
- scene separation for gameplay/UI/game-over flow
- entity-specific modules (player/enemies/pickups/bosses)
- dedicated systems for combat, collisions, spawning, scoring, difficulty, drops, and events
