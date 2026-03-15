const STORAGE_KEY = 'the-last-query:lifetime-stats:v1'

export type LifetimeStats = {
  totalRuns: number
  longestSurvivalMs: number
  bestScore: number
  totalArtifactsCollected: number
  bossesDefeated: number
  incidentsSurvived: number
}

type RunRecord = {
  score: number
  elapsedMs: number
  pickupsCollected: number
  bossesDefeated: number
  incidentsSurvived: number
}

const DEFAULT_STATS: LifetimeStats = {
  totalRuns: 0,
  longestSurvivalMs: 0,
  bestScore: 0,
  totalArtifactsCollected: 0,
  bossesDefeated: 0,
  incidentsSurvived: 0,
}

const canUseStorage = (): boolean => typeof window !== 'undefined' && !!window.localStorage

export const readLifetimeStats = (): LifetimeStats => {
  if (!canUseStorage()) {
    return { ...DEFAULT_STATS }
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { ...DEFAULT_STATS }
    }
    const parsed = JSON.parse(raw) as Partial<LifetimeStats>
    return {
      totalRuns: Math.max(0, Math.floor(parsed.totalRuns ?? 0)),
      longestSurvivalMs: Math.max(0, Math.floor(parsed.longestSurvivalMs ?? 0)),
      bestScore: Math.max(0, Math.floor(parsed.bestScore ?? 0)),
      totalArtifactsCollected: Math.max(0, Math.floor(parsed.totalArtifactsCollected ?? 0)),
      bossesDefeated: Math.max(0, Math.floor(parsed.bossesDefeated ?? 0)),
      incidentsSurvived: Math.max(0, Math.floor(parsed.incidentsSurvived ?? 0)),
    }
  } catch {
    return { ...DEFAULT_STATS }
  }
}

const writeLifetimeStats = (stats: LifetimeStats): void => {
  if (!canUseStorage()) {
    return
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // Ignore storage write failures for private mode/quota limits.
  }
}

export const recordLifetimeRun = (record: RunRecord): LifetimeStats => {
  const current = readLifetimeStats()
  const next: LifetimeStats = {
    totalRuns: current.totalRuns + 1,
    longestSurvivalMs: Math.max(current.longestSurvivalMs, record.elapsedMs),
    bestScore: Math.max(current.bestScore, record.score),
    totalArtifactsCollected: current.totalArtifactsCollected + Math.max(0, record.pickupsCollected),
    bossesDefeated: current.bossesDefeated + Math.max(0, record.bossesDefeated),
    incidentsSurvived: current.incidentsSurvived + Math.max(0, record.incidentsSurvived),
  }
  writeLifetimeStats(next)
  return next
}
