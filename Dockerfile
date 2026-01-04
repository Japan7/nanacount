FROM node:lts-alpine AS builder
WORKDIR /src
COPY prisma prisma
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:lts-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY prisma prisma
COPY prisma.config.js .
COPY --from=builder --chown=node /src/.output .
USER node
CMD [ "server/index.mjs" ]
EXPOSE 3000
