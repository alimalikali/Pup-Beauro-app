import { useCurrentUserProfile } from "./use-queries"

// Define weights for different sections
const WEIGHTS = {
  BASIC_INFO: 0.3,      // 30% weight for basic information
  PERSONAL_INFO: 0.3,   // 30% weight for personal details
  PREFERENCES: 0.2,     // 20% weight for preferences
  PURPOSE: 0.2,         // 20% weight for purpose profile
}

// Fields required for each section
const REQUIRED_FIELDS = {
  BASIC_INFO: ['name', 'email', 'gender', 'dob', 'avatar'],
  PERSONAL_INFO: ['religion', 'education', 'profession', 'personality', 'country', 'state', 'city', 'maritalStatus', 'height', 'weight', 'language'],
  PREFERENCES: ['lookingFor', 'interests', 'alcohol', 'drugs', 'smoking', 'politics'],
  PURPOSE: ['domain', 'archetype', 'modality', 'narrative']
}

export function useProfileCompletion() {
  const { data: profileData, isLoading } = useCurrentUserProfile()

  const calculateSectionCompletion = (section: keyof typeof REQUIRED_FIELDS) => {
    if (!profileData?.user) return 0

    const fields = REQUIRED_FIELDS[section]
    const filledFields = fields.filter(field => {
      const value = profileData.user[field as keyof typeof profileData.user]
      
      // Special handling for arrays and purpose fields
      if (Array.isArray(value)) {
        return value.length > 0
      }
      
      // Check for string fields
      if (typeof value === 'string') {
        return value.trim() !== ''
      }
      
      // Check for numbers
      if (typeof value === 'number') {
        return true
      }
      
      // Check for dates
      if (value instanceof Date) {
        return true
      }
      
      return value !== undefined && value !== null
    })

    return (filledFields.length / fields.length) * 100
  }

  const calculateOverallCompletion = () => {
    if (!profileData?.user) return 0

    const basicInfoScore = calculateSectionCompletion('BASIC_INFO') * WEIGHTS.BASIC_INFO
    const personalInfoScore = calculateSectionCompletion('PERSONAL_INFO') * WEIGHTS.PERSONAL_INFO
    const preferencesScore = calculateSectionCompletion('PREFERENCES') * WEIGHTS.PREFERENCES
    const purposeScore = calculateSectionCompletion('PURPOSE') * WEIGHTS.PURPOSE

    return Math.round(basicInfoScore + personalInfoScore + preferencesScore + purposeScore)
  }

  const getMissingSections = () => {
    if (!profileData?.user) return []

    const missingSections: { section: string; fields: string[] }[] = []

    Object.entries(REQUIRED_FIELDS).forEach(([section, fields]) => {
      const missingFields = fields.filter(field => {
        const value = profileData.user[field as keyof typeof profileData.user]
        return value === undefined || value === null || value === '' || 
          (Array.isArray(value) && value.length === 0)
      })

      if (missingFields.length > 0) {
        missingSections.push({
          section,
          fields: missingFields
        })
      }
    })

    return missingSections
  }

  return {
    completion: calculateOverallCompletion(),
    sections: {
      basicInfo: calculateSectionCompletion('BASIC_INFO'),
      personalInfo: calculateSectionCompletion('PERSONAL_INFO'),
      preferences: calculateSectionCompletion('PREFERENCES'),
      purpose: calculateSectionCompletion('PURPOSE')
    },
    missingSections: getMissingSections(),
    isLoading
  }
} 