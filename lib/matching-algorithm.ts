import { db } from "@/lib/db"
import { users, purposeProfiles } from "@/lib/db/schema"
import { eq, ne, and, desc } from "drizzle-orm"
import { Match } from "@/types/match"

// Enhanced purpose compatibility scoring
interface PurposeCompatibility {
  domainScore: number
  archetypeScore: number
  modalityScore: number
  totalScore: number
  narrativeAlignment: number
  overallCompatibility: number
}

// Purpose domain compatibility matrix
const DOMAIN_COMPATIBILITY: Record<string, Record<string, number>> = {
  "PERSONAL_GROWTH": {
    "PERSONAL_GROWTH": 100,
    "EDUCATION": 85,
    "SPIRITUALITY": 80,
    "HEALTHCARE": 75,
    "COMMUNITY": 70,
    "TECHNOLOGY": 65,
    "FINANCE": 60,
    "ARTS": 55,
    "OTHER": 50
  },
  "EDUCATION": {
    "EDUCATION": 100,
    "PERSONAL_GROWTH": 85,
    "TECHNOLOGY": 80,
    "COMMUNITY": 75,
    "HEALTHCARE": 70,
    "SPIRITUALITY": 65,
    "FINANCE": 60,
    "ARTS": 55,
    "OTHER": 50
  },
  "SPIRITUALITY": {
    "SPIRITUALITY": 100,
    "PERSONAL_GROWTH": 85,
    "COMMUNITY": 80,
    "HEALTHCARE": 75,
    "EDUCATION": 70,
    "ARTS": 65,
    "TECHNOLOGY": 60,
    "FINANCE": 55,
    "OTHER": 50
  },
  "HEALTHCARE": {
    "HEALTHCARE": 100,
    "PERSONAL_GROWTH": 80,
    "EDUCATION": 75,
    "COMMUNITY": 70,
    "SPIRITUALITY": 65,
    "TECHNOLOGY": 60,
    "FINANCE": 55,
    "ARTS": 50,
    "OTHER": 45
  },
  "TECHNOLOGY": {
    "TECHNOLOGY": 100,
    "EDUCATION": 80,
    "FINANCE": 75,
    "PERSONAL_GROWTH": 70,
    "COMMUNITY": 65,
    "HEALTHCARE": 60,
    "ARTS": 55,
    "SPIRITUALITY": 50,
    "OTHER": 45
  },
  "FINANCE": {
    "FINANCE": 100,
    "TECHNOLOGY": 75,
    "EDUCATION": 70,
    "PERSONAL_GROWTH": 65,
    "COMMUNITY": 60,
    "HEALTHCARE": 55,
    "ARTS": 50,
    "SPIRITUALITY": 45,
    "OTHER": 40
  },
  "ARTS": {
    "ARTS": 100,
    "SPIRITUALITY": 75,
    "PERSONAL_GROWTH": 70,
    "COMMUNITY": 65,
    "EDUCATION": 60,
    "HEALTHCARE": 55,
    "TECHNOLOGY": 50,
    "FINANCE": 45,
    "OTHER": 40
  },
  "COMMUNITY": {
    "COMMUNITY": 100,
    "SPIRITUALITY": 80,
    "PERSONAL_GROWTH": 75,
    "EDUCATION": 70,
    "HEALTHCARE": 65,
    "ARTS": 60,
    "TECHNOLOGY": 55,
    "FINANCE": 50,
    "OTHER": 45
  }
}

