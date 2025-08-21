// TEMPORARY CHANGE TO FORCE MIGRATION
import { relations } from "drizzle-orm"
import { boolean, date, integer, pgTable, real, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { pgEnum } from "drizzle-orm/pg-core"

export const genderEnum = pgEnum("gender", ["MALE", "FEMALE", "OTHER"])
export const maritalStatusEnum = pgEnum("marital_status", ["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"])
export const substanceUsageEnum = pgEnum("substance_usage", [
  "NONE",
  "OCCASIONAL",
  "REGULAR",
  "SOCIAL",
  "TRYING_TO_QUIT",
  "OPEN",
])
export const politicalViewEnum = pgEnum("political_view", [
  "LIBERAL",
  "CONSERVATIVE",
  "CENTRIST",
  "LIBERTARIAN",
  "SOCIALIST",
  "PROGRESSIVE",
  "NATIONALIST",
  "APOLITICAL",
  "FUNDAMENTALIST",
  "OTHER",
])
export const roleEnum = pgEnum("role", ["USER", "ADMIN"])
export const matchStatusEnum = pgEnum("match_status", ["PENDING", "LIKED", "REJECTED", "ACCEPTED"])
export const religionEnum = pgEnum("religion", [
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
export const educationLevelEnum = pgEnum("education_level", [
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
export const professionFieldEnum = pgEnum("profession_field", [
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
export const personalityTypeEnum = pgEnum("personality_type", ["INTROVERT", "EXTROVERT", "AMBIVERENT", "OTHER"])
export const subscriptionStatusEnum = pgEnum("subscription_status", ["ACTIVE", "EXPIRED", "CANCELLED"])


export const languageEnum = pgEnum("language", [
  "ENGLISH",        // Widely spoken globally
  "URDU",           // Pakistan, parts of India
  "HINDI",          // India
  "PUNJABI",        // India, Pakistan
  "TAMIL",          // Sri Lanka, India
  "TELUGU",         // India
  "KANNADA",        // India
  "MARATHI",        // India
  "GUJARATI",       // India
  "ODIA",           // India
  "TURKISH",        // Turkey
  "ARABIC",         // Middle East, North Africa
  "RUSSIAN",        // Russia (partly Muslim-majority areas)
  "POLISH",         // Poland (small Muslim minority)
  "CROATIAN",       // Croatia (small Muslim minority)
  "BULGARIAN",      // Bulgaria (small Muslim minority)
  "ROMANIAN",       // Romania (small Muslim minority)
  "BOSNIAN",        // Bosnia and Herzegovina
  "SERBIAN",        // Serbia (small Muslim minority)
  "PERSIAN",        // Iran
  "PASHTO",         // Afghanistan, Pakistan
  "KURDISH",        // Iraq, Turkey, Syria, Iran
  "AZERBAIJANI",    // Azerbaijan
  "MALAY",          // Malaysia, Brunei
  "INDONESIAN",     // Indonesia
  "SWAHILI",        // Tanzania, Kenya (East Africa)
  "KASHMIRI",       // India, Pakistan (Kashmir region)
  "URDU_HINDI",     // Urdu/Hindi (Same language family, spoken in Pakistan & India)
  "MALAYALAM",      // India (Kerala)
  "ALBANIAN",       // Albania
  "UZBEK",          // Uzbekistan
  "TURKMEN",        // Turkmenistan
  "KAZAKH",         // Kazakhstan
  "CHECHEN",        // Russia (Chechnya)
  "Hausa",          // Nigeria, Niger, Chad, and other parts of West Africa
  "BENGALI",  // India (West Bengal, parts of Assam)
  "SOMALI",         // Somalia
  "MOROCCAN",// Morocco
  "TUNISIAN",// Tunisia
  "OTHER",
]);

export const domainEnum = pgEnum("domain", [
  // Personal Development
  "PERSONAL_GROWTH",
  "SELF_DISCOVERY",
  "EMOTIONAL_WELLBEING",
  "MINDFULNESS",
  "SPIRITUAL_ENLIGHTENMENT",
  
  // Relationships and Family
  "MARRIAGE",
  "FAMILY",
  "PARENTING",
  "COMPANIONSHIP",
  "FRIENDSHIP",
  "ROMANTIC_RELATIONSHIPS",
  
  // Health and Well-being
  "PHYSICAL_HEALTH",
  "MENTAL_HEALTH",
  "FITNESS",
  "NUTRITION",
  "WELLNESS",
  "YOGA",
  "MEDITATION",
  
  // Spirituality and Faith
  "RELIGIOUS_DEVOTION",
  "SPIRITUAL_GROWTH",
  "FAITH_EXPLORATION",
  "MEDITATIVE_PRACTICES",
  "RELIGIOUS_COMMUNITY",
  
  // Education and Learning
  "ACADEMIC_ACHIEVEMENT",
  "LIFELONG_LEARNING",
  "LANGUAGE_LEARNING",
  "PERSONAL_EDUCATION",
  
  // Community and Social Impact
  "SOCIAL_JUSTICE",
  "POLITICAL_ACTIVISM",
  "ENVIRONMENTAL_SUSTAINABILITY",
  "CHARITY_WORK",
  "VOLUNTEERING",
  "HUMAN_RIGHTS",
  "COMMUNITY_BUILDING",
  
  // Career and Professional Development
  "PROFESSIONAL_NETWORKING",
  "CAREER_ADVANCEMENT",
  "SKILL_DEVELOPMENT",
  "MENTORSHIP",
  "LEADERSHIP_DEVELOPMENT",
  
  // Financial Growth and Stability
  "FINANCIAL_INDEPENDENCE",
  "WEALTH_CREATION",
  "INVESTING",
  "PERSONAL_FINANCE",
  "ECONOMIC_EMPOWERMENT",
  
  // Creative and Artistic Pursuits
  "ARTISTIC_EXPRESSION",
  "MUSIC_CREATION",
  "WRITING",
  "PHOTOGRAPHY",
  "PAINTING",
  "SCULPTURE",
  "DESIGN",
  
  // Travel and Exploration
  "TRAVEL",
  "CULTURAL_EXPLORATION",
  "EXPATRIATE_LIVING",
  "ADVENTURE_TRAVEL",
  
  // Technology and Innovation
  "TECHNOLOGY_INNOVATION",
  "AI_RESEARCH",
  "DIGITAL_CREATION",
  "SOFTWARE_DEVELOPMENT",
  "TECH_STARTUPS",
  
  // Philosophy and Intellectual Pursuits
  "PHILOSOPHICAL_EXPLORATION",
  "ETHICS",
  "MORALITY",
  "LOGIC_AND_RATIONALE",
  
  // Lifestyle and Environment
  "SUSTAINABLE_LIVING",
  "MINIMALISM",
  "FASHION",
  "HOME_IMPROVEMENT",
  "GARDENING",
  
  // Legal and Justice
  "LEGAL_REFORM",
  "JUDICIAL_REFORM",
  "CIVIL_LIBERTIES",
  "HUMAN_RIGHTS_LAW",
  
  // Miscellaneous and Curiosity
  "PERSONAL_EXPLORATION",
  "CURIOSITY",
  "INNOVATION",
  "CREATIVE_THINKING",
  "EXPERIMENTATION",
]);
export const archetypeEnum = pgEnum("archetype", [
  // Personal Relationships Archetypes
  "LEADER",              // A person who takes charge and leads the relationship or group.
  "FOLLOWER",            // A person who prefers to follow or learn from others in the relationship.
  "SUPPORTER",           // A person who provides support and helps others in relationships.
  "PARTNER",             // A person seeking a balanced, equal role in the relationship.
  "ROMANTIC",            // A person seeking romantic connection, love, and emotional intimacy.
  "CONFIDANT",           // A trusted individual who provides a safe space for others to confide in.
  "COMPANION",           // A person who values companionship and shared activities.

  // Professional and Career Archetypes
  "MENTOR",              // A person offering guidance and mentorship to others.
  "INNOVATOR",           // A person who seeks to create new ideas or bring innovation.
  "EXPERT",              // A person who has deep knowledge and expertise in a specific field.
  "ADVISOR",             // A person offering counsel and advice based on experience and knowledge.
  "ENTREPRENEUR",        // A person who seeks to start new ventures or businesses.
  "PROFESSIONAL",        // A person who maintains a career-focused approach and seeks professional growth.
  "TEAM_PLAYER",         // A person who values collaboration and works well in group settings.
  "VISIONARY",           // A person who looks ahead and focuses on future goals and innovations.
  
  // Leadership and Social Archetypes
  "GURU",                // A spiritual or philosophical guide.
  "SCHOLAR",             // A person deeply involved in learning and intellectual pursuits.
  "PHILANTHROPIST",      // A person focused on giving back to society and helping others.
  "ACTIVIST",            // A person who seeks to bring about change or engage in political or social causes.
  "COMMUNITY_LEADER",    // A person who organizes and leads communities or groups for a common goal.
  "ADVOCATE",            // A person who actively supports or defends a cause or group.
  
  // Creative and Artistic Archetypes
  "ARTIST",              // A person deeply involved in creative expression through art, music, or other mediums.
  "CREATOR",             // A person who brings ideas into existence, whether through writing, design, or invention.
  "PERFORMER",           // A person who expresses themselves through performance, such as acting or music.
  "WRITER",              // A person who communicates through written works, whether for creative or professional purposes.
  "DESIGNER",            // A person focused on designing solutions, products, or experiences.
  
  // Spiritual and Ideological Archetypes
  "SPIRITUAL_GUIDE",     // A person who helps others on their spiritual or religious journey.
  "PHILOSOPHER",         // A person who seeks to understand life, ethics, and the human condition.
  "THEOLOGIAN",          // A person who studies and interprets religious doctrines and beliefs.
  "HEALER",              // A person focused on healing others, whether emotionally, physically, or spiritually.
  
  // General Life Archetypes
  "EXPLORER",            // A person seeking adventure, new experiences, and discovery.
  "SEEKER",              // A person searching for purpose, meaning, or understanding in life.
  "STUDENT",             // A person who is focused on learning and personal development.
  "ADVENTURER",          // A person who seeks challenges and new adventures.
  "NURTURER",            // A person who provides care and nurtures others in their environment.
  "CARETAKER",           // A person who looks after others, providing physical, emotional, or mental care.
  "OPTIMIST",            // A person who focuses on positivity, solutions, and opportunities.
  "REALIST",             // A person grounded in practical considerations and sees things as they are.

  // Miscellaneous Archetypes
  "SELF_DISCOVERER",     // A person engaged in personal self-exploration and self-awareness.
  "MYSTIC",              // A person seeking deeper, often spiritual, meanings and connections.
  "LEARNER",             // A person who is focused on continual education and skill acquisition.
]);

export const modalityEnum = pgEnum("modality", [
  // Interaction Methods
  "ONLINE",              // Interaction occurs entirely through online platforms (video calls, chats, etc.)
  "OFFLINE",             // Interaction happens in person, face-to-face.
  "VIRTUAL",             // Virtual interactions, often involving simulations, VR/AR, or online spaces.
  "COLLABORATIVE",       // Working together in a shared virtual or physical space.
  
  // Communication Style
  "TEXT_BASED",          // Communication through text messaging or email, without video or voice.
  "ONE_ON_ONE",          // Prefers private, one-on-one conversations for focused communication.
  
  // Event Formats
  "WORKSHOPS",           // Prefers participation in workshops, seminars, or structured learning events.
  "CONFERENCES",         // Prefers larger-scale virtual or physical conferences or webinars.
  "MEETUPS",              // Casual or informal gatherings, either online or in-person.
  
  // Social and Personal Engagement
  "SOCIAL_MEDIA",        // Prefers interaction through social media platforms (Facebook, Twitter, etc.).
  "FORUMS",              // Engaging through online forums or community platforms like Reddit or Quora.
  "BLOGS",               // Prefers writing or reading blogs for discussion and engagement.
]);
// Tables
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  role: roleEnum("role").default("USER").notNull(),

  gender: genderEnum("gender"),
  dob: date("dob"),
  avatar: text("avatar"),
  religion: religionEnum("religion"),
  education: educationLevelEnum("education"),
  profession: professionFieldEnum("profession"),

  personality: personalityTypeEnum("personality"),
  
  // Location fields
  country: varchar("country", { length: 100 }), // Full country name
  countryCode: varchar("country_code", { length: 2 }), // ISO country code
  state: varchar("state", { length: 100 }), // Full state/province name
  stateCode: varchar("state_code", { length: 10 }), // State/province code
  city: varchar("city", { length: 100 }), // City name

  maritalStatus: maritalStatusEnum("marital_status"),
  lookingFor: maritalStatusEnum("looking_for"),

  height: integer("height"),
  weight: integer("weight"),
  language: languageEnum("language"),

  interests: text("interests").array(),
  alcohol: substanceUsageEnum("alcohol"),
  drugs: substanceUsageEnum("drugs"),
  smoking: substanceUsageEnum("smoking"),
  politics: text("politics").array(),

  isVerified: boolean("is_verified").default(false),
  isDeleted: boolean("is_deleted").default(false),
  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const purposeProfiles = pgTable("purpose_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  domain: domainEnum("domain").notNull(),
  archetype: archetypeEnum("archetype").notNull(),
  modality: modalityEnum("modality").notNull(),
  narrative: text("narrative").notNull(),
})

export const matches = pgTable("matches", {
  id: uuid("id").defaultRandom().primaryKey(),
  userAId: uuid("user_a_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  userBId: uuid("user_b_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  compatibilityScore: real("compatibility_score").notNull(),
  domainScore: real("domain_score").notNull(),
  archetypeScore: real("archetype_score").notNull(),
  modalityScore: real("modality_score").notNull(),

  matchNarrative: text("match_narrative").notNull(),

  status: matchStatusEnum("status").default("PENDING").notNull(),

  isNew: boolean("is_new").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const matchLogs = pgTable("match_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  matchId: uuid("match_id")
    .notNull()
    .references(() => matches.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  feedback: text("feedback").notNull(),
  isAccepted: boolean("is_accepted").default(false),

  createdAt: timestamp("created_at").defaultNow(),
})

export const subscriptionPlans = pgTable("subscription_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  price: real("price").notNull(),
  duration: integer("duration").notNull(), // in days
  perks: text("perks").array(),
  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const userSubscriptions = pgTable("user_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  planId: uuid("plan_id")
    .notNull()
    .references(() => subscriptionPlans.id, { onDelete: "cascade" }),

  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: subscriptionStatusEnum("status").default("ACTIVE").notNull(),

  paymentId: varchar("payment_id", { length: 255 }),
  paymentMethod: varchar("payment_method", { length: 50 }),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  purposeProfile: one(purposeProfiles, {
    fields: [users.id],
    references: [purposeProfiles.userId],
  }),
  matchesAsUserA: many(matches, { relationName: "userA" }),
  matchesAsUserB: many(matches, { relationName: "userB" }),
  subscriptions: many(userSubscriptions, { relationName: "user" }),
  matchLogs: many(matchLogs, { relationName: "user" }),
}))

export const purposeProfilesRelations = relations(purposeProfiles, ({ one }) => ({
  user: one(users, {
    fields: [purposeProfiles.userId],
    references: [users.id],
  }),
}))

export const matchesRelations = relations(matches, ({ one, many }) => ({
  userA: one(users, {
    fields: [matches.userAId],
    references: [users.id],
  }),
  userB: one(users, {
    fields: [matches.userBId],
    references: [users.id],
  }),
  logs: many(matchLogs, { relationName: "match" }),
}))

export const matchLogsRelations = relations(matchLogs, ({ one }) => ({
  match: one(matches, {
    fields: [matchLogs.matchId],
    references: [matches.id],
  }),
  user: one(users, {
    fields: [matchLogs.userId],
    references: [users.id],
  }),
}))

export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
  subscriptions: many(userSubscriptions, { relationName: "plan" }),
}))

export const userSubscriptionsRelations = relations(userSubscriptions, ({ one }) => ({
  user: one(users, {
    fields: [userSubscriptions.userId],
    references: [users.id],
  }),
  plan: one(subscriptionPlans, {
    fields: [userSubscriptions.planId],
    references: [subscriptionPlans.id],
  }),
}))
