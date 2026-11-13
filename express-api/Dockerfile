FROM node:22-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# No Docker o banco e PostgreSQL: gera o client a partir do schema postgres
RUN npx prisma generate --schema prisma/schema.postgres.prisma && npx tsc
ENV NODE_ENV=production
EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push --schema prisma/schema.postgres.prisma && node dist/src/server.js"]
