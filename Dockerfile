FROM node:20-alpine AS base

WORKDIR /app

# Установка зависимостей
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm install

# Сборка приложения
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production образ
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3010
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Standalone mode
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3010

CMD ["npm", "run", "start"]
