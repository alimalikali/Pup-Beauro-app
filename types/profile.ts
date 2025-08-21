export type Profile = {
  id: string
  userId: string
  name: string
  avatar: string | null
  dob: string
  gender: string
  age: number
    city: string
    state: string
    country: string
    
  religion: string
  education: string
  profession: string
  purpose: {
    domain: string
    archetype: string
    modality: string
    narrative: string
  }
  isNew: boolean
  createdAt: string
  interests: string[]
  personality: string
  maritalStatus: string
  lookingFor: string
  language: string
  height: number
  weight: number
  smoke: string
  alcohol: string
  drugs: string
  politics: string[]
  isVerified: boolean
  isDeleted: boolean
  isActive: boolean
}








