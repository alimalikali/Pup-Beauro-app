---
name: add-typeorm-entity
description: Scaffold a new TypeORM entity in api/ with UUID PK, timestamps, relations, and optional pgvector-style JSON column. Use when the user asks to "add entity", "new table", "create model", or extends a module schema.
argument-hint: [feature-name] [entity-name]
allowed-tools: Read, Write, Edit, Bash(mkdir *)
paths: api/**
---

# Add TypeORM entity: $ARGUMENTS

Create the entity under `api/src/$ARGUMENTS[0]/entities/$ARGUMENTS[1].entity.ts`. Match the conventions of `User`, `Profile`, `Match`, `Conversation`, `Message`, `VerificationDoc`.

## Required structure

```typescript
import {
  Column, CreateDateColumn, Entity, ManyToOne, OneToMany,
  PrimaryGeneratedColumn, UpdateDateColumn, Unique,
} from 'typeorm';

@Entity()
export class $ARGUMENTS[1] {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // domain columns here

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## Conventions

- **PK**: always UUID via `@PrimaryGeneratedColumn('uuid')`
- **Timestamps**: `@CreateDateColumn` + `@UpdateDateColumn` — every entity
- **Enums**: define in a sibling `<name>.enum.ts`, use `@Column({ type: 'enum', enum: MyEnum })`
- **Unique constraints**:
  - Single column → `@Column({ unique: true })`
  - Composite → `@Unique(['col1', 'col2'])` at class level (see `Match` for the sorted-UUID pattern)
- **Relations**: declare BOTH sides; use `{ onDelete: 'CASCADE' }` where the child can't exist alone
- **JSON-serialized vectors** (mimicking `purposeEmbeddingRaw`): `@Column({ type: 'text', nullable: true })` — store as JSON.stringify of a float array
- **Optional columns**: `nullable: true` in the `@Column` opts

## Register the entity

Edit the parent module's `*.module.ts`:
```typescript
TypeOrmModule.forFeature([..., $ARGUMENTS[1]])
```

## Migrations

Dev environment uses `synchronize: true` — TypeORM picks up the new schema automatically. For prod, generate a migration manually:
```bash
cd api && pnpm exec typeorm migration:generate src/migrations/Add$ARGUMENTS[1]
```

## Do not

- Use `eager: true` on relations — hides N+1 and balloons queries
- Skip the inverse side of a relation when both ends need to be navigable
- Reuse another entity's UUID as PK — generate a fresh one even for tightly-coupled child rows (use FK column instead)
