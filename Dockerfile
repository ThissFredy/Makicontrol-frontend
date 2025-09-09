# ---- Base Stage ----
FROM node:20-alpine AS base

# ---- Dependencies Stage ----
FROM base AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod=false

# ---- Builder Stage ----
FROM base AS builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copia el archivo .env de producción para que next build lo lea
COPY .env.production ./

RUN pnpm build

# ---- Runner Stage (Producción Final) ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
EXPOSE 3000
RUN corepack enable
COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
USER node
CMD ["node", "server.js"]