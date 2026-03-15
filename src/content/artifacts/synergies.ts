import { PICKUP_IDS } from '../../core/constants'
import type { PickupId } from '../../core/types'

const has = (picked: Set<PickupId>, id: PickupId): boolean => picked.has(id)

export const resolveArtifactSynergy = (pickedArtifacts: PickupId[]): string | null => {
  const picked = new Set(pickedArtifacts)

  if (has(picked, PICKUP_IDS.PUMPKIN_LATTE) && has(picked, PICKUP_IDS.SECOND_MONITOR)) {
    return 'Productivity Combo (+flow)'
  }
  if (has(picked, PICKUP_IDS.STACKOVERFLOW_SCROLL) && has(picked, PICKUP_IDS.NEW_MACBOOK)) {
    return 'Fast But Dangerous Build (+damage -stability)'
  }
  if (has(picked, PICKUP_IDS.VACATION_TICKET) && has(picked, PICKUP_IDS.THERAPY_SESSION)) {
    return 'Burnout Recovery Build (+recovery)'
  }
  if (has(picked, PICKUP_IDS.NOISE_CANCELLING_AIRPODS) && has(picked, PICKUP_IDS.SECOND_MONITOR)) {
    return 'Deep Focus Mode (+focus)'
  }

  return null
}
