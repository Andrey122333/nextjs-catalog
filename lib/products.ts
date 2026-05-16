/**
 * Утилиты для работы с товарами
 */

import { Product, FilterState, FilterOptions, CategoryInfo, BrandInfo } from './types';
import productsData from '../data/products.json';

const products = productsData as unknown as Product[];

/**
 * Получить все товары
 */
export function getAllProducts(): Product[] {
  return products;
}

/**
 * Получить товар по ID
 */
export function getProductById(id: number): Product | undefined {
  return products.find(p => p.id === id);
}

/**
 * Получить товар по slug
 */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

/**
 * Фильтрация и сортировка товаров
 */
export function filterProducts(filters: Partial<FilterState>): Product[] {
  let filtered = [...products];

  // Фильтр по категориям
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(p => filters.categories!.includes(p.category));
  }

  // Фильтр по цене
  if (filters.priceMin !== undefined) {
    filtered = filtered.filter(p => p.price >= filters.priceMin!);
  }
  if (filters.priceMax !== undefined) {
    filtered = filtered.filter(p => p.price <= filters.priceMax!);
  }

  // Фильтр по брендам
  if (filters.brands && filters.brands.length > 0) {
    filtered = filtered.filter(p => {
      const brandId = p.brand.toLowerCase().replace(/\s+/g, '-');
      return filters.brands!.includes(brandId);
    });
  }

  // Фильтр по наличию
  if (filters.availability === 'in_stock') {
    filtered = filtered.filter(p => p.inStock && p.stockQuantity > 0);
  } else if (filters.availability === 'out_of_stock') {
    filtered = filtered.filter(p => !p.inStock || p.stockQuantity === 0);
  }

  // Поиск
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.fullDescription.toLowerCase().includes(searchLower)
    );
  }

  // Сортировка
  switch (filters.sort) {
    case 'price_asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name_asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
      break;
    case 'name_desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name, 'ru'));
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    default:
      // По умолчанию: сначала хиты, потом новинки, потом остальные
      filtered.sort((a, b) => {
        if (a.badge === 'Хит продаж' && b.badge !== 'Хит продаж') return -1;
        if (a.badge !== 'Хит продаж' && b.badge === 'Хит продаж') return 1;
        if (a.badge === 'Новинка' && b.badge !== 'Новинка') return -1;
        if (a.badge !== 'Новинка' && b.badge === 'Новинка') return 1;
        return 0;
      });
  }

  return filtered;
}

/**
 * Пагинация товаров
 */
export function paginateProducts(products: Product[], page: number = 1, perPage: number = 12) {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  
  return {
    products: products.slice(start, end),
    currentPage: page,
    totalPages: Math.ceil(products.length / perPage),
    totalCount: products.length,
    hasNextPage: end < products.length,
    hasPrevPage: page > 1,
  };
}

/**
 * Получить опции для фильтров
 */
export function getFilterOptions(): FilterOptions {
  // Подсчет товаров по категориям
  const categoryMap = new Map<string, CategoryInfo>();
  products.forEach(p => {
    const existing = categoryMap.get(p.category);
    if (existing) {
      existing.count++;
    } else {
      categoryMap.set(p.category, {
        id: p.category,
        name: p.categoryName,
        count: 1,
      });
    }
  });

  // Подсчет товаров по брендам
  const brandMap = new Map<string, BrandInfo>();
  products.forEach(p => {
    const existing = brandMap.get(p.brand);
    if (existing) {
      existing.count++;
    } else {
      brandMap.set(p.brand, {
        id: p.brand.toLowerCase().replace(/\s+/g, '-'),
        name: p.brand,
        count: 1,
      });
    }
  });

  // Диапазон цен
  const prices = products.map(p => p.price);
  const priceRange = {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };

  return {
    categories: Array.from(categoryMap.values()),
    brands: Array.from(brandMap.values()).sort((a, b) => a.name.localeCompare(b.name, 'ru')),
    priceRange,
  };
}

/**
 * Получить похожие товары (той же категории, исключая текущий)
 */
export function getSimilarProducts(productId: number, limit: number = 4): Product[] {
  const product = getProductById(productId);
  if (!product) return [];

  return products
    .filter(p => p.id !== productId && p.category === product.category)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/**
 * Поиск товаров для автозаполнения
 */
export function searchProducts(query: string, limit: number = 5): Product[] {
  if (!query || query.length < 2) return [];

  const searchLower = query.toLowerCase();
  return products
    .filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    )
    .slice(0, limit);
}

/**
 * Форматирование цены
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString('ru-RU')}₽`;
}

/**
 * Получить статус наличия товара
 */
export function getStockStatus(product: Product): {
  status: 'available' | 'limited' | 'preorder' | 'unavailable';
  text: string;
  color: string;
} {
  if (!product.inStock || product.stockQuantity === 0) {
    return {
      status: 'unavailable',
      text: 'Нет в наличии',
      color: 'error',
    };
  }

  if (product.stockQuantity <= 3) {
    return {
      status: 'limited',
      text: `Осталось ${product.stockQuantity} шт.`,
      color: 'warning',
    };
  }

  return {
    status: 'available',
    text: 'В наличии',
    color: 'success',
  };
}
