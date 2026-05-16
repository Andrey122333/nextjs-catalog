'use client';

import { useCart } from '@/lib/cart-context';
import styles from './product.module.css';

interface AddToCartButtonProps {
  productId: number;
  name: string;
  price: number;
  image: string;
  maxQuantity: number;
  inStock: boolean;
}

export default function AddToCartButton({
  productId,
  name,
  price,
  image,
  maxQuantity,
  inStock,
}: AddToCartButtonProps) {
  const { toggleItem, isInCart } = useCart();
  const inCart = isInCart(productId);

  return (
    <button
      className={`${styles.addButton} ${inCart ? styles.addButtonInCart : ''}`}
      onClick={() => toggleItem(productId, name, price, image, maxQuantity)}
      disabled={!inStock || maxQuantity === 0}
    >
      {inCart ? '✓ В корзине' : 'Добавить в корзину'}
    </button>
  );
}
