import { db } from "@/lib/db"
import { users, purposeProfiles, matches } from "@/lib/db/schema"
import { eq, and, notInArray } from "drizzle-orm"

interface CompatibilityScores {
  overall: number
  domain: number
  archetype: number
  modality: number
  demographics: number
  preferences: number
}

interface MatchCandidate {
  id: string
  name: string
  age: number
  avatar: string | null
  religion: string | null
  education: string | null
  profession: string | null
  city: string | null
  state: string | null
  country: string | null
  purpose: {
    domain: string
    archetype: string
    modality: string
    narrative: string
  }
}

export class MatchingEngine {
  private readonly DOMAIN_WEIGHT = 0.35
  private readonly ARCHETYPE_WEIGHT = 0.25
  private readonly MODALITY_WEIGHT = 0.2
  private readonly DEMOGRAPHICS_WEIGHT = 0.15
  private readonly PREFERENCES_WEIGHT = 0.05

  private readonly RELATED_DOMAINS: Record<string, string[]> = {
    Educational: ["Social Justice", "Political", "Health & Wellness"],
    "Social Justice": ["Educational", "Political", "Environmental"],
    Political: ["Social Justice", "Educational", "Environmental"],
    "Health & Wellness": ["Educational", "Spiritual", "Environmental"],
    Spiritual: ["Health & Wellness", "Educational"],
    Environmental: ["Social Justice", "Health & Wellness", "Political"],
    Technology: ["Educational", "Business", "Innovation"],
    Business: ["Technology", "Finance", "Innovation"],
    Arts: ["Cultural", "Educational", "Creative"],
    Cultural: ["Arts", "Educational", "Social Justice"],
  }

  private readonly COMPLEMENTARY_ARCHETYPES: Record<string, string[]> = {
    Teacher: ["Advocate", "Connector", "Innovator", "Builder"],
    Advocate: ["Teacher", "Strategist", "Connector", "Guardian"],
    Strategist: ["Builder", "Guardian", "Advocate", "Innovator"],
    Builder: ["Strategist", "Innovator", "Guardian", "Teacher"],
    Healer: ["Teacher", "Guardian", "Connector", "Advocate"],
    Connector: ["Teacher", "Advocate", "Healer", "Innovator"],
    Innovator: ["Builder", "Teacher", "Strategist", "Connector"],
    Guardian: ["Healer", "Builder", "Strategist", "Advocate"],
    Leader: ["Strategist", "Guardian", "Builder", "Advocate"],
    Visionary: ["Innovator", "Teacher", "Builder", "Strategist"],
  }

  private readonly COMPLEMENTARY_MODALITIES: Record<string, string[]> = {
    Teaching: ["Researching", "Creating", "Organizing", "Mentoring"],
    Organizing: ["Advocating", "Leading", "Teaching", "Building"],
    Creating: ["Teaching", "Researching", "Building", "Innovating"],
    Healing: ["Teaching", "Leading", "Advocating", "Caring"],
    Advocating: ["Organizing", "Researching", "Healing", "Speaking"],
    Researching: ["Teaching", "Creating", "Advocating", "Analyzing"],
    Building: ["Creating", "Leading", "Organizing", "Developing"],
    Leading: ["Organizing", "Building", "Healing", "Guiding"],
    Mentoring: ["Teaching", "Healing", "Guiding", "Supporting"],
    Innovating: ["Creating", "Researching", "Building", "Experimenting"],
  }

  async findMatches(userId: string, limit = 10): Promise<any[]> {
    try {
      // Get current user with purpose profile
      const currentUser = await this.getCurrentUserWithPurpose(userId)
      if (!currentUser) {
        throw new Error("User not found")
      }

      // Get existing match IDs to exclude
      const existingMatches = await this.getExistingMatchIds(userId)

      // Get potential candidates
      const candidates = await this.getPotentialCandidates(userId, existingMatches)

      // Calculate compatibility scores for each candidate
      const scoredMatches = candidates.map((candidate) => {
        const scores = this.calculateCompatibility(currentUser, candidate)
        return {
          candidate,
          scores,
          narrative: this.generateMatchNarrative(currentUser, candidate, scores),
        }
      })

      // Sort by overall compatibility score and take top matches
      const topMatches = scoredMatches
        .filter((match) => match.scores.overall >= 50) // Minimum compatibility threshold
        .sort((a, b) => b.scores.overall - a.scores.overall)
        .slice(0, limit)

      // Save matches to database
      const savedMatches = await this.saveMatches(userId, topMatches)

      return savedMatches
    } catch (error) {
      console.error("Error in findMatches:", error)
      throw error
    }
  }

