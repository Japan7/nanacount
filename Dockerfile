FROM node:lts-alpine@sha256:c0a3badbd8a0a760de903e00cedbca94588e609299820557e72cba2a53dbaa2c as builder
WORKDIR /src
COPY prisma prisma
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:lts-alpine@sha256:c0a3badbd8a0a760de903e00cedbca94588e609299820557e72cba2a53dbaa2c as runner
ENV NODE_ENV=production
WORKDIR /app
COPY prisma prisma
COPY --from=builder --chown=node /src/.output .
USER node
CMD [ "server/index.mjs" ]
EXPOSE 3000
