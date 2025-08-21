export type Match = {
  id: string
  userId: string
  name: string
  avatar: string | null
  age: number
  location: {
    city: string
    state: string
    country: string
  }
  religion: string
  education: string
  profession: string
  purpose: {
    domain: string
    archetype: string
    modality: string
    narrative: string
  }
  compatibilityScore: number
  domainScore: number
  archetypeScore: number
  modalityScore: number
  matchNarrative: string
  isNew: boolean
  createdAt: string
  interests: string[]
}
