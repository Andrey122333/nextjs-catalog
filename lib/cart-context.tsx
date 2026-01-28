'use client';

/**
 * Контекст корзины для управления состоянием покупок
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Cart, CartItem } from './types';

interface CartContextType {
  cart: Cart;
  addToCart: (productId: number, name: string, price: number, image: string, maxQuantity: number, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleItem: (productId: number, name: string, price: number, image: string, maxQuantity: number) => void;
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'kod-i-kofe-cart';

/**
 * Вычислить итоговые значения корзины
 */
function calculateCart(items: CartItem[]): Cart {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    items,
    total,
    itemCount,
  };
}

/**
 * Загрузить корзину из LocalStorage
 */
function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Ошибка загрузки корзины:', error);
  }
  
  return [];
}

/**
 * Сохранить корзину в LocalStorage
 */
function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Ошибка сохранения корзины:', error);
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Загрузка корзины при монтировании (только на клиенте)
  useEffect(() => {
    const loadedItems = loadCartFromStorage();
    setItems(loadedItems);
    setIsInitialized(true);
  }, []);

  // Сохранение корзины при изменении (только после инициализации)
  useEffect(() => {
    if (isInitialized) {
      saveCartToStorage(items);
    }
  }, [items, isInitialized]);

  const cart = calculateCart(items);

  /**
   * Добавить товар в корзину
   */
  const addToCart = (
    productId: number,
    name: string,
    price: number,
    image: string,
    maxQuantity: number,
    quantity: number = 1
  ) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      
      if (existingItem) {
        // Товар уже в корзине - увеличиваем количество
        return prevItems.map(item =>
          item.id === productId
            ? { 
                ...item, 
                quantity: Math.min(item.quantity + quantity, maxQuantity) 
              }
            : item
        );
      } else {
        // Добавляем новый товар
        return [
          ...prevItems,
          {
            id: productId,
            name,
            price,
            quantity: Math.min(quantity, maxQuantity),
            image,
            maxQuantity,
          },
        ];
      }
    });
  };

  /**
   * Удалить товар из корзины
   */
  const removeFromCart = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  /**
   * Обновить количество товара
   */
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
          : item
      )
    );
  };

  /**
   * Очистить корзину
   */
  const clearCart = () => {
    setItems([]);
  };

  /**
   * Toggle товар в корзине (добавить или удалить)
   */
  const toggleItem = (
    productId: number,
    name: string,
    price: number,
    image: string,
    maxQuantity: number
  ) => {
    if (isInCart(productId)) {
      removeFromCart(productId);
    } else {
      addToCart(productId, name, price, image, maxQuantity, 1);
    }
  };

  /**
   * Проверить, есть ли товар в корзине
   */
  const isInCart = (productId: number): boolean => {
    return items.some(item => item.id === productId);
  };

  /**
   * Получить количество товара в корзине
   */
  const getItemQuantity = (productId: number): number => {
    const item = items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleItem,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * Хук для использования корзины
 */
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }
  return context;
}