  private async getCurrentUserWithPurpose(userId: string) {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        gender: users.gender,
        dob: users.dob,
        religion: users.religion,
        education: users.education,
        profession: users.profession,
        city: users.city,
        state: users.state,
        country: users.country,
        interests: users.interests,
        purpose: {
          domain: purposeProfiles.domain,
          archetype: purposeProfiles.archetype,
          modality: purposeProfiles.modality,
          narrative: purposeProfiles.narrative,
        },
      })
      .from(users)
      .leftJoin(purposeProfiles, eq(users.id, purposeProfiles.userId))
      .where(and(eq(users.id, userId), eq(users.isActive, true), eq(users.isDeleted, false)))
      .limit(1)

    return result[0] || null
  }

  private async getExistingMatchIds(userId: string): Promise<string[]> {
    const existingMatches = await db
      .select({ userBId: matches.userBId })
      .from(matches)
      .where(eq(matches.userAId, userId))

    return existingMatches.map((match) => match.userBId)
  }

  private async getPotentialCandidates(userId: string, excludeIds: string[]): Promise<MatchCandidate[]> {
    const excludeList = [userId, ...excludeIds]

    const candidates = await db
      .select({
        id: users.id,
        name: users.name,
        dob: users.dob,
        avatar: users.avatar,
        religion: users.religion,
        education: users.education,
        profession: users.profession,
        city: users.city,
        state: users.state,
        country: users.country,
        purpose: {
          domain: purposeProfiles.domain,
          archetype: purposeProfiles.archetype,
          modality: purposeProfiles.modality,
          narrative: purposeProfiles.narrative,
        },
      })
      .from(users)
      .leftJoin(purposeProfiles, eq(users.id, purposeProfiles.userId))
      .where(and(notInArray(users.id, excludeList), eq(users.isActive, true), eq(users.isDeleted, false)))
      .limit(100) // Limit to prevent performance issues

    return candidates
      .filter((candidate) => candidate.purpose.domain) // Only users with purpose profiles
      .map((candidate) => ({
        ...candidate,
        age: candidate.dob ? this.calculateAge(candidate.dob) : 0,
      }))
  }

  private calculateCompatibility(user: any, candidate: MatchCandidate): CompatibilityScores {
    const domainScore = this.calculateDomainScore(user.purpose.domain, candidate.purpose.domain)
    const archetypeScore = this.calculateArchetypeScore(user.purpose.archetype, candidate.purpose.archetype)
    const modalityScore = this.calculateModalityScore(user.purpose.modality, candidate.purpose.modality)
    const demographicsScore = this.calculateDemographicsScore(user, candidate)
    const preferencesScore = this.calculatePreferencesScore(user, candidate)

    const overall = Math.round(
      domainScore * this.DOMAIN_WEIGHT +
        archetypeScore * this.ARCHETYPE_WEIGHT +
        modalityScore * this.MODALITY_WEIGHT +
        demographicsScore * this.DEMOGRAPHICS_WEIGHT +
        preferencesScore * this.PREFERENCES_WEIGHT,
    )

    return {
      overall,
      domain: domainScore,
      archetype: archetypeScore,
      modality: modalityScore,
      demographics: demographicsScore,
      preferences: preferencesScore,
    }
  }

  private calculateDomainScore(userDomain: string, candidateDomain: string): number {
    if (userDomain === candidateDomain) return 100
    if (this.RELATED_DOMAINS[userDomain]?.includes(candidateDomain)) return 75
    return 40
  }

  private calculateArchetypeScore(userArchetype: string, candidateArchetype: string): number {
    if (userArchetype === candidateArchetype) return 100
    if (this.COMPLEMENTARY_ARCHETYPES[userArchetype]?.includes(candidateArchetype)) return 85
    return 50
  }

  private calculateModalityScore(userModality: string, candidateModality: string): number {
    if (userModality === candidateModality) return 100
    if (this.COMPLEMENTARY_MODALITIES[userModality]?.includes(candidateModality)) return 80
    return 55
  }

  private calculateDemographicsScore(user: any, candidate: MatchCandidate): number {
    let score = 70 // Base score

    // Religion compatibility
    if (user.religion && candidate.religion) {
      if (user.religion === candidate.religion) score += 20
      else score -= 10
    }

    // Education compatibility
    if (user.education && candidate.education) {
      const educationLevels = ["HIGH_SCHOOL", "DIPLOMA", "BACHELORS", "MASTERS", "PHD"]
      const userLevel = educationLevels.indexOf(user.education)
      const candidateLevel = educationLevels.indexOf(candidate.education)

      if (userLevel !== -1 && candidateLevel !== -1) {
        const diff = Math.abs(userLevel - candidateLevel)
        if (diff === 0) score += 10
        else if (diff === 1) score += 5
        else if (diff > 2) score -= 5
      }
    }

    // Location proximity
    if (user.city && candidate.city) {
      if (user.city === candidate.city) score += 15
      else if (user.state === candidate.state) score += 10
      else if (user.country === candidate.country) score += 5
    }

    return Math.max(0, Math.min(100, score))
  }

  private calculatePreferencesScore(user: any, candidate: MatchCandidate): number {
    let score = 80 // Base score

    // Age compatibility (if we had age preferences)
    const ageDiff = Math.abs(user.age - candidate.age)
    if (ageDiff <= 3) score += 20
    else if (ageDiff <= 5) score += 10
    else if (ageDiff > 10) score -= 10

    return Math.max(0, Math.min(100, score))
  }

  private generateMatchNarrative(user: any, candidate: MatchCandidate, scores: CompatibilityScores): string {
    let narrative = ""

    if (scores.overall >= 85) {
      narrative = `You and ${candidate.name} have exceptional purpose alignment! `
    } else if (scores.overall >= 70) {
      narrative = `You and ${candidate.name} have strong purpose alignment. `
    } else {
      narrative = `You and ${candidate.name} have interesting complementary aspects. `
    }

    // Domain narrative
    if (scores.domain >= 90) {
      narrative += `You both share the same passion for ${user.purpose.domain.toLowerCase()} work. `
    } else if (scores.domain >= 70) {
      narrative += `Your ${user.purpose.domain.toLowerCase()} focus complements their ${candidate.purpose.domain.toLowerCase()} work beautifully. `
    }

    // Archetype narrative
    if (scores.archetype >= 85) {
      narrative += `Your ${user.purpose.archetype.toLowerCase()} approach aligns perfectly with their ${candidate.purpose.archetype.toLowerCase()} style. `
    }

    // Location narrative
    if (user.city === candidate.city) {
      narrative += `You're both based in ${candidate.city}, making it easy to connect in person. `
    } else if (user.state === candidate.state) {
      narrative += `You're both in ${candidate.state}, offering opportunities for regional connections. `
    }

    return narrative.trim()
  }

  private async saveMatches(userId: string, scoredMatches: any[]): Promise<any[]> {
    const matchesToSave = scoredMatches.map((match) => ({
      userAId: userId,
      userBId: match.candidate.id,
      compatibilityScore: match.scores.overall,
      domainScore: match.scores.domain,
      archetypeScore: match.scores.archetype,
      modalityScore: match.scores.modality,
      matchNarrative: match.narrative,
      status: "PENDING" as const,
      isNew: true,
    }))

    await db.insert(matches).values(matchesToSave)

    return scoredMatches.map((match) => ({
      id: match.candidate.id,
      name: match.candidate.name,
      age: match.candidate.age,
      avatar: match.candidate.avatar,
      religion: match.candidate.religion,
      education: match.candidate.education,
      profession: match.candidate.profession,
      location: [match.candidate.city, match.candidate.state, match.candidate.country].filter(Boolean).join(", "),
      purpose: match.candidate.purpose,
      compatibilityScore: match.scores.overall,
      purposeAlignment: {
        domain: match.scores.domain,
        archetype: match.scores.archetype,
        modality: match.scores.modality,
      },
      matchNarrative: match.narrative,
      isNew: true,
    }))
  }

  private calculateAge(dob: string): number {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }
}

export const matchingEngine = new MatchingEngine()