// Archetype compatibility matrix
const ARCHETYPE_COMPATIBILITY: Record<string, Record<string, number>> = {
  "LEADER": {
    "LEADER": 70, // Leaders can work together but might clash
    "FOLLOWER": 90, // Leader + Follower = great synergy
    "SUPPORTER": 85, // Leader + Supporter = excellent
    "PARTNER": 95, // Leader + Partner = ideal
    "INDEPENDENT": 75, // Leader + Independent = good
    "OTHER": 60
  },
  "FOLLOWER": {
    "LEADER": 90, // Follower + Leader = great synergy
    "FOLLOWER": 60, // Two followers might lack direction
    "SUPPORTER": 80, // Follower + Supporter = good
    "PARTNER": 85, // Follower + Partner = very good
    "INDEPENDENT": 70, // Follower + Independent = moderate
    "OTHER": 65
  },
  "SUPPORTER": {
    "LEADER": 85, // Supporter + Leader = excellent
    "FOLLOWER": 80, // Supporter + Follower = good
    "SUPPORTER": 75, // Two supporters = good
    "PARTNER": 90, // Supporter + Partner = excellent
    "INDEPENDENT": 65, // Supporter + Independent = moderate
    "OTHER": 70
  },
  "PARTNER": {
    "LEADER": 95, // Partner + Leader = ideal
    "FOLLOWER": 85, // Partner + Follower = very good
    "SUPPORTER": 90, // Partner + Supporter = excellent
    "PARTNER": 100, // Partner + Partner = perfect
    "INDEPENDENT": 80, // Partner + Independent = very good
    "OTHER": 75
  },
  "INDEPENDENT": {
    "LEADER": 75, // Independent + Leader = good
    "FOLLOWER": 70, // Independent + Follower = moderate
    "SUPPORTER": 65, // Independent + Supporter = moderate
    "PARTNER": 80, // Independent + Partner = very good
    "INDEPENDENT": 85, // Independent + Independent = great
    "OTHER": 70
  }
}

// Modality compatibility matrix
const MODALITY_COMPATIBILITY: Record<string, Record<string, number>> = {
  "ONLINE": {
    "ONLINE": 100, // Both prefer online = perfect
    "OFFLINE": 60, // Online + Offline = moderate
    "HYBRID": 80, // Online + Hybrid = good
    "OTHER": 70
  },
  "OFFLINE": {
    "ONLINE": 60, // Offline + Online = moderate
    "OFFLINE": 100, // Both prefer offline = perfect
    "HYBRID": 80, // Offline + Hybrid = good
    "OTHER": 70
  },
  "HYBRID": {
    "ONLINE": 80, // Hybrid + Online = good
    "OFFLINE": 80, // Hybrid + Offline = good
    "HYBRID": 100, // Both prefer hybrid = perfect
    "OTHER": 85
  }
}

// Calculate enhanced purpose compatibility
function calculatePurposeCompatibility(
  profile1: { domain: string; archetype: string; modality: string; narrative: string },
  profile2: { domain: string; archetype: string; modality: string; narrative: string }
): PurposeCompatibility {
  // Get compatibility scores from matrices
  const domainScore = DOMAIN_COMPATIBILITY[profile1.domain]?.[profile2.domain] || 
                     DOMAIN_COMPATIBILITY[profile2.domain]?.[profile1.domain] || 50
  
  const archetypeScore = ARCHETYPE_COMPATIBILITY[profile1.archetype]?.[profile2.archetype] || 
                         ARCHETYPE_COMPATIBILITY[profile2.archetype]?.[profile1.archetype] || 50
  
  const modalityScore = MODALITY_COMPATIBILITY[profile1.modality]?.[profile2.modality] || 
                        MODALITY_COMPATIBILITY[profile2.modality]?.[profile1.modality] || 50

  // Calculate narrative alignment using keyword matching
  const narrativeAlignment = calculateNarrativeAlignment(profile1.narrative, profile2.narrative)
  
  // Weighted scoring (domain is most important, then archetype, then modality, then narrative)
  const totalScore = Math.round(
    (domainScore * 0.4) + 
    (archetypeScore * 0.3) + 
    (modalityScore * 0.2) + 
    (narrativeAlignment * 0.1)
  )

  return {
    domainScore,
    archetypeScore,
    modalityScore,
    totalScore,
    narrativeAlignment,
    overallCompatibility: totalScore
  }
}

// Calculate narrative alignment using keyword extraction
function calculateNarrativeAlignment(narrative1: string, narrative2: string): number {
  const keywords1 = extractKeywords(narrative1.toLowerCase())
  const keywords2 = extractKeywords(narrative2.toLowerCase())
  
  if (keywords1.length === 0 || keywords2.length === 0) return 50
  
  const commonKeywords = keywords1.filter(keyword => keywords2.includes(keyword))
  const alignmentScore = (commonKeywords.length / Math.max(keywords1.length, keywords2.length)) * 100
  
  return Math.round(alignmentScore)
}

