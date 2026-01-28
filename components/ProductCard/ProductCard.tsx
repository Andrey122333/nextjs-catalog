'use client';

import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/products';
import { useCart } from '@/lib/cart-context';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleItem, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const handleToggleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem(
      product.id,
      product.name,
      product.price,
      product.images[0],
      product.stockQuantity
    );
  };

  return (
    <Link href={`/catalog/${product.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <div className={styles.imagePlaceholder}>
          {product.images[0] ? product.images[0].split('/').pop()?.split('.')[0] : 'Изображение'}
        </div>
        {product.badge && (
          <span className={`${styles.badge} ${product.badge === 'Хит продаж' ? styles.badgeHit : styles.badgeNew}`}>
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <span className={`${styles.badge} ${styles.badgeUnavailable}`}>
            Нет в наличии
          </span>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>

        <div className={styles.rating}>
          <span className={styles.stars}>★★★★★</span>
          <span className={styles.ratingText}>
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>{formatPrice(product.price)}</div>
          <button
            className={`${styles.addButton} ${inCart ? styles.addButtonInCart : ''}`}
            onClick={handleToggleCart}
            disabled={!product.inStock || product.stockQuantity === 0}
            title={inCart ? 'Удалить из корзины' : 'Добавить в корзину'}
          >
            {inCart ? '✓ В корзине' : 'В корзину'}
          </button>
        </div>
      </div>
    </Link>
  );
}
