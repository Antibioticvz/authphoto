# БЫСТРЫЙ СТАРТ — AuthPhoto
## Путеводитель для начинающих разработчиков

**Версия:** 2.0 (с планом разработки)  
**Время на понимание:** 30-45 минут  
**Навык:** Junior+  

---

## 📚 ДОКУМЕНТАЦИЯ (Читай в этом порядке)

### 🎯 ДЛЯ МЕНЕДЖЕРОВ & БИЗНЕСА

| Документ | Описание | Время |
|---|---|---|
| **[README.md](./README.md)** | Что это, как это работает, как интегрировать | 5 мин |
| **[TECHNICAL_SPECIFICATION.md](./TECHNICAL_SPECIFICATION.md)** | Полное описание системы, алгоритм, архитектура | 15 мин |

### 💻 ДЛЯ РАЗРАБОТЧИКОВ

**Фронтенд разработчики:**
1. [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) - Архитектура фронтенда, компоненты, паттерны
2. [ARCHITECTURE_PATTERNS.md](./ARCHITECTURE_PATTERNS.md) - Factory, Strategy, Observer паттерны
3. [MOBILE_FIRST_DESIGN.md](./MOBILE_FIRST_DESIGN.md) - Мобильная оптимизация, Tailwind конфиг
4. [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md) - Code splitting, caching, optimization

