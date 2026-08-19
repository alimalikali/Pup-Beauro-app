---
name: add-file-upload
description: Add a Multer-backed file upload endpoint to a NestJS controller in api/. Mirrors verification.controller.ts pattern. Use when the user asks to "add upload", "new file endpoint", "image upload".
argument-hint: [feature-name] [field-name]
allowed-tools: Read, Write, Edit, Bash(mkdir *)
paths: api/**
---

# Add file upload: $ARGUMENTS

Use `FileFieldsInterceptor` from `@nestjs/platform-express` with `diskStorage`. Mirror `api/src/verification/verification.controller.ts`.

## Controller method

```typescript
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Post('upload')
@UseGuards(JwtGuard)
@UseInterceptors(FileFieldsInterceptor(
  [{ name: '$ARGUMENTS[1]', maxCount: 1 }],
  {
    storage: diskStorage({
      destination: './uploads/$ARGUMENTS[0]',
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB unless justified
  },
))
async upload(
  @UploadedFiles() files: { $ARGUMENTS[1]?: Express.Multer.File[] },
  @CurrentUser() user: User,
) {
  const file = files.$ARGUMENTS[1]?.[0];
  if (!file) throw new BadRequestException('No file provided');
  // persist file.path in DB via service
}
```

## Directory setup

Ensure the destination exists at boot. Either:
- Add `fs.mkdirSync('./uploads/$ARGUMENTS[0]', { recursive: true })` near the gateway/module bootstrap, OR
- Document the requirement in the README so deployments preprovision the directory

## Static serving

Already wired in `main.ts` (`/uploads/*` serves everything under `./uploads/`). No additional registration needed — confirm the new subdir falls under `uploads/`.

## Rules

- **Path**: always `./uploads/<feature>/` — never absolute, never outside `uploads/`
- **Filename**: `${Date.now()}-${originalname}` to avoid collisions (existing convention)
- **Size cap**: 5MB unless feature justifies more (e.g., video). Cap explicitly — never unlimited.
- **MIME type validation**: if restricting to images/PDFs, add a `fileFilter` to the storage opts
- **Cleanup**: no automatic cleanup today. If documents become stale (rejected verification, etc.), add a cron or admin action — do NOT delete on rejection silently
- **DB persistence**: store `file.path` (relative) in the entity. Re-serve as `http://host/uploads/<feature>/<filename>` on the client side

## Verify

- `curl -F "$ARGUMENTS[1]=@./local.jpg" -H "Authorization: Bearer <token>" http://localhost:5000/api/<route>/upload` — expect 200
- `ls uploads/$ARGUMENTS[0]/` — confirm file landed with timestamp prefix
- `curl http://localhost:5000/uploads/$ARGUMENTS[0]/<filename>` — expect 200 (static serving)
- Reject oversized upload (>5MB) — expect 413