// Extract meaningful keywords from narrative
function extractKeywords(text: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs'])
  
  return text
    .split(/\s+/)
    .map(word => word.replace(/[^\w]/g, ''))
    .filter(word => word.length > 3 && !stopWords.has(word))
    .slice(0, 10) // Limit to top 10 keywords
}

// Generate enhanced match narrative
function generateMatchNarrative(
  user1: { users: any; purpose_profiles: any },
  user2: { users: any; purpose_profiles: any },
  compatibility: PurposeCompatibility
): string {
  const strengthLevel = compatibility.overallCompatibility >= 85 ? "exceptional" : 
                       compatibility.overallCompatibility >= 75 ? "strong" : 
                       compatibility.overallCompatibility >= 65 ? "good" : "promising"
  
  const domainMatch = compatibility.domainScore >= 80 ? "highly aligned" :
                     compatibility.domainScore >= 60 ? "well-aligned" : "differently focused"
  
  const archetypeSynergy = compatibility.archetypeScore >= 80 ? "complementary" :
                           compatibility.archetypeScore >= 60 ? "compatible" : "diverse"
  
  return `${user2.users.name} shares a ${strengthLevel} purpose alignment with you, particularly in the ${domainMatch} domain of ${user1.purpose_profiles?.domain}. Your ${archetypeSynergy} archetypes (${user1.purpose_profiles?.archetype} + ${user2.purpose_profiles?.archetype}) create a dynamic partnership potential. Their background in ${user2.users.profession} brings valuable perspectives that could enhance your work in ${user1.users.profession}. With ${compatibility.overallCompatibility}% overall compatibility, this connection shows strong potential for a purpose-driven relationship.`
}

// Calculate age from date of birth
function calculateAge(dob: string | null): number {
  if (!dob) return 0
  
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

// Main function to calculate matches for a user
export async function calculateMatches(userId: string): Promise<Match[]> {
  try {
  // Get the user and their purpose profile
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .leftJoin(purposeProfiles, eq(users.id, purposeProfiles.userId))

    if (!user || !user.purpose_profiles) {
      throw new Error("User or purpose profile not found")
    }

  // Get all potential matches (excluding the user themselves)
  const potentialMatches = await db
    .select()
    .from(users)
    .where(
      and(
        ne(users.id, userId),
        eq(users.isActive, true),
          eq(users.isVerified, true),
          eq(users.isDeleted, false)
        )
    )
    .leftJoin(purposeProfiles, eq(users.id, purposeProfiles.userId))

  // Filter out matches without purpose profiles
  const validMatches = potentialMatches.filter(match => match.purpose_profiles)

  // Calculate compatibility scores and create match objects
  const calculatedMatches: Match[] = validMatches.map((match) => {
    const compatibility = calculatePurposeCompatibility(
      {
        domain: user.purpose_profiles!.domain,
        archetype: user.purpose_profiles!.archetype,
          modality: user.purpose_profiles!.modality,
          narrative: user.purpose_profiles!.narrative
      },
      {
        domain: match.purpose_profiles!.domain,
        archetype: match.purpose_profiles!.archetype,
          modality: match.purpose_profiles!.modality,
          narrative: match.purpose_profiles!.narrative
      }
    )

    return {
      id: match.users.id,
      userId: match.users.id,
      name: match.users.name,
      avatar: match.users.avatar,
      age: calculateAge(match.users.dob),
      location: {
        city: match.users.city || "",
        state: match.users.state || "",
        country: match.users.country || "",
      },
      religion: match.users.religion || "OTHER",
      education: match.users.education || "OTHER",
      profession: match.users.profession || "OTHER",
      purpose: {
        domain: match.purpose_profiles!.domain,
        archetype: match.purpose_profiles!.archetype,
        modality: match.purpose_profiles!.modality,
        narrative: match.purpose_profiles!.narrative,
      },
        compatibilityScore: compatibility.overallCompatibility,
      domainScore: compatibility.domainScore,
      archetypeScore: compatibility.archetypeScore,
      modalityScore: compatibility.modalityScore,
      matchNarrative: generateMatchNarrative(user, match, compatibility),
      isNew: true, // This could be based on when the match was created
      createdAt: new Date().toISOString(),
      interests: match.users.interests || [],
    }
  })

  // Sort matches by compatibility score
  return calculatedMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore)
  } catch (error) {
    console.error("Error calculating matches:", error)
    throw error
  }
}