**Бэкенд разработчики:**
1. [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) - NestJS архитектура, модули, сервисы
2. [ARCHITECTURE_PATTERNS.md](./ARCHITECTURE_PATTERNS.md) - Dependency Injection, Repository, Adapter
3. [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Step-by-step инструкции

**Все разработчики:**
- [BEST_PRACTICES_CHECKLIST.md](./BEST_PRACTICES_CHECKLIST.md) - ДО КАЖДОГО COMMIT!
- [API_PROTOCOL_AND_EXAMPLES.md](./API_PROTOCOL_AND_EXAMPLES.md) - JSON примеры, endpoints
- [constitution.md](./constitution.md) - Наши принципы, standards

---

## 🚀 БЫСТРО НАЧАТЬ

### День 1: Понимание

```bash
# 1. Прочитать TECHNICAL_SPECIFICATION (15 мин)
# ✅ Теперь понимаете ЧТО это

# 2. Прочитать DEVELOPMENT_PLAN (30 мин)
# ✅ Теперь понимаете КАК это строить
```

### День 2-3: Окружение

```bash
# 1. Clone репозитория
git clone <repo-url>
cd authphoto

# 2. Install dependencies
npm install

# 3. Copy .env
cp .env.example .env

# 4. Start dev server
npm run dev

# 5. Open http://localhost:5173
```

### День 4: Первый feature

```bash
# 1. Прочитать BEST_PRACTICES_CHECKLIST
# ✅ Теперь знаете как писать хороший код

# 2. Создать branch
git checkout -b feature/my-feature

# 3. Написать код, следуя паттернам из ARCHITECTURE_PATTERNS

# 4. Перед commit: npm run test && npm run lint

# 5. Push и создать PR

# 6. Во время review: проверять по BEST_PRACTICES_CHECKLIST
```

---

## 📊 ФАЙЛЫ И НАЗНАЧЕНИЕ

### Документация

```
.specify/memory/
├── 00_QUICK_START.md          ← Вы здесь
├── README.md                  ← Что это + FAQ
├── constitution.md            ← Наши принципы
├── TECHNICAL_SPECIFICATION.md ← Полная система описана
├── API_PROTOCOL_AND_EXAMPLES.md ← JSON, endpoints, примеры кода
├── DEVELOPMENT_GUIDE.md       ← Step-by-step instructions
├── DEVELOPMENT_PLAN.md        ← Архитектура + лучшие практики
├── ARCHITECTURE_PATTERNS.md   ← Design patterns с примерами
├── MOBILE_FIRST_DESIGN.md     ← Мобильная оптимизация
├── PERFORMANCE_OPTIMIZATION.md ← Скорость разработки и production
└── BEST_PRACTICES_CHECKLIST.md ← QA перед каждым commit
```

### Код (после `npm run dev`)

```
authphoto/
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── camera/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── store/
│   │   │   │   └── types/
│   │   │   └── verification/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   ├── pages/
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.ts
│
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── challenge/
│   │   │   ├── capture/
│   │   │   └── verification/
│   │   ├── shared/
│   │   ├── common/
│   │   ├── main.ts
│   │   └── app.module.ts
│   ├── package.json
│   └── nest-cli.json
│
└── docker-compose.yml
```

---

## 🎯 ПАТТЕРНЫ РАЗРАБОТКИ

### Frontend (React)

✅ **Всегда используй:**
- Feature-based folder structure
- Custom hooks для logic
- Zustand для state
- TypeScript strict mode
- React.memo для мемоизации

❌ **Никогда не делай:**
- Class components
- Redux (используй Zustand)
- console.log в production
- Direct DOM manipulation
- Global variables

### Backend (NestJS)

✅ **Всегда используй:**
- Modules для organization
- Dependency Injection
- DTOs для validation
- Services для logic
- Global exception filter

❌ **Никогда не делай:**
- Прямой access к DB из controller
- Circular module dependencies
- Hardcoded config values
- console.log (используй LoggerService)
- Side effects в middleware

---

## 📈 PERFORMANCE TARGETS

```
Что я должен достичь:

Frontend:
- Lighthouse score > 95
- Bundle size < 200KB (gzipped)
- FCP < 2 seconds
- LCP < 2.5 seconds

Backend:
- API response < 200ms (avg)
- Rate limit: 10 req/min per client
- Error rate < 0.5%
- 70%+ test coverage
```

---

## 🧪 ТЕСТИРОВАНИЕ

### Frontend (Vitest + React Testing Library)

```typescript
npm run test

// Писать тесты для:
// ✅ Custom hooks
// ✅ Utils functions
// ✅ Component rendering
// ✅ User interactions
```

### Backend (Jest)

```bash
npm run test:backend

// Писать тесты для:
// ✅ Services (unit)
// ✅ Controllers (integration)
// ✅ Edge cases
// ✅ Error handling
```

---

## 🔐 SECURITY CHECKLIST

Перед каждым pull request:

- [ ] Нет hardcoded passwords/API keys
- [ ] Используются environment variables
- [ ] Input validation везде
- [ ] XSS protection (React handles)
- [ ] CORS правильно configured
- [ ] Rate limiting enabled
- [ ] HTTPS in production
- [ ] No direct eval() или innerHTML
- [ ] Dependencies up to date (`npm audit`)
- [ ] No secrets in git history

---

## 📱 МОБИЛЬНЫЙ ДИЗАЙН

Всегда разрабатывай MOBILE-FIRST:

```css
/* Mobile default */
.component {
  width: 100%;
  font-size: 16px; /* Prevent zoom */
  min-height: 44px; /* Touch target */
}

/* Tablet */
@media (min-width: 768px) {
  .component {
    width: 80%;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .component {
    width: 60%;
  }
}
```

---

## 🚀 DEPLOYMENT

### Development

```bash
npm run dev
# http://localhost:5173
```

### Production

```bash
# Frontend
npm run build
npm run preview

# Backend
docker-compose up -d

# Check
curl http://localhost:3000/api/v1/health
```

---

## 🆘 TROUBLESHOOTING

### Backend не запускается

```bash
# 1. Проверить environment variables
cat .env

# 2. Очистить и переinstall
rm -rf node_modules package-lock.json
npm install

# 3. Посмотреть логи
npm run dev 2>&1 | tail -100
```

### Frontend не загружается

```bash
# 1. Очистить кэш
rm -rf .vite dist node_modules

# 2. Reinstall
npm install

# 3. Restart dev server
npm run dev
```

### Ошибки типов TypeScript

```bash
# Проверить strict mode
npm run type-check

# Исправить все ошибки перед commit
```

---

## 📞 ПОМОЩЬ И РЕСУРСЫ

| Что | Где |
|---|---|
| **Как начать feature** | → [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) |
| **Как писать компоненты** | → [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) |
| **Какие паттерны использовать** | → [ARCHITECTURE_PATTERNS.md](./ARCHITECTURE_PATTERNS.md) |
| **API endpoints** | → [API_PROTOCOL_AND_EXAMPLES.md](./API_PROTOCOL_AND_EXAMPLES.md) |
| **Как оптимизировать** | → [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md) |
| **Перед commit** | → [BEST_PRACTICES_CHECKLIST.md](./BEST_PRACTICES_CHECKLIST.md) |

---

## 🎓 LEARNING PATH

**Week 1: Основы**
- Day 1: Understand system architecture
- Day 2: Setup environment
- Day 3: First component
- Day 4-5: First PR

**Week 2: Паттерны**
- Day 1: Factory pattern (создание сервисов)
- Day 2: Strategy pattern (валидация)
- Day 3: Observer pattern (реал-тайм)
- Day 4-5: Implement with patterns

**Week 3: Production-ready**
- Day 1: Performance optimization
- Day 2: Mobile testing
- Day 3: Security audit
- Day 4-5: Deploy to production

---

## ✅ FIRST WEEK CHECKLIST

Перед концом первой недели вы должны:

- [ ] Понимаете что такое AuthPhoto и как оно работает
- [ ] Setup development environment locally
- [ ] Создали свой первый branch
- [ ] Написали простой компонент/сервис
- [ ] Написали unit tests
- [ ] Создали pull request
- [ ] Прошли code review
- [ ] Merged в main
- [ ] Deployed в staging

---

## 🎉 SUMMARY

Эта документация содержит ВСЁ что вам нужно:

```
30 мин  → Понимаете архитектуру ✅
2 часа  → Поднимаете environment ✅
1 день  → Пишете первый feature ✅
1 неделя → Готовы к production ✅
```

**Главное: Следуйте чек-листам, используйте паттерны, и не забывайте о quality.**

Happy coding! 🚀
