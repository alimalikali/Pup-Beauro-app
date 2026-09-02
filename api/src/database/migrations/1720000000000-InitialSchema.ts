import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1720000000000 implements MigrationInterface {
  name = "InitialSchema1720000000000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await queryRunner.query(
      `CREATE TYPE "users_role_enum" AS ENUM ('user', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TYPE "users_gender_enum" AS ENUM ('male', 'female')`,
    );
    await queryRunner.query(
      `CREATE TYPE "verification_docs_status_enum" AS ENUM ('pending', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TYPE "matches_status_enum" AS ENUM ('pending', 'mutual', 'rejected')`,
    );

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" varchar NOT NULL UNIQUE,
        "phone" varchar,
        "password" varchar NOT NULL,
        "role" "users_role_enum" NOT NULL DEFAULT 'user',
        "gender" "users_gender_enum",
        "isVerified" boolean NOT NULL DEFAULT false,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "profiles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
        "displayName" varchar,
        "age" integer,
        "city" varchar,
        "sect" varchar,
        "education" varchar,
        "profession" varchar,
        "familyType" varchar,
        "bio" text,
        "purposeStatement" text,
        "purposeEmbeddingRaw" text,
        "lifeTags" text,
        "priorityDeen" integer NOT NULL DEFAULT 50,
        "priorityEducation" integer NOT NULL DEFAULT 50,
        "priorityCareer" integer NOT NULL DEFAULT 50,
        "priorityFamily" integer NOT NULL DEFAULT 50,
        "priorityLocation" integer NOT NULL DEFAULT 50,
        "isPublished" boolean NOT NULL DEFAULT false,
        "profileViews" integer NOT NULL DEFAULT 0,
        "waliEmail" varchar,
        "avatarUrl" varchar,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "verification_docs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "cnicFront" varchar,
        "cnicBack" varchar,
        "status" "verification_docs_status_enum" NOT NULL DEFAULT 'pending',
        "adminNote" varchar,
        "reviewedBy" uuid REFERENCES "users"("id") ON DELETE SET NULL,
        "reviewedAt" timestamptz,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "matches" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "userAId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "userBId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "status" "matches_status_enum" NOT NULL DEFAULT 'pending',
        "compatScore" double precision,
        "initiatedBy" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        UNIQUE ("userAId", "userBId"),
        CHECK ("userAId" <> "userBId")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "conversations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "matchId" uuid NOT NULL UNIQUE REFERENCES "matches"("id") ON DELETE CASCADE,
        "waliEmail" varchar,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "messages" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "conversationId" uuid NOT NULL REFERENCES "conversations"("id") ON DELETE CASCADE,
        "senderId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "content" text NOT NULL,
        "isRead" boolean NOT NULL DEFAULT false,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_messages_conversation_created" ON "messages" ("conversationId", "createdAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_profiles_discovery" ON "profiles" ("isPublished", "city")`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "messages"');
    await queryRunner.query('DROP TABLE IF EXISTS "conversations"');
    await queryRunner.query('DROP TABLE IF EXISTS "matches"');
    await queryRunner.query('DROP TABLE IF EXISTS "verification_docs"');
    await queryRunner.query('DROP TABLE IF EXISTS "profiles"');
    await queryRunner.query('DROP TABLE IF EXISTS "users"');
    await queryRunner.query('DROP TYPE IF EXISTS "matches_status_enum"');
    await queryRunner.query(
      'DROP TYPE IF EXISTS "verification_docs_status_enum"',
    );
    await queryRunner.query('DROP TYPE IF EXISTS "users_gender_enum"');
    await queryRunner.query('DROP TYPE IF EXISTS "users_role_enum"');
  }
}
