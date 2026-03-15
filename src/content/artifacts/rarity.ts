export const ARTIFACT_RARITY = {
  COMMON: 'COMMON',
  RARE: 'RARE',
  EPIC: 'EPIC',
  LEGENDARY: 'LEGENDARY',
} as const

export type ArtifactRarity = (typeof ARTIFACT_RARITY)[keyof typeof ARTIFACT_RARITY]

export const ARTIFACT_RARITY_COLOR: Record<ArtifactRarity, string> = {
  [ARTIFACT_RARITY.COMMON]: '#9aa3b2',
  [ARTIFACT_RARITY.RARE]: '#6db3ff',
  [ARTIFACT_RARITY.EPIC]: '#be86ff',
  [ARTIFACT_RARITY.LEGENDARY]: '#ffd36d',
}

export const ARTIFACT_RARITY_LABEL: Record<ArtifactRarity, string> = {
  [ARTIFACT_RARITY.COMMON]: 'COMMON',
  [ARTIFACT_RARITY.RARE]: 'RARE',
  [ARTIFACT_RARITY.EPIC]: 'EPIC',
  [ARTIFACT_RARITY.LEGENDARY]: 'LEGENDARY',
}
