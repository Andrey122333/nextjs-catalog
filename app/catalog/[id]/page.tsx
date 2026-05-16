import { getProductById, getSimilarProducts, formatPrice, getStockStatus } from '@/lib/products';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProductCard from '@/components/ProductCard/ProductCard';
import AddToCartButton from './AddToCartButton';
import styles from './product.module.css';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product) return { title: 'Товар не найден' };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(Number(id));

  if (!product) notFound();

  const similarProducts = getSimilarProducts(product.id, 4);
  const stockStatus = getStockStatus(product);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <nav className={styles.breadcrumbs}>
            <Link href="/catalog">Каталог</Link>
            <span>/</span>
            <Link href={`/catalog?category=${product.category}`}>{product.categoryName}</Link>
            <span>/</span>
            <span>{product.name}</span>
          </nav>

          <div className={styles.productLayout}>
            <div className={styles.imageSection}>
              <div className={styles.mainImage}>
                {product.images[0] ? product.images[0].split('/').pop()?.split('.')[0] : 'Изображение'}
              </div>
            </div>

            <div className={styles.infoSection}>
              <h1>{product.name}</h1>
              <div className={styles.meta}>
                <span className={styles.article}>Артикул: #{product.id}</span>
                <div className={styles.rating}>
                  ★★★★★ {product.rating} ({product.reviewCount} отзывов)
                </div>
              </div>

              <div className={styles.price}>{formatPrice(product.price)}</div>

              <div className={`${styles.stock} ${styles[`stock-${stockStatus.status}`]}`}>
                {stockStatus.text}
              </div>

              <div className={styles.actions}>
                <AddToCartButton
                  productId={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.images[0]}
                  maxQuantity={product.stockQuantity}
                  inStock={product.inStock}
                />
              </div>

              <div className={styles.description}>
                <h2>Описание</h2>
                <p>{product.fullDescription}</p>
              </div>

              <div className={styles.specs}>
                <h2>Характеристики</h2>
                <table>
                  <tbody>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {similarProducts.length > 0 && (
            <section className={styles.similar}>
              <h2>Вам может понравиться</h2>
              <div className={styles.similarGrid}>
                {similarProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
