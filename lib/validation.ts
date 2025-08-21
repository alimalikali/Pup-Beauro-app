import { z } from "zod"

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),
  phone: z.string().optional(),
})

// User profile schema
export const userProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  dob: z.string().optional(),
  avatar: z.string().optional(),
  religion: z
    .enum([
      "ISLAM",
      "CHRISTIANITY",
      "HINDUISM",
      "BUDDHISM",
      "JUDAISM",
      "SIKHISM",
      "JAINISM",
      "BAHAI",
      "ZOROASTRIANISM",
      "SHINTO",
      "TAOISM",
      "AGNOSTIC",
      "ATHEIST",
      "SPIRITUAL_BUT_NOT_RELIGIOUS",
      "PAGAN",
      "INDIGENOUS",
      "OTHER",
    ])
    .optional(),
  education: z
    .enum([
      "NO_FORMAL_EDUCATION",
      "PRIMARY",
      "SECONDARY",
      "HIGH_SCHOOL",
      "DIPLOMA",
      "ASSOCIATE",
      "BACHELORS",
      "MASTERS",
      "MBA",
      "PHD",
      "POSTDOC",
      "VOCATIONAL",
      "SELF_TAUGHT",
      "BOOTCAMP",
      "OTHER",
    ])
    .optional(),
  profession: z
    .enum([
      "ENGINEERING",
      "SOFTWARE_DEVELOPMENT",
      "DATA_SCIENCE",
      "ARTIFICIAL_INTELLIGENCE",
      "MEDICINE",
      "DENTISTRY",
      "NURSING",
      "EDUCATION",
      "BUSINESS",
      "ENTREPRENEUR",
      "FINANCE",
      "MARKETING",
      "SALES",
      "LAW",
      "GOVERNMENT",
      "PUBLIC_SERVICE",
      "DESIGN",
      "WRITING",
      "JOURNALISM",
      "ARTS",
      "FILM",
      "MUSIC",
      "SPORTS",
      "AGRICULTURE",
      "ARCHITECTURE",
      "PSYCHOLOGY",
      "SOCIAL_WORK",
      "FREELANCER",
      "STUDENT",
      "UNEMPLOYED",
      "HOMEMAKER",
      "OTHER",
    ])
    .optional(),
  personality: z.enum(["INTROVERT", "EXTROVERT", "AMBIVERENT", "OTHER"]).optional(),
  country: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional(),
  lookingFor: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional(),
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  motherTounge: z.string().max(50).optional(),
  interests: z.array(z.string()).optional(),
  alcohol: z.enum(["NONE", "OCCASIONAL", "REGULAR", "SOCIAL", "TRYING_TO_QUIT", "OPEN"]).optional(),
  drugs: z.enum(["NONE", "OCCASIONAL", "REGULAR", "SOCIAL", "TRYING_TO_QUIT", "OPEN"]).optional(),
  smoking: z.enum(["NONE", "OCCASIONAL", "REGULAR", "SOCIAL", "TRYING_TO_QUIT", "OPEN"]).optional(),
  politics: z.array(z.string()).optional(),
})

// Purpose profile schema
export const purposeProfileSchema = z.object({
  domain: z.enum([
    "PERSONAL_GROWTH", "SELF_DISCOVERY", "EMOTIONAL_WELLBEING", "MINDFULNESS", "SPIRITUAL_ENLIGHTENMENT",
    "MARRIAGE", "FAMILY", "PARENTING", "COMPANIONSHIP", "FRIENDSHIP", "ROMANTIC_RELATIONSHIPS",
    "PHYSICAL_HEALTH", "MENTAL_HEALTH", "FITNESS", "NUTRITION", "WELLNESS", "YOGA", "MEDITATION",
    "RELIGIOUS_DEVOTION", "SPIRITUAL_GROWTH", "FAITH_EXPLORATION", "MEDITATIVE_PRACTICES", "RELIGIOUS_COMMUNITY",
    "ACADEMIC_ACHIEVEMENT", "LIFELONG_LEARNING", "LANGUAGE_LEARNING", "PERSONAL_EDUCATION",
    "SOCIAL_JUSTICE", "POLITICAL_ACTIVISM", "ENVIRONMENTAL_SUSTAINABILITY", "CHARITY_WORK", "VOLUNTEERING", "HUMAN_RIGHTS", "COMMUNITY_BUILDING",
    "PROFESSIONAL_NETWORKING", "CAREER_ADVANCEMENT", "SKILL_DEVELOPMENT", "MENTORSHIP", "LEADERSHIP_DEVELOPMENT",
    "FINANCIAL_INDEPENDENCE", "WEALTH_CREATION", "INVESTING", "PERSONAL_FINANCE", "ECONOMIC_EMPOWERMENT",
    "ARTISTIC_EXPRESSION", "MUSIC_CREATION", "WRITING", "PHOTOGRAPHY", "PAINTING", "SCULPTURE", "DESIGN",
    "TRAVEL", "CULTURAL_EXPLORATION", "EXPATRIATE_LIVING", "ADVENTURE_TRAVEL",
    "TECHNOLOGY_INNOVATION", "AI_RESEARCH", "DIGITAL_CREATION", "SOFTWARE_DEVELOPMENT", "TECH_STARTUPS",
    "PHILOSOPHICAL_EXPLORATION", "ETHICS", "MORALITY", "LOGIC_AND_RATIONALE",
    "SUSTAINABLE_LIVING", "MINIMALISM", "FASHION", "HOME_IMPROVEMENT", "GARDENING",
    "LEGAL_REFORM", "JUDICIAL_REFORM", "CIVIL_LIBERTIES", "HUMAN_RIGHTS_LAW",
    "PERSONAL_EXPLORATION", "CURIOSITY", "INNOVATION", "CREATIVE_THINKING", "EXPERIMENTATION"
  ]),
  archetype: z.enum([
    "LEADER", "FOLLOWER", "SUPPORTER", "PARTNER", "ROMANTIC", "CONFIDANT", "COMPANION",
    "MENTOR", "INNOVATOR", "EXPERT", "ADVISOR", "ENTREPRENEUR", "PROFESSIONAL", "TEAM_PLAYER", "VISIONARY",
    "GURU", "SCHOLAR", "PHILANTHROPIST", "ACTIVIST", "COMMUNITY_LEADER", "ADVOCATE",
    "ARTIST", "CREATOR", "PERFORMER", "WRITER", "DESIGNER",
    "SPIRITUAL_GUIDE", "PHILOSOPHER", "THEOLOGIAN", "HEALER",
    "EXPLORER", "SEEKER", "STUDENT", "ADVENTURER", "NURTURER", "CARETAKER", "OPTIMIST", "REALIST",
    "SELF_DISCOVERER", "MYSTIC", "LEARNER"
  ]),
  modality: z.enum([
    "ONLINE", "OFFLINE", "VIRTUAL", "COLLABORATIVE", "TEXT_BASED", "ONE_ON_ONE",
    "WORKSHOPS", "CONFERENCES", "MEETUPS", "SOCIAL_MEDIA", "FORUMS", "BLOGS"
  ]),
  narrative: z.string().min(10),
})

// Backward-compatible export name used by some routes
export const purposeSchema = purposeProfileSchema
