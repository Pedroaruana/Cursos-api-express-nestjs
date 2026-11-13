FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
# as migrations rodam sozinhas no bootstrap (migrationsRun)
CMD ["node", "dist/main.js"]
