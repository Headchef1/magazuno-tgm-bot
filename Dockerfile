# BUILD STAGE
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем конфиги зависимостей
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci

# ! ВАЖНО: Добавляем фейковый URL для сборки, чтобы prisma generate не падал
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate

# Копируем весь остальной исходный код
COPY . .

RUN npm run build

# PRODUCTION STAGE
FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Ставим только прод-зависимости
RUN npm ci --only=production

# ! ВАЖНО: Тут тоже добавляем фейк для генерации
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]
