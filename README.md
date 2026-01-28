# Next.js Каталог "Код и Кофе"

Интернет-магазин товаров для разработчиков на Next.js 15 с App Router и Server Components.

## Технологии

- **Next.js:** 15.1.0
- **React:** 19.0.0
- **TypeScript:** 5.3.3
- **CSS Modules** для стилизации
- **Server Components** для SSR
- **Client Components** для интерактивности

## Установка

```bash
npm install
```

## Разработка

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3010

## Production сборка

```bash
npm run build
npm start
```

## Docker

```bash
# Сборка
docker build -t nextjs-catalog .

# Запуск
docker run -p 3010:3010 nextjs-catalog
```

Или используйте docker-compose в корне проекта:

```bash
cd ..
docker-compose up nextjs-catalog
```

## Структура проекта

```
nextjs-catalog/
├── app/
│   ├── layout.tsx          # Root Layout с CartProvider
│   ├── page.tsx            # Редирект на /catalog
│   ├── globals.css         # Глобальные стили
│   └── catalog/
│       ├── page.tsx        # Страница каталога (SSR)
│       └── [id]/
│           └── page.tsx    # Детальная страница товара (SSR)
├── components/
│   ├── Header/             # Шапка сайта
│   ├── Footer/             # Подвал
│   └── ProductCard/        # Карточка товара
├── lib/
│   ├── types.ts            # TypeScript типы
│   ├── products.ts         # Утилиты для работы с товарами
│   └── cart-context.tsx    # Context API для корзины
└── data/
    └── products.json       # Данные товаров (24 шт.)
```

## Особенности реализации

### Server-Side Rendering

Все страницы рендерятся на сервере:
- `/catalog` - список товаров с фильтрацией
- `/catalog/[id]` - детальная страница товара

### Client-Side интерактивность

- Корзина (React Context + LocalStorage)
- Добавление товаров в корзину
- Счётчик товаров в header

### Оптимизация производительности

- **Standalone output** для уменьшения размера Docker образа
- **Lazy loading** изображений
- **CSS Modules** для изоляции стилей
- **Type-safe** с TypeScript strict mode

