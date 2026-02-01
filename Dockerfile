# 1. Сборка приложения
FROM node:20-alpine AS builder

# Рабочая директория
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости (включая dev для сборки)
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем TypeScript в JavaScript (папка dist)
RUN npm run build

# 2. Финальный образ (Production)
FROM node:20-alpine AS production

WORKDIR /app

# Устанавливаем только prod-зависимости для уменьшения веса
COPY package*.json ./
RUN npm ci --only=production

# Копируем собранное приложение из builder
COPY --from=builder /app/dist ./dist

# Указываем порт (Dokploy будет мапить его)
EXPOSE 3000

# Запуск
CMD ["node", "dist/main"]
