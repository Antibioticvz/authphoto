# Чек-лист лучших практик разработки — AuthPhoto

## Гайд для кода, который готов к production

**Версия:** 1.0  
**Целевая аудитория:** Разработчики, code reviewers  
**Применение:** Для каждого PR перед merge в main

---

## ✅ ПЕРЕД НАЧАЛОМ РАЗРАБОТКИ

### Планирование

- [ ] Feature описан в GitHub Issue
- [ ] Задача есть в Project board
- [ ] Определены acceptance criteria
- [ ] Обговорены dependencies с другими tasks
- [ ] Выбран правильный branch (feature/_, bugfix/_, etc)

### Подготовка

- [ ] Создан feature branch: `git checkout -b feature/feature-name`
- [ ] Workspace очищен: `git status` показывает чистый репозиторий
- [ ] Последние изменения залиты: `git pull origin main`
- [ ] Установлены зависимости: `npm install`
- [ ] IDE скрипты работают

---

## ✅ ВО ВРЕМЯ РАЗРАБОТКИ

### TypeScript

- [ ] Strict mode: все файлы должны компилироваться без ошибок (`tsc --noEmit`)
- [ ] Нет `any` типов - всегда явные типы
- [ ] Все функции имеют return типы
- [ ] Нет `!` non-null assertions (используйте optional chaining `?.`)
- [ ] Interfaces вместо type для объектов (более flexible)
- [ ] Discriminated unions для ошибок: `{ status: 'error'; error: Error } | { status: 'success'; data: T }`

```typescript
// ✅ ПРАВИЛЬНО
interface ApiResponse<T> {
  status: "success" | "error"
  data?: T
  error?: string
}

const handleResponse = (response: ApiResponse<User>): void => {
  if (response.status === "error") {
    console.error(response.error)
  }
}

// ❌ НЕПРАВИЛЬНО
const response: any = null
const data = response.data! // Don't use !
```

### React Components

- [ ] Функциональные компоненты только (нет class components)
- [ ] Props fully typed: `React.FC<PropsType>`
- [ ] Мемоизация больших/дорогих компонентов: `React.memo()`
- [ ] useCallback для функций, передаваемых как props
- [ ] useMemo для дорогих вычислений
- [ ] Правильная dependency array в useEffect (используйте ESLint rules)
- [ ] Нет side effects в render-функции
- [ ] displayName для каждого компонента (для DevTools)
- [ ] Правильная обработка loading/error состояний

```typescript
// ✅ ПРАВИЛЬНО
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = React.memo(
  ({ label, onClick, disabled = false }) => (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
)

Button.displayName = "Button"

// ❌ НЕПРАВИЛЬНО
export const Button = ({ label, onClick, disabled }) => {
  // No types, no displayName, could be re-rendered unnecessarily
}
```

### API Integration

- [ ] API client - singleton с централизованной конфигурацией
- [ ] Error handling - глобальная обработка ошибок
- [ ] Timeouts - установлены разумные таймауты
- [ ] Retry logic - реимплементация для сетевых ошибок
- [ ] Request/Response типы - полностью typed
- [ ] Cancellation tokens - для отмены в-полете запросов

```typescript
// ✅ ПРАВИЛЬНО
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30_000,
})

api.interceptors.response.use(
  response => response.data,
  error => {
    // Centralized error handling
    toast.error(error.response?.data?.message || "Error")
    throw error
  }
)

export const photoApi = {
  getChallenge: (clientId: string) =>
    api.get<Challenge>("/challenge", { params: { clientId } }),
}
```

### State Management (Zustand)

- [ ] Store actions/mutations определены четко
- [ ] Нет side effects в store (используйте hooks вместо этого)
- [ ] Selector functions для оптимизации re-renders
- [ ] TypeScript interface для store state

```typescript
// ✅ ПРАВИЛЬНО
interface CameraStore {
  isReady: boolean
  challenge: Challenge | null
  setReady: (ready: boolean) => void
  setChallenge: (challenge: Challenge) => void
}

export const useCameraStore = create<CameraStore>(set => ({
  isReady: false,
  challenge: null,
  setReady: ready => set({ isReady: ready }),
  setChallenge: challenge => set({ challenge }),
}))

// Selector для оптимизации
export const useChallengeSelector = () =>
  useCameraStore(state => state.challenge)
```

### Error Handling

- [ ] Try-catch для асинхронных операций
- [ ] Специализированные error классы
- [ ] User-friendly error messages
- [ ] Error logging в production
- [ ] Fallback UIs для error состояний

```typescript
// ✅ ПРАВИЛЬНО
try {
  const photo = await camera.capturePhoto()
  await api.uploadPhoto(photo)
} catch (error) {
  if (error instanceof CameraError) {
    toast.error("Camera access denied")
  } else if (error instanceof NetworkError) {
    toast.error("Network error - please try again")
  } else {
    toast.error("An unexpected error occurred")
    console.error(error)
  }
}
```

