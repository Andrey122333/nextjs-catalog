import { filterProducts, getFilterOptions } from '@/lib/products';
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
    search: (params.search as string) || '',
  };

  const products = filterProducts(filters);
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
              В наличии: {products.length} товаров
            </div>
          </section>

          <div className={styles.catalogLayout}>
            <Filters filterOptions={filterOptions} />

            <div className={styles.content}>
              <div className={styles.toolbar}>
                <Sort />
                <div className={styles.count}>Всего: {products.length}</div>
              </div>

              {products.length > 0 ? (
                <div className={styles.productGrid}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
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
