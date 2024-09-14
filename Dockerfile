FROM node:20-alpine AS base

### Dependencies ###
FROM base AS deps
RUN apk add --no-cache libc6-compat git

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


# Builder
FROM base AS builder

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

### Production image runner ###
FROM nginx:latest as nginxRunner
COPY --from=builder /app/out /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
