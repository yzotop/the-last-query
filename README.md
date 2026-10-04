# The Last Query

A chaotic survival game about a data analyst fighting broken pipelines, meetings, dashboards, and production chaos.

## Play online

[https://yzotop.github.io/the-last-query/](https://yzotop.github.io/the-last-query/)

## Features

- analytics-themed enemies
- artifact pickups and synergies
- events and chaos systems
- Russian meme UI
- lifetime stats

## Controls

- `WASD` — move
- `SPACE` — SELECT
- `ALT+SPACE` — JOIN STORM
- `E` — GROUP EXP
- `X` — DELETE FROM
- `ESC` — pause
- `R` — restart after game over

## Local development

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
```

Build output is generated to `dist/`.

## Deploy

This project is configured for GitHub Pages via GitHub Actions.

- Repo target: `yzotop/the-last-query`
- Public URL: `https://yzotop.github.io/the-last-query/`
- Vite base path: `/the-last-query/`
- Workflow: `.github/workflows/deploy-pages.yml`

## Notes

The game keeps its meme-driven analytics tone: SQL sword combat, chaos events, sarcastic logs, and retro dashboard vibes.

## Восстановление

Постоянный путь: `~/projects/the-last-query/`. Перенесён из `lab/` 3 октября 2026. Восстановить репозиторий `yzotop/the-last-query` и отдельно сохранённые локальные изменения. Установить Node.js и npm, затем выполнить `npm ci` для версий из `package-lock.json`, `npm run build` для проверки и `npm run dev` для запуска. Папка `node_modules/` пересоздаётся. Vite base `/the-last-query/` относится к адресу сайта и при переносе локальной папки не меняется.

Локальная проверка после переноса: Node.js v25.4.0, npm 11.12.1; `npm ci` и сборка прошли. Это проверенная конфигурация этого Mac, не требование строго такой версии.
