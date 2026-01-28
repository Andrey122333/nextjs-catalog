'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import styles from './Header.module.css';

export default function Header() {
  const { cart } = useCart();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/catalog" className={styles.logo}>
          <span className={styles.logoIcon}>☕</span>
          <span className={styles.logoText}>Код и Кофе</span>
        </Link>
        
        <nav className={styles.nav}>
          <Link href="/catalog">Каталог</Link>
          <Link href="/about">О нас</Link>
          <Link href="/contacts">Контакты</Link>
        </nav>

        <div className={styles.actions}>
          <button className={styles.cartButton} aria-label="Корзина">
            🛒
            {cart.itemCount > 0 && (
              <span className={styles.cartBadge}>{cart.itemCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
