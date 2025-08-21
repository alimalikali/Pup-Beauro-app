# ---- Base ----
    FROM node:20-alpine AS base
    RUN corepack enable && corepack prepare pnpm@latest --activate
    WORKDIR /app
    
    # ---- Install deps ----
    FROM base AS deps
    RUN apk add --no-cache libc6-compat python3 make g++
    COPY package.json pnpm-lock.yaml ./
    RUN pnpm install --frozen-lockfile
    
    # ---- Build ----
    FROM deps AS build
    WORKDIR /app
    COPY . .
    ENV NODE_ENV=production
    RUN pnpm run build
    
    # ---- Runtime ----
    FROM node:20-alpine AS runtime
    WORKDIR /app
    
    ENV NODE_ENV=production \
        PORT=3000 \
        NEXT_TELEMETRY_DISABLED=1
    
    # Copy standalone build
    COPY --from=build /app/public ./public
    COPY --from=build /app/.next/standalone ./
    COPY --from=build /app/.next/static ./.next/static
    
    # Non-root user
    RUN addgroup --system --gid 1001 nodejs \
      && adduser --system --uid 1001 nextjs
    USER nextjs
    
    EXPOSE 3000
    CMD ["node", "server.js"]
    