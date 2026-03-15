import { PICKUP_IDS } from '../../core/constants'
import type { PickupId } from '../../core/types'

const has = (picked: Set<PickupId>, id: PickupId): boolean => picked.has(id)

export const resolveBuildIdentity = (pickedArtifacts: PickupId[]): string => {
  const picked = new Set(pickedArtifacts)

  if (has(picked, PICKUP_IDS.PUMPKIN_LATTE) && has(picked, PICKUP_IDS.SECOND_MONITOR)) {
    return 'Coffee IV + Second Monitor = Productivity Combo'
  }
  if (has(picked, PICKUP_IDS.STACKOVERFLOW_SCROLL) && has(picked, PICKUP_IDS.NEW_MACBOOK)) {
    return 'StackOverflow Scroll + New MacBook = Fast But Dangerous Build'
  }
  if (has(picked, PICKUP_IDS.VACATION_TICKET) && has(picked, PICKUP_IDS.THERAPY_SESSION)) {
    return 'Vacation Ticket + Therapy Session = Burnout Recovery Build'
  }
  if (has(picked, PICKUP_IDS.NOISE_CANCELLING_AIRPODS) && has(picked, PICKUP_IDS.SECOND_MONITOR)) {
    return 'Noise Cancelling AirPods + Second Monitor = Deep Focus Mode'
  }

  return 'SQL Sword Core = Last Analyst Survival Build'
}
