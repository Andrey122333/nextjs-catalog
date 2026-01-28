/**
 * Страница каталога товаров (SSR)
 */

import { filterProducts, paginateProducts, getFilterOptions } from '@/lib/products';
import { FilterState } from '@/lib/types';
import ProductCard from '@/components/ProductCard/ProductCard';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Filters from '@/components/Filters/Filters';
import Sort from '@/components/Sort/Sort';
import styles from './catalog.module.css';

interface CatalogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata = {
  title: 'Каталог товаров',
  description: 'Интернет-магазин товаров для разработчиков: кофе, аксессуары, гаджеты и книги.',
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  
  // Парсинг параметров фильтрации из URL
  const filters: Partial<FilterState> = {
    categories: params.category 
      ? (Array.isArray(params.category) ? params.category : [params.category])
      : [],
    priceMin: params.price_min ? Number(params.price_min) : undefined,
    priceMax: params.price_max ? Number(params.price_max) : undefined,
    brands: params.brand
      ? (Array.isArray(params.brand) ? params.brand : [params.brand])
      : [],
    availability: (params.availability as FilterState['availability']) || 'all',
    sort: (params.sort as FilterState['sort']) || 'default',
    search: params.search as string || '',
  };

  const page = params.page ? Number(params.page) : 1;

  // Фильтрация и пагинация
  const filteredProducts = filterProducts(filters);
  const paginatedData = paginateProducts(filteredProducts, page, 12);
  const filterOptions = getFilterOptions();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.hero}>
            <h1>Каталог товаров для разработчиков</h1>
            <p>Всё необходимое для продуктивной работы</p>
            <div className={styles.productCount}>
              В наличии: {filteredProducts.length} {filteredProducts.length === 1 ? 'товар' : filteredProducts.length < 5 ? 'товара' : 'товаров'}
            </div>
          </section>

          <div className={styles.catalogLayout}>
            {/* Фильтры */}
            <Filters filterOptions={filterOptions} />

            <div className={styles.content}>
              {/* Сортировка */}
              <div className={styles.toolbar}>
                <Sort />
                <div className={styles.count}>Всего: {filteredProducts.length}</div>
              </div>

              {/* Сетка товаров */}
              {paginatedData.products.length > 0 ? (
                <>
                  <div className={styles.productGrid}>
                    {paginatedData.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Пагинация */}
                  {paginatedData.totalPages > 1 && (
                    <div className={styles.pagination}>
                      {paginatedData.hasPrevPage && (
                        <a href={`/catalog?page=${page - 1}`}>← Предыдущая</a>
                      )}
                      <span>Страница {page} из {paginatedData.totalPages}</span>
                      {paginatedData.hasNextPage && (
                        <a href={`/catalog?page=${page + 1}`}>Следующая →</a>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.noProducts}>
                  <p>Товары не найдены</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