### Performance

- [ ] Code splitting на level of routes
- [ ] Images оптимизированы (WebP с fallback)
- [ ] Нет unnecessary re-renders (React DevTools Profiler)
- [ ] API requests кешированы где возможно
- [ ] Bundle size < 200KB gzipped
- [ ] Lighthouse score > 90
- [ ] Нет n+1 queries к API
- [ ] Нет infinite loops или memory leaks

```typescript
// ✅ ПРАВИЛЬНО
// Lazy load routes
const CameraPage = lazy(() => import("@pages/CameraPage"))

// Cache API responses
const cachedData = (await cache.get(key)) || (await api.fetch(key))

// Optimize images
const optimized = await optimizeImage(photo, { quality: 0.85 })
```

---

## ✅ BACKEND: NestJS BEST PRACTICES

### Project Structure

- [ ] Feature-based module organization
- [ ] Clear separation: controllers, services, dto, entities
- [ ] Shared utilities в отдельной папке
- [ ] Configuration externalized (`.env` файл)
- [ ] Tests рядом с кодом (`*.spec.ts`)

### Modules and Dependency Injection

- [ ] Каждая feature - отдельный module
- [ ] Dependencies инжектиться через constructor
- [ ] Services инжектируются, не создаются inline
- [ ] Circular dependencies resolved через forwardRef или shared module
- [ ] Module exports контролируются явно

```typescript
// ✅ ПРАВИЛЬНО
@Module({
  imports: [SharedModule],
  controllers: [ChallengeController],
  providers: [ChallengeService],
  exports: [ChallengeService], // Export for other modules
})
export class ChallengeModule {}

@Injectable()
export class ChallengeService {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly cache: CacheService,
    private readonly logger: LoggerService
  ) {}
}
```

### DTOs and Validation

- [ ] Все endpoint inputs имеют DTO классы
- [ ] Validation decorators используются (`@IsString()`, `@IsNotEmpty()`, etc)
- [ ] Custom validators где необходимо
- [ ] Error messages на русском (или consistent language)
- [ ] Whitelist enabled в validation pipe

```typescript
// ✅ ПРАВИЛЬНО
export class CapturePhotoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message: string;

  @IsString()
  @IsNotEmpty()
  challengeId: string;

  @IsBase64()
  videoBase64: string;
}

// Auto-validated in controller
@Post('capture')
async capture(@Body() dto: CapturePhotoDto) {
  // dto is already validated
}
```

### Error Handling

- [ ] Global exception filter설정
- [ ] Proper HTTP status codes
- [ ] Consistent error response format
- [ ] No stack traces в production responses
- [ ] Error logging на сервере

```typescript
// ✅ ПРАВИЛЬНО
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    let statusCode = 500
    let message = "Internal server error"

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus()
      message = exception.message
    }

    response.status(statusCode).json({
      status: "error",
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    })
  }
}
```

### Logging

- [ ] Structured logging (JSON format)
- [ ] Log levels: debug, log, warn, error
- [ ] Context в logs для трейсинга
- [ ] No console.log - используйте LoggerService
- [ ] Sensitive data не логируется

```typescript
// ✅ ПРАВИЛЬНО
this.logger.log(`Challenge generated: ${challengeId}`, "ChallengeService")
this.logger.warn(`Challenge expired: ${challengeId}`, "ChallengeService")
this.logger.error(
  `Upload failed: ${error.message}`,
  error.stack,
  "CaptureService"
)

// ❌ НЕПРАВИЛЬНО
console.log("Challenge:", challenge) // Don't use console.log
```

### Security

- [ ] CORS правильно configured
- [ ] Rate limiting enabled
- [ ] Input validation (DTOs)
- [ ] HTTPS in production
- [ ] Environment variables для sensitive data
- [ ] No hardcoded secrets
- [ ] OWASP top 10 учтено

```typescript
// ✅ ПРАВИЛЬНО
app.enableCors({
  origin: process.env.CORS_ORIGIN?.split(','),
  credentials: true
});

@UseGuards(RateLimitGuard, AuthGuard)
@Post('capture')
async capture(@Body() dto: CapturePhotoDto) {
  // Protected endpoint
}
```

### Testing

- [ ] Unit tests для сервисов (Jest)
- [ ] Integration tests для controllers
- [ ] Минимум 70% code coverage
- [ ] Test naming: `should [expected behavior] when [condition]`
- [ ] Mocking dependencies
- [ ] Happy path + error cases

