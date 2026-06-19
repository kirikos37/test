# CAP PC — Compare, Assemble, Purchase

Full-stack приложение для сравнения цен на комплектующие ПК, конфигуратора сборок, новостей и трендов.

## Стек

- **Клиент:** React 18 + Vite 5 + React Router + Formik + Recharts
- **Сервер:** Node.js + Express + OpenAI (опционально) + RSS-parser

## Быстрый старт

### 1. Переменные окружения

Скопируйте `.env.example` в `.env` в папке `CAP_PC`:

```bash
cp .env.example .env
```

Заполните `OPENAI_API_KEY` для AI-поиска цен и трендов (без ключа работают demo/mock данные).

### 2. Установка

```bash
# Сервер
cd d:/projects/test/CAP_PC/server
npm install

# Клиент
cd d:/projects/test/CAP_PC/client
npm install
```

### 3. Запуск

**Терминал 1 — сервер:**
```bash
cd d:/projects/test/CAP_PC/server
npm run dev
```

**Терминал 2 — клиент:**
```bash
cd d:/projects/test/CAP_PC/client
npm run dev
```

Откройте: **http://localhost:5173/**

### 4. Доступ с телефона или другого ПК (локальная сеть)

1. Компьютер с проектом и телефон должны быть в **одной Wi‑Fi сети**.
2. Запустите **оба** процесса (server + client) на ПК.
3. В терминале client после `npm run dev` появится строка **Network**, например:
   ```text
   ➜  Network: http://192.168.1.105:5173/
   ```
4. Эту ссылку откройте на телефоне/планшете в браузере.

**Узнать IP вручную (Windows):** `ipconfig` → «IPv4-адрес» (обычно `192.168.x.x`).

**Если не открывается:** разрешите Node.js в брандмауэре Windows (при первом запуске или: Параметры → Брандмауэр → Разрешить приложение).

API с других устройств идёт через proxy Vite (`/api` → server), отдельно порт 3001 открывать не нужно.

## Production (один сервер, один порт)

В production React собирается в статические файлы, Express отдаёт и сайт, и API на **одном порту** (по умолчанию **3001**). Удобно для телефона в Wi‑Fi и для деплоя на VPS.

### Сборка и запуск

```bash
cd d:/projects/test/CAP_PC

# Один раз: установить зависимости
npm run install:all
npm install

# Собрать клиент → client/dist
npm run build

# Запустить production
npm run start:prod
```

Или одной командой (сборка + запуск):

```bash
npm run preview
```

Откройте: **http://localhost:3001/**

С телефона в той же Wi‑Fi: **http://192.168.x.x:3001/** (IP из `ipconfig`).

### Скрипты

| Команда | Что делает |
|---------|------------|
| `npm run build` | Сборка React в `client/dist` |
| `npm run start:prod` | Сервер + статика (нужен предварительный build) |
| `npm run preview` | build + start:prod |

### Переменные для production (`.env`)

```env
NODE_ENV=production
PORT=3001
OPENAI_API_KEY=...
```

### Development vs Production

| | Development | Production |
|---|-------------|------------|
| Команды | server `dev` + client `dev` | `npm run build` + `npm run start:prod` |
| URL | http://localhost:5173 | http://localhost:3001 |
| API | proxy Vite → :3001 | тот же хост `/api/...` |

## Маршруты

| URL | Экран |
|-----|-------|
| `/` | Главная |
| `/prices` | Сравнение цен |
| `/news` | Новости ПК |
| `/trends` | Современные тренды |
| `/configurator` | Конfigurator ПК |

## API (порт 3001)

- `GET /api/health` — проверка сервера
- `GET /api/catalog` — каталог комплектующих
- `POST /api/prices/search` — поиск и сравнение цен
- `GET /api/news` — новости (RSS + опционально VK)
- `GET /api/trends` — тренды (OpenAI или fallback)
- `POST /api/chat` — чат поддержки

## Структура

```
CAP_PC/
  client/     # React-приложение
  server/     # Express API
  .env.example
  README.md
```

## Примечания

- Цены от OpenAI — **ориентировочные**. Проверяйте на сайтах магазинов.
- VK-новости требуют `VK_ACCESS_TOKEN` и `VK_GROUP_ID` в `.env`.
- Сборки конфигуратора и последний поиск сохраняются в `localStorage` браузера.
