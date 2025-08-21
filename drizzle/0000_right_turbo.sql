CREATE TYPE "public"."archetype" AS ENUM('LEADER', 'FOLLOWER', 'SUPPORTER', 'PARTNER', 'ROMANTIC', 'CONFIDANT', 'COMPANION', 'MENTOR', 'INNOVATOR', 'EXPERT', 'ADVISOR', 'ENTREPRENEUR', 'PROFESSIONAL', 'TEAM_PLAYER', 'VISIONARY', 'GURU', 'SCHOLAR', 'PHILANTHROPIST', 'ACTIVIST', 'COMMUNITY_LEADER', 'ADVOCATE', 'ARTIST', 'CREATOR', 'PERFORMER', 'WRITER', 'DESIGNER', 'SPIRITUAL_GUIDE', 'PHILOSOPHER', 'THEOLOGIAN', 'HEALER', 'EXPLORER', 'SEEKER', 'STUDENT', 'ADVENTURER', 'NURTURER', 'CARETAKER', 'OPTIMIST', 'REALIST', 'SELF_DISCOVERER', 'MYSTIC', 'LEARNER', 'ADVISOR');--> statement-breakpoint
CREATE TYPE "public"."domain" AS ENUM('PERSONAL_GROWTH', 'SELF_DISCOVERY', 'EMOTIONAL_WELLBEING', 'MINDFULNESS', 'SPIRITUAL_ENLIGHTENMENT', 'MARRIAGE', 'FAMILY', 'PARENTING', 'COMPANIONSHIP', 'FRIENDSHIP', 'ROMANTIC_RELATIONSHIPS', 'PHYSICAL_HEALTH', 'MENTAL_HEALTH', 'FITNESS', 'NUTRITION', 'WELLNESS', 'YOGA', 'MEDITATION', 'RELIGIOUS_DEVOTION', 'SPIRITUAL_GROWTH', 'FAITH_EXPLORATION', 'MEDITATIVE_PRACTICES', 'RELIGIOUS_COMMUNITY', 'ACADEMIC_ACHIEVEMENT', 'LIFELONG_LEARNING', 'LANGUAGE_LEARNING', 'PERSONAL_EDUCATION', 'SOCIAL_JUSTICE', 'POLITICAL_ACTIVISM', 'ENVIRONMENTAL_SUSTAINABILITY', 'CHARITY_WORK', 'VOLUNTEERING', 'HUMAN_RIGHTS', 'COMMUNITY_BUILDING', 'PROFESSIONAL_NETWORKING', 'CAREER_ADVANCEMENT', 'SKILL_DEVELOPMENT', 'MENTORSHIP', 'LEADERSHIP_DEVELOPMENT', 'FINANCIAL_INDEPENDENCE', 'WEALTH_CREATION', 'INVESTING', 'PERSONAL_FINANCE', 'ECONOMIC_EMPOWERMENT', 'ARTISTIC_EXPRESSION', 'MUSIC_CREATION', 'WRITING', 'PHOTOGRAPHY', 'PAINTING', 'SCULPTURE', 'DESIGN', 'TRAVEL', 'CULTURAL_EXPLORATION', 'EXPATRIATE_LIVING', 'ADVENTURE_TRAVEL', 'TECHNOLOGY_INNOVATION', 'AI_RESEARCH', 'DIGITAL_CREATION', 'SOFTWARE_DEVELOPMENT', 'TECH_STARTUPS', 'PHILOSOPHICAL_EXPLORATION', 'ETHICS', 'MORALITY', 'LOGIC_AND_RATIONALE', 'SUSTAINABLE_LIVING', 'MINIMALISM', 'FASHION', 'HOME_IMPROVEMENT', 'GARDENING', 'LEGAL_REFORM', 'JUDICIAL_REFORM', 'CIVIL_LIBERTIES', 'HUMAN_RIGHTS_LAW', 'PERSONAL_EXPLORATION', 'CURIOSITY', 'INNOVATION', 'CREATIVE_THINKING', 'EXPERIMENTATION');--> statement-breakpoint
CREATE TYPE "public"."education_level" AS ENUM('NO_FORMAL_EDUCATION', 'PRIMARY', 'SECONDARY', 'HIGH_SCHOOL', 'DIPLOMA', 'ASSOCIATE', 'BACHELORS', 'MASTERS', 'MBA', 'PHD', 'POSTDOC', 'VOCATIONAL', 'SELF_TAUGHT', 'BOOTCAMP', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."language" AS ENUM('ENGLISH', 'URDU', 'HINDI', 'PUNJABI', 'BANGLA', 'TAMIL', 'TELUGU', 'KANNADA', 'MARATHI', 'GUJARATI', 'ODIA', 'TURKISH', 'ARABIC', 'RUSSIAN', 'POLISH', 'CROATIAN', 'BULGARIAN', 'ROMANIAN', 'BOSNIAN', 'SERBIAN', 'PERSIAN', 'PASHTO', 'KURDISH', 'AZERBAIJANI', 'MALAY', 'INDONESIAN', 'SWAHILI', 'BENGALI', 'KASHMIRI', 'URDU_HINDI', 'MALAYALAM', 'ALBANIAN', 'UZBEK', 'TURKMEN', 'KAZAKH', 'CHECHEN', 'Hausa', 'BENGALI', 'SOMALI', 'MOROCCAN', 'TUNISIAN', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."marital_status" AS ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');--> statement-breakpoint
CREATE TYPE "public"."match_status" AS ENUM('PENDING', 'LIKED', 'REJECTED', 'ACCEPTED');--> statement-breakpoint
CREATE TYPE "public"."modality" AS ENUM('ONLINE', 'OFFLINE', 'VIRTUAL', 'COLLABORATIVE', 'TEXT_BASED', 'ONE_ON_ONE', 'WORKSHOPS', 'CONFERENCES', 'MEETUPS', 'SOCIAL_MEDIA', 'FORUMS', 'BLOGS');--> statement-breakpoint
CREATE TYPE "public"."personality_type" AS ENUM('INTROVERT', 'EXTROVERT', 'AMBIVERENT', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."political_view" AS ENUM('LIBERAL', 'CONSERVATIVE', 'CENTRIST', 'LIBERTARIAN', 'SOCIALIST', 'PROGRESSIVE', 'NATIONALIST', 'APOLITICAL', 'FUNDAMENTALIST', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."profession_field" AS ENUM('ENGINEERING', 'SOFTWARE_DEVELOPMENT', 'DATA_SCIENCE', 'ARTIFICIAL_INTELLIGENCE', 'MEDICINE', 'DENTISTRY', 'NURSING', 'EDUCATION', 'BUSINESS', 'ENTREPRENEUR', 'FINANCE', 'MARKETING', 'SALES', 'LAW', 'GOVERNMENT', 'PUBLIC_SERVICE', 'DESIGN', 'WRITING', 'JOURNALISM', 'ARTS', 'FILM', 'MUSIC', 'SPORTS', 'AGRICULTURE', 'ARCHITECTURE', 'PSYCHOLOGY', 'SOCIAL_WORK', 'FREELANCER', 'STUDENT', 'UNEMPLOYED', 'HOMEMAKER', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."religion" AS ENUM('ISLAM', 'CHRISTIANITY', 'HINDUISM', 'BUDDHISM', 'JUDAISM', 'SIKHISM', 'JAINISM', 'BAHAI', 'ZOROASTRIANISM', 'SHINTO', 'TAOISM', 'AGNOSTIC', 'ATHEIST', 'SPIRITUAL_BUT_NOT_RELIGIOUS', 'PAGAN', 'INDIGENOUS', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('ACTIVE', 'EXPIRED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."substance_usage" AS ENUM('NONE', 'OCCASIONAL', 'REGULAR', 'SOCIAL', 'TRYING_TO_QUIT', 'OPEN');--> statement-breakpoint
CREATE TABLE "match_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"feedback" text NOT NULL,
	"is_accepted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_a_id" uuid NOT NULL,
	"user_b_id" uuid NOT NULL,
	"compatibility_score" real NOT NULL,
	"domain_score" real NOT NULL,
	"archetype_score" real NOT NULL,
	"modality_score" real NOT NULL,
	"match_narrative" text NOT NULL,
	"status" "match_status" DEFAULT 'PENDING' NOT NULL,
	"is_new" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "purpose_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"domain" "domain" NOT NULL,
	"archetype" "archetype" NOT NULL,
	"modality" "modality" NOT NULL,
	"narrative" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"price" real NOT NULL,
	"duration" integer NOT NULL,
	"perks" text[],
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "subscription_plans_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"status" "subscription_status" DEFAULT 'ACTIVE' NOT NULL,
	"payment_id" varchar(255),
	"payment_method" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"phone" varchar(20),
	"role" "role" DEFAULT 'USER' NOT NULL,
	"gender" "gender",
	"dob" date,
	"avatar" text,
	"religion" "religion",
	"education" "education_level",
	"profession" "profession_field",
	"personality" "personality_type",
	"country" varchar(100),
	"country_code" varchar(2),
	"state" varchar(100),
	"state_code" varchar(10),
	"city" varchar(100),
	"marital_status" "marital_status",
	"looking_for" "marital_status",
	"height" integer,
	"weight" integer,
	"language" "language",
	"interests" text[],
	"alcohol" "substance_usage",
	"drugs" "substance_usage",
	"smoking" "substance_usage",
	"politics" text[],
	"is_verified" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "match_logs" ADD CONSTRAINT "match_logs_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_logs" ADD CONSTRAINT "match_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_user_a_id_users_id_fk" FOREIGN KEY ("user_a_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_user_b_id_users_id_fk" FOREIGN KEY ("user_b_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purpose_profiles" ADD CONSTRAINT "purpose_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE cascade ON UPDATE no action;