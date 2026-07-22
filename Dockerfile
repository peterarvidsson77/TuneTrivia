# TuneTrivia — API + spelsida i en container.
# Byggkontext = repo-roten (behöver både backend/ och data/).
FROM node:20-alpine

WORKDIR /app

# Installera backend-beroenden (inkl. dev: tsx/drizzle-kit körs i runtime/migrering).
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --include=dev

# Källkod + frågebank.
COPY backend ./backend
COPY data ./data

WORKDIR /app/backend
ENV NODE_ENV=production
# PORT, DATABASE_URL och QUESTION_COUNT sätts av hostmiljön.
EXPOSE 3000

CMD ["npm", "start"]