```typescript
// ✅ ПРАВИЛЬНО
describe("ChallengeService", () => {
  let service: ChallengeService
  let mockCache: any

  beforeEach(() => {
    mockCache = { set: jest.fn(), get: jest.fn() }
    service = new ChallengeService(mockCache)
  })

  it("should generate challenge when invoked", async () => {
    const result = await service.generateChallenge("client-1")
    expect(result).toHaveProperty("challengeId")
    expect(mockCache.set).toHaveBeenCalled()
  })

  it("should throw when challengeId is invalid", async () => {
    await expect(service.validateChallenge(null)).rejects.toThrow()
  })
})
```

---

## ✅ CODE REVIEW CHECKLIST

Для reviewers - проверьте:

### Функциональность

- [ ] Код решает поставленную задачу
- [ ] Нет side effects
- [ ] Edge cases обработаны
- [ ] Нет дублирования кода
- [ ] Логика понятна и простая

### Качество кода

- [ ] Нет console.log
- [ ] Нет commented-out кода
- [ ] TypeScript strict mode passed
- [ ] ESLint passed (no warnings)
- [ ] Prettier formatted
- [ ] Правильные имена переменных/функций

### Тесты

- [ ] Тесты написаны
- [ ] Тесты проходят
- [ ] Code coverage достаточный
- [ ] Happy path + error cases покрыты

### Документация

- [ ] JSDoc comments где необходимо
- [ ] README обновлен если needed
- [ ] API документация актуальна
- [ ] Complex logic задокументирован

### Performance

- [ ] Нет n+1 queries
- [ ] Нет unnecessary re-renders
- [ ] Bundle size не увеличился
- [ ] Lighthouse score не упал

### Security

- [ ] Input validation
- [ ] XSS защита (React автоматически)
- [ ] CSRF tokens где needed
- [ ] No secrets in code
- [ ] Rate limiting where applicable

---

## ✅ ПЕРЕД COMMIT

```bash
# 1. Запустить тесты
npm run test

# 2. Проверить типы
npm run type-check

# 3. Запустить linter
npm run lint

# 4. Форматировать код
npm run format

# 5. Проверить bundle size
npm run analyze

# 6. Запустить build
npm run build

# 7. Если все ОК - коммитить
git add .
git commit -m "feat(camera): add polygon overlay component"
```

### Commit Message Format (Conventional Commits)

```
<type>(<scope>): <subject>

<body>

<footer>

Types:
- feat:      New feature
- fix:       Bug fix
- docs:      Documentation
- style:     Code style (no logic change)
- refactor:  Refactoring (no logic change)
- test:      Adding tests
- chore:     Tooling, dependencies

Example:
feat(camera): add polygon overlay component

- Implement canvas-based polygon drawing
- Support for 5-7 random polygons per challenge
- Responsive to window resize

Closes #123
```

---

## ✅ ПЕРЕД PUSH

```bash
# Проверить что на latest main
git pull origin main

# Перебейсить если нужно
git rebase main

# Проверить что все еще работает
npm run test
npm run build

# Push
git push origin feature/feature-name
```

---

## ✅ ПЕРЕД MERGE

- [ ] All GitHub checks passed (CI/CD)
- [ ] Code review approved (min 1)
- [ ] Tests all pass
- [ ] Lighthouse score acceptable
- [ ] No merge conflicts
- [ ] Commits логически структурированы
- [ ] Commit messages follow convention
- [ ] Branch clean (no extra files)

---

## ✅린ТИНГ И ФОРМАТИРОВАНИЕ

### .eslintrc.json

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "no-console": ["error", { "allow": ["warn", "error"] }],
    "no-var": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-types": "error",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### .prettierrc

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid"
}
```

### package.json scripts

```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write 'src/**/*.{ts,tsx,json,css,md}'",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "vite build",
    "dev": "vite",
    "preview": "vite preview",
    "analyze": "vite-plugin-visualizer"
  }
}
```

---

## 📊 METRICS TO TRACK

После каждого release:

- [ ] Bundle size trend (должен уменьшаться)
- [ ] Lighthouse scores (должны быть > 90)
- [ ] Test coverage (должно расти, не падать)
- [ ] Error rate (должна быть < 0.5%)
- [ ] API response times (мониторить p95, p99)
- [ ] User feedback (нет регрессий)

---

## 🚨 RED FLAGS - Когда НЕ мержить PR

❌ TypeScript errors  
❌ Failing tests  
❌ Code coverage падает  
❌ console.log остается в коде  
❌ Lighthouse score < 85  
❌ Security issues найдены  
❌ No tests written  
❌ Hardcoded secrets/passwords  
❌ No code review  
❌ Merge conflicts not resolved properly

---

## ✨ SUMMARY

Этот чек-лист гарантирует:

- ✅ Качественный, maintainable код
- ✅ Хорошее performance
- ✅ Security
- ✅ Легко onboard новых разработчиков
- ✅ Consistent code style
- ✅ Минимум bugs в production
- ✅ Хорошая test coverage
- ✅ Clear commit history

**Время на код review: ~10-15 минут при следовании чек-листу**

**Результат: Confidence в production deployments** 🚀
