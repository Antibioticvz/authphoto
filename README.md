# AuthPhoto - Secure Real-Time Photo Authentication

[![CI](https://img.shields.io/badge/CI-passing-brightgreen)](.github/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-red)](https://nestjs.com/)

> Веб-сервис для создания неподделаемых фотографий через браузер с помощью криптографических челленджей

## 🎯 Что это?

AuthPhoto - это система защищённой съёмки фото в реальном времени, которая гарантирует подлинность снимков и предотвращает подделки (скриншоты, AI-генерация, Photoshop).

**Как это работает:**
1. Сервер генерирует случайные полигоны (криптографический челлендж)
2. Браузер рисует их поверх живого видео
3. Пользователь делает фото и добавляет сообщение
4. Система проверяет хэш - если совпадает, фото настоящее ✓

**Применение:**
- Страховые компании (фото повреждений)
- Юридические платформы (подтверждение документов)
- Доставка (подтверждение получения)
- Социальные сети (борьба с подделками)

## 🚀 Быстрый старт

### Prerequisites

- Node.js 20.x или выше
- npm 10.x или выше
- Git

### Установка

```bash
# Клонировать репозиторий
git clone https://github.com/yourusername/authphoto.git
cd authphoto

# Установить backend
cd backend
npm install
cp .env.example .env

# Запустить в режиме разработки
npm run start:dev
```

Backend будет доступен на `http://localhost:3000`

### Проверка работоспособности

```bash
# Проверить API
curl http://localhost:3000/health

# Запустить тесты
npm test

# Запустить линтер
npm run lint
```

## 📁 Структура проекта

```
authphoto/
├── .github/              # GitHub конфигурация & SpecKit agents
│   ├── workflows/        # CI/CD workflows
│   ├── ISSUE_TEMPLATE/   # Шаблоны issues
│   ├── agents/           # SpecKit agent configurations
│   ├── prompts/          # SpecKit prompts
│   └── README.md         # Документация GitHub интеграции
├── .specify/             # SpecKit система & проектная память
│   ├── memory/           # База знаний проекта
│   ├── scripts/          # Утилиты для работы со спецификациями
│   ├── templates/        # Шаблоны документов
│   └── README.md         # Документация SpecKit
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── challenge/    # Генерация челленджей
│   │   ├── capture/      # Обработка фото
│   │   └── photos/       # Хранилище фото
│   └── test/             # E2E тесты
├── specs/                # Спецификации фич
│   └── 001-backend-setup/
│       ├── plan.md
│       └── tasks.md
├── speckit               # CLI для SpecKit
└── README.md             # Этот файл
```

## 🛠️ Разработка

### Workflow с SpecKit

Проект использует **SpecKit** - систему управления спецификациями и разработкой.

#### Создание новой фичи

```bash
# 1. Создать спецификацию
./speckit new my-feature

# 2. Следовать SpecKit workflow:
# /speckit.specify - Создать детальную спецификацию
# /speckit.plan - Сгенерировать план реализации
# /speckit.tasks - Разбить на задачи
# /speckit.analyze - Проверить консистентность
# /speckit.checklist - Создать чеклист для реализации

# 3. Проверить статус
./speckit status my-feature
```

#### Список доступных фич

```bash
./speckit list
```

#### Проверка статуса фичи

```bash
./speckit status 001-backend-setup
```

### Constitution (Конституция проекта)

Все разработки должны следовать принципам из `.specify/memory/constitution.md`:

#### 🧪 I. Test-First Development (ОБЯЗАТЕЛЬНО)

- Сначала пишем тесты
- Минимум 80% покрытие
- Автоматические тесты в CI/CD

#### 🔒 II. Type Safety

- TypeScript strict mode
- Никаких `any` без обоснования
- Валидация всех внешних данных

#### 🛡️ III. Security First

- Валидация и санитизация всех входных данных
- Аутентификация для чувствительных операций
- Хеширование паролей (bcrypt)
- HTTPS в продакшене

#### 🔌 IV. API-First Architecture

- RESTful дизайн с версионированием
- Консистентные ответы с ошибками
- Автогенерация документации
- Rate limiting и пагинация

#### ✨ V. Code Quality

- ESLint/Prettier принудительно
- Code review обязателен
- Модульная архитектура
- Чистое разделение ответственностей

### Тестирование

```bash
# Unit тесты
npm test

# E2E тесты
npm run test:e2e

# Покрытие
npm run test:cov

# Watch mode
npm run test:watch
```

### Линтинг и форматирование

```bash
# Проверить код
npm run lint

# Исправить автоматически
npm run lint:fix

# Форматировать код
npm run format
```

### Сборка

```bash
# Production build
npm run build

# Запустить production
npm run start:prod
```

## 📝 API Документация

### Endpoints

#### Создание челленджа

```http
POST /api/v1/challenge
Content-Type: application/json

{
  "clientId": "insurance-corp"
}
```

**Response:**
```json
{
  "challengeId": "uuid",
  "polygons": [...],
  "expiresAt": "2025-11-16T14:30:00Z"
}
```

#### Захват фото

```http
POST /api/v1/capture
Content-Type: multipart/form-data

challengeId: uuid
photo: [binary]
message: "Царапина на бампере"
```

**Response:**
```json
{
  "photoId": "uuid",
  "verificationUrl": "https://authphoto.app/verify/uuid",
  "verified": true
}
```

Полная документация API: [API_PROTOCOL_AND_EXAMPLES.md](.specify/memory/API_PROTOCOL_AND_EXAMPLES.md)

## 🏗️ Архитектура

### Backend (NestJS)

- **ChallengeModule** - Генерация и валидация челленджей
- **CaptureModule** - Обработка и верификация фото
- **StorageModule** - Хранение фото и метаданных

### Frontend (Planned)

- React + TypeScript
- Vite для сборки
- Tailwind CSS для стилей
- WebRTC для камеры

## 🔄 CI/CD

### GitHub Actions

- **CI Pipeline** (`.github/workflows/ci.yml`)
  - Lint проверка
  - Unit тесты
  - E2E тесты
  - Build проверка

- **Spec Validation** (`.github/workflows/spec-check.yml`)
  - Валидация спецификаций
  - Проверка конституции
  - Markdown валидация

## 📚 Документация

- **Конституция проекта:** [.specify/memory/constitution.md](.specify/memory/constitution.md)
- **Техническая спецификация:** [.specify/memory/TECHNICAL_SPECIFICATION.md](.specify/memory/TECHNICAL_SPECIFICATION.md)
- **Руководство разработчика:** [.specify/memory/DEVELOPMENT_GUIDE.md](.specify/memory/DEVELOPMENT_GUIDE.md)
- **API протокол:** [.specify/memory/API_PROTOCOL_AND_EXAMPLES.md](.specify/memory/API_PROTOCOL_AND_EXAMPLES.md)
- **GitHub интеграция:** [.github/README.md](.github/README.md)
- **SpecKit система:** [.specify/README.md](.specify/README.md)

## 🤝 Contributing

### Процесс разработки

1. **Создать Issue**
   - Использовать шаблоны из `.github/ISSUE_TEMPLATE/`
   - Описать фичу или баг
   - Указать соответствие конституции

2. **Создать спецификацию**
   ```bash
   ./speckit new feature-name
   # Следовать SpecKit workflow
   ```

3. **Создать ветку**
   ```bash
   git checkout -b 002-feature-name
   ```

4. **Разработка с TDD**
   - Написать тесты первыми
   - Реализовать функционал
   - Убедиться что покрытие ≥80%

5. **Создать Pull Request**
   - Использовать шаблон PR
   - Заполнить Constitution Compliance Checklist
   - Приложить результаты тестов

6. **Code Review**
   - Минимум 1 approval
   - Все тесты проходят
   - Линтер чист

### Стандарты кода

- TypeScript strict mode
- ESLint конфигурация проекта
- Prettier для форматирования
- Conventional Commits

## 🐛 Troubleshooting

### Общие проблемы

**Проблема:** Backend не запускается
```bash
# Решение: Проверить зависимости
rm -rf node_modules package-lock.json
npm install
```

**Проблема:** Тесты падают
```bash
# Решение: Проверить окружение
npm run test:cov
# Проверить логи в консоли
```

**Проблема:** SpecKit команды не работают
```bash
# Решение: Проверить права доступа
chmod +x speckit
chmod +x .specify/scripts/bash/*.sh
```

## 📊 Статус проекта

- [x] Backend setup (001-backend-setup)
- [x] Challenge generation
- [x] Photo capture API
- [ ] Frontend implementation
- [ ] User authentication
- [ ] Production deployment

## 🎯 Roadmap

### Phase 1: MVP (Current)
- ✅ Backend infrastructure
- ✅ Challenge API
- ✅ Capture API
- 🔄 Basic frontend
- 🔄 E2E tests

### Phase 2: Production Ready
- ⏳ User authentication
- ⏳ Rate limiting
- ⏳ Production deployment
- ⏳ Monitoring & logging

### Phase 3: Scale
- ⏳ CDN integration
- ⏳ Multi-region deployment
- ⏳ Advanced analytics
- ⏳ Client SDKs

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 👥 Team

- **Victor** - Lead Developer

## 🌍 Локация

Разработано в Грузии (UTC+4)

## 📞 Контакты

- GitHub Issues: [Create an issue](https://github.com/yourusername/authphoto/issues)
- Documentation: [Wiki](https://github.com/yourusername/authphoto/wiki)

---

**Помни:** Качество важнее скорости. SpecKit процесс экономит время в долгосрочной перспективе, предотвращая переработки и обеспечивая соответствие принципам проекта.

