FROM node:24-alpine AS deps

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases

RUN node .yarn/releases/yarn-4.13.0.cjs install --immutable


FROM node:24-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN node .yarn/releases/yarn-4.13.0.cjs build


FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
