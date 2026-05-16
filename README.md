# Next.js Каталог "Код и Кофе"

Интернет-магазин товаров для разработчиков на Next.js 16 с App Router и Server Components.

## Технологии

- **Next.js:** 16.2.6
- **React:** 19.2.6
- **TypeScript:** 6.0.3
- **CSS Modules** для стилизации
- **Turbopack** для сборки
- **Server Components** для SSR
- **Client Components** для интерактивности

## Docker

```bash
docker build -t nextjs-catalog .
docker run -p 3000:3000 nextjs-catalog
```
Приложение будет доступно по адресу: http://localhost:3000

## Структура проекта

```
nextjs-catalog/
├── app/
│   ├── globals.css             # Глобальные стили (единая дизайн-система)
│   ├── layout.tsx              # Root Layout с CartProvider
│   ├── page.tsx                # Редирект на /catalog
│   └── catalog/
│       ├── catalog.module.css
│       ├── page.tsx            # Страница каталога (Server Component)
│       └── [id]/
│           ├── product.module.css
│           ├── page.tsx        # Детальная страница (Server Component)
│           └── AddToCartButton.tsx  # Кнопка корзины (Client Component)
├── components/
│   ├── Filters/                # Панель фильтров (Client Component)
│   ├── Footer/                 # Подвал
│   ├── Header/                 # Шапка с корзиной (Client Component)
│   ├── ProductCard/            # Карточка товара (Client Component)
│   └── Sort/                   # Сортировка (Client Component)
├── lib/
│   ├── cart-context.tsx        # React Context для корзины
│   ├── products.ts             # Утилиты и фильтрация товаров
│   └── types.ts                # TypeScript типы
├── data/
│   └── products.json           # База товаров
├── next.config.js
└── tsconfig.json
```

## Настройка переменных и обновление репозитория

Для корректной работы автоматизированного процесса сборки и развертывания необходимо добавить переменные в репозиторий GitHub и выполнить обновление проекта.

### Добавление переменных репозитория

В интерфейсе GitHub открыть:

```
Settings → Actions secrets and variables → Variables
```

Добавить две переменные:

- **REGISTRY** — адрес контейнерного реестра (например, `ghcr.io`)
- **IMAGE_NAME** — имя Docker‑образа, используемое в процессе сборки

Эти параметры позволяют workflow корректно формировать и публиковать контейнер приложения.

---

### Обновление репозитория

После добавления переменных необходимо зафиксировать изменения в проекте и отправить их в основную ветку:

```bash
git add .
git commit -m "Добавлены переменные для CI/CD"
git push origin main
```

После отправки изменений GitHub автоматически запускает настроенный workflow, который выполняет сборку и публикацию образа, а также обновляет развернутое приложение.
