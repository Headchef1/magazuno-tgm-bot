# BUILD STAGE
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем конфиги зависимостей
COPY package*.json ./
COPY prisma ./prisma/
# Важно: копируем конфиг призмы, так как он нужен для generate
COPY prisma.config.ts ./

RUN npm ci

# Генерируем клиент (теперь он найдет конфиг)
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

# Генерируем клиент снова для чистого образа
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]
