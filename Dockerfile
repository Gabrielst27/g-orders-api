FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

FROM base AS dependencies

RUN npm ci

COPY prisma ./prisma
COPY prisma7.config.ts ./

RUN npx prisma generate

FROM dependencies AS build

COPY tsconfig*.json nest-cli.json ./
COPY src ./src

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/src/main.js"]