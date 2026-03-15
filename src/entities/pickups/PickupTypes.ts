import { BUFF_DURATIONS } from '../../core/config'
import { ARTIFACT_RARITY, type ArtifactRarity } from '../../content/artifacts/rarity'
import { PICKUP_IDS } from '../../core/constants'
import type { PickupId } from '../../core/types'

export type PickupConfig = {
  id: PickupId
  label: string
  artifactTitle: string
  artifactIcon: string
  artifactDescription: string
  rarity: ArtifactRarity
  texture: string
  durationMs?: number
  magnitude?: number
}

export const PICKUP_TYPE_CONFIGS: Record<PickupId, PickupConfig> = {
  [PICKUP_IDS.PUMPKIN_LATTE]: {
    id: PICKUP_IDS.PUMPKIN_LATTE,
    label: 'Coffee IV',
    artifactTitle: 'Coffee IV',
    artifactIcon: '☕',
    artifactDescription: 'ускоряет запросы',
    rarity: ARTIFACT_RARITY.COMMON,
    texture: 'pickup-pumpkin-latte',
    durationMs: BUFF_DURATIONS.speedBoostMs,
    magnitude: 0.3,
  },
  [PICKUP_IDS.NEW_MACBOOK]: {
    id: PICKUP_IDS.NEW_MACBOOK,
    label: 'Новый MacBook',
    artifactTitle: 'Новый MacBook',
    artifactIcon: '💻',
    artifactDescription: 'SQL урон повышен',
    rarity: ARTIFACT_RARITY.RARE,
    texture: 'pickup-new-macbook',
    durationMs: BUFF_DURATIONS.damageBoostMs,
    magnitude: 0.5,
  },
  [PICKUP_IDS.THERAPY_SESSION]: {
    id: PICKUP_IDS.THERAPY_SESSION,
    label: 'Терапия',
    artifactTitle: 'Терапия',
    artifactIcon: '🛋',
    artifactDescription: 'восстанавливает ресурс',
    rarity: ARTIFACT_RARITY.COMMON,
    texture: 'pickup-therapy-session',
    magnitude: 40,
  },
  [PICKUP_IDS.STACKOVERFLOW_SCROLL]: {
    id: PICKUP_IDS.STACKOVERFLOW_SCROLL,
    label: 'StackOverflow Scroll',
    artifactTitle: 'StackOverflow Scroll',
    artifactIcon: '📜',
    artifactDescription: 'Скопировано production-ready решение',
    rarity: ARTIFACT_RARITY.LEGENDARY,
    texture: 'pickup-stackoverflow-scroll',
    magnitude: 999,
  },
  [PICKUP_IDS.VACATION_TICKET]: {
    id: PICKUP_IDS.VACATION_TICKET,
    label: 'Отпускной билет',
    artifactTitle: 'Отпускной билет',
    artifactIcon: '🎫',
    artifactDescription: 'burnout временно отменен',
    rarity: ARTIFACT_RARITY.EPIC,
    texture: 'pickup-vacation-ticket',
    durationMs: BUFF_DURATIONS.invulnerabilityMs,
  },
  [PICKUP_IDS.NOISE_CANCELLING_AIRPODS]: {
    id: PICKUP_IDS.NOISE_CANCELLING_AIRPODS,
    label: 'Шумодав',
    artifactTitle: 'Шумодав',
    artifactIcon: '🎧',
    artifactDescription: 'созвоны приглушены, урон снижен',
    rarity: ARTIFACT_RARITY.RARE,
    texture: 'pickup-noise-cancelling-airpods',
    durationMs: BUFF_DURATIONS.damageReductionMs,
    magnitude: 0.7,
  },
  [PICKUP_IDS.SECOND_MONITOR]: {
    id: PICKUP_IDS.SECOND_MONITOR,
    label: 'Второй монитор',
    artifactTitle: 'Второй монитор',
    artifactIcon: '📺',
    artifactDescription: 'Производительность x2',
    rarity: ARTIFACT_RARITY.EPIC,
    texture: 'pickup-second-monitor',
    durationMs: BUFF_DURATIONS.slashRadiusBoostMs,
    magnitude: 1.35,
  },
  [PICKUP_IDS.PYTHON_SCRIPT]: {
    id: PICKUP_IDS.PYTHON_SCRIPT,
    label: 'Python Script',
    artifactTitle: 'Python Script',
    artifactIcon: '🐍',
    artifactDescription: 'автоматизирует часть работы',
    rarity: ARTIFACT_RARITY.RARE,
    texture: 'pickup-python-script',
    durationMs: BUFF_DURATIONS.damageBoostMs,
    magnitude: 0.25,
  },
  [PICKUP_IDS.EXCEL_MACRO]: {
    id: PICKUP_IDS.EXCEL_MACRO,
    label: 'Excel Macro',
    artifactTitle: 'Excel Macro',
    artifactIcon: '📊',
    artifactDescription: 'неожиданно работает',
    rarity: ARTIFACT_RARITY.COMMON,
    texture: 'pickup-excel-macro',
    durationMs: BUFF_DURATIONS.speedBoostMs,
    magnitude: 0.15,
  },
  [PICKUP_IDS.JUPYTER_NOTEBOOK]: {
    id: PICKUP_IDS.JUPYTER_NOTEBOOK,
    label: 'Jupyter Notebook',
    artifactTitle: 'Jupyter Notebook',
    artifactIcon: '📒',
    artifactDescription: 'SQL урон увеличен',
    rarity: ARTIFACT_RARITY.EPIC,
    texture: 'pickup-jupyter-notebook',
    durationMs: BUFF_DURATIONS.damageBoostMs,
    magnitude: 0.7,
  },
  [PICKUP_IDS.CHATGPT_PROMPT]: {
    id: PICKUP_IDS.CHATGPT_PROMPT,
    label: 'ChatGPT Prompt',
    artifactTitle: 'Prompt из ChatGPT',
    artifactIcon: '🧠',
    artifactDescription: 'интеллект повышен',
    rarity: ARTIFACT_RARITY.LEGENDARY,
    texture: 'pickup-chatgpt-prompt',
  },
  [PICKUP_IDS.GIT_BLAME]: {
    id: PICKUP_IDS.GIT_BLAME,
    label: 'Git Blame',
    artifactTitle: 'Git Blame',
    artifactIcon: '🕵',
    artifactDescription: 'обнаружен виновник',
    rarity: ARTIFACT_RARITY.RARE,
    texture: 'pickup-git-blame',
    durationMs: BUFF_DURATIONS.damageReductionMs,
    magnitude: 0.6,
  },
  [PICKUP_IDS.DUCKDUCKGO_QUERY]: {
    id: PICKUP_IDS.DUCKDUCKGO_QUERY,
    label: 'DuckDuckGo Query',
    artifactTitle: 'DuckDuckGo Query',
    artifactIcon: '🦆',
    artifactDescription: 'поиск альтернативного решения',
    rarity: ARTIFACT_RARITY.COMMON,
    texture: 'pickup-duckduckgo-query',
    magnitude: 18,
  },
  [PICKUP_IDS.POWERPOINT_DECK]: {
    id: PICKUP_IDS.POWERPOINT_DECK,
    label: 'PowerPoint Deck',
    artifactTitle: 'PowerPoint Deck',
    artifactIcon: '📈',
    artifactDescription: 'CEO временно доволен',
    rarity: ARTIFACT_RARITY.EPIC,
    texture: 'pickup-powerpoint-deck',
    durationMs: 2200,
  },
}

export const PICKUP_DROP_POOL: PickupId[] = [
  PICKUP_IDS.PUMPKIN_LATTE,
  PICKUP_IDS.NEW_MACBOOK,
  PICKUP_IDS.THERAPY_SESSION,
  PICKUP_IDS.STACKOVERFLOW_SCROLL,
  PICKUP_IDS.VACATION_TICKET,
  PICKUP_IDS.NOISE_CANCELLING_AIRPODS,
  PICKUP_IDS.SECOND_MONITOR,
  PICKUP_IDS.PYTHON_SCRIPT,
  PICKUP_IDS.EXCEL_MACRO,
  PICKUP_IDS.JUPYTER_NOTEBOOK,
  PICKUP_IDS.CHATGPT_PROMPT,
  PICKUP_IDS.GIT_BLAME,
  PICKUP_IDS.DUCKDUCKGO_QUERY,
  PICKUP_IDS.POWERPOINT_DECK,
]
