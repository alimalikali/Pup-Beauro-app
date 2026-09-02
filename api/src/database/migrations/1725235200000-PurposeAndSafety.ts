import { MigrationInterface, QueryRunner } from "typeorm";

export class PurposeAndSafety1725235200000 implements MigrationInterface {
  name = "PurposeAndSafety1725235200000";
  async up(q: QueryRunner): Promise<void> {
    await q.query(
      `ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "partnerPreferences" jsonb NOT NULL DEFAULT '{}', ADD COLUMN IF NOT EXISTS "valuesAndBeliefs" jsonb NOT NULL DEFAULT '{}', ADD COLUMN IF NOT EXISTS "lifestylePreferences" jsonb NOT NULL DEFAULT '{}', ADD COLUMN IF NOT EXISTS "longTermGoals" jsonb NOT NULL DEFAULT '{}'`,
    );
    await q.query(
      `CREATE TABLE IF NOT EXISTS "favorites" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE, "profileUserId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE, "createdAt" timestamptz NOT NULL DEFAULT now(), UNIQUE("userId","profileUserId"))`,
    );
    await q.query(
      `CREATE TABLE IF NOT EXISTS "blocks" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE, "blockedUserId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE, "createdAt" timestamptz NOT NULL DEFAULT now(), UNIQUE("userId","blockedUserId"))`,
    );
    await q.query(
      `CREATE TYPE "report_status_enum" AS ENUM ('open','reviewing','resolved','dismissed')`,
    );
    await q.query(
      `CREATE TABLE "reports" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "reporterId" uuid NOT NULL REFERENCES "users"("id"), "reportedUserId" uuid NOT NULL REFERENCES "users"("id"), "category" varchar NOT NULL, "details" text NOT NULL, "status" "report_status_enum" NOT NULL DEFAULT 'open', "adminNote" varchar, "reviewedBy" uuid, "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now())`,
    );
    await q.query(
      `CREATE TABLE "notifications" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE, "type" varchar NOT NULL, "title" varchar NOT NULL, "body" text NOT NULL, "data" jsonb NOT NULL DEFAULT '{}', "isRead" boolean NOT NULL DEFAULT false, "createdAt" timestamptz NOT NULL DEFAULT now())`,
    );
    await q.query(
      `CREATE INDEX "IDX_notifications_user_created" ON "notifications" ("userId", "createdAt")`,
    );
  }
  async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE IF EXISTS "notifications"`);
    await q.query(`DROP TABLE IF EXISTS "reports"`);
    await q.query(`DROP TYPE IF EXISTS "report_status_enum"`);
    await q.query(`DROP TABLE IF EXISTS "blocks"`);
    await q.query(`DROP TABLE IF EXISTS "favorites"`);
    await q.query(
      `ALTER TABLE "profiles" DROP COLUMN IF EXISTS "longTermGoals", DROP COLUMN IF EXISTS "lifestylePreferences", DROP COLUMN IF EXISTS "valuesAndBeliefs", DROP COLUMN IF EXISTS "partnerPreferences"`,
    );
  }
}
