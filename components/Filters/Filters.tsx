'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FilterOptions } from '@/lib/types';
import { formatPrice } from '@/lib/products';
import styles from './Filters.module.css';

interface FiltersProps {
  filterOptions: FilterOptions;
}

export default function Filters({ filterOptions }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<number>(filterOptions.priceRange.min);
  const [priceMax, setPriceMax] = useState<number>(filterOptions.priceRange.max);
  const [availability, setAvailability] = useState<string>('all');

  // Инициализация из URL
  useEffect(() => {
    const categories = searchParams.getAll('category');
    const brands = searchParams.getAll('brand');
    const minPrice = searchParams.get('price_min');
    const maxPrice = searchParams.get('price_max');
    const avail = searchParams.get('availability');

    if (categories.length > 0) setSelectedCategories(categories);
    if (brands.length > 0) setSelectedBrands(brands);
    if (minPrice) setPriceMin(Number(minPrice));
    if (maxPrice) setPriceMax(Number(maxPrice));
    if (avail) setAvailability(avail);
  }, [searchParams]);

  // Автоматическое применение фильтров при изменении
  useEffect(() => {
    const params = new URLSearchParams();

    selectedCategories.forEach(cat => params.append('category', cat));
    selectedBrands.forEach(brand => params.append('brand', brand));

    if (priceMin > filterOptions.priceRange.min) {
      params.set('price_min', priceMin.toString());
    }
    if (priceMax < filterOptions.priceRange.max) {
      params.set('price_max', priceMax.toString());
    }
    if (availability !== 'all') {
      params.set('availability', availability);
    }

    const sort = searchParams.get('sort');
    if (sort) params.set('sort', sort);

    const newUrl = `/catalog?${params.toString()}`;
    const currentUrl = `/catalog?${searchParams.toString()}`;
    
    if (newUrl !== currentUrl) {
      router.push(newUrl);
    }
  }, [selectedCategories, selectedBrands, priceMin, priceMax, availability]);

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceMin(filterOptions.priceRange.min);
    setPriceMax(filterOptions.priceRange.max);
    setAvailability('all');
    router.push('/catalog');
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
  };

  return (
    <aside className={styles.filters}>
      <div className={styles.filterHeader}>
        <h3>Фильтры</h3>
        <button onClick={resetFilters} className={styles.resetButton}>
          Сбросить
        </button>
      </div>

      {/* Категории */}
      <div className={styles.filterSection}>
        <h4>Категории</h4>
        {filterOptions.categories.map((cat) => (
          <label key={cat.id} className={styles.checkbox}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat.id)}
              onChange={() => toggleCategory(cat.id)}
            />
            <span>{cat.name}</span>
            <span className={styles.count}>({cat.count})</span>
          </label>
        ))}
      </div>

      {/* Цена */}
      <div className={styles.filterSection}>
        <h4>Цена</h4>
        <div className={styles.priceInputs}>
          <div className={styles.priceInput}>
            <label>От</label>
            <input
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(Number(e.target.value))}
              min={filterOptions.priceRange.min}
              max={priceMax}
            />
          </div>
          <div className={styles.priceInput}>
            <label>До</label>
            <input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              min={priceMin}
              max={filterOptions.priceRange.max}
            />
          </div>
        </div>
        <div className={styles.priceRange}>
          <input
            type="range"
            min={filterOptions.priceRange.min}
            max={filterOptions.priceRange.max}
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className={styles.rangeSlider}
          />
        </div>
        <div className={styles.priceLabels}>
          <span>{formatPrice(filterOptions.priceRange.min)}</span>
          <span>{formatPrice(filterOptions.priceRange.max)}</span>
        </div>
      </div>

      {/* Бренды */}
      <div className={styles.filterSection}>
        <h4>Бренд</h4>
        {filterOptions.brands.map((brand) => (
          <label key={brand.id} className={styles.checkbox}>
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand.id)}
              onChange={() => toggleBrand(brand.id)}
            />
            <span>{brand.name}</span>
            <span className={styles.count}>({brand.count})</span>
          </label>
        ))}
      </div>

      {/* Наличие */}
      <div className={styles.filterSection}>
        <h4>Наличие</h4>
        <label className={styles.radio}>
          <input
            type="radio"
            checked={availability === 'all'}
            onChange={() => setAvailability('all')}
          />
          <span>Все товары</span>
        </label>
        <label className={styles.radio}>
          <input
            type="radio"
            checked={availability === 'in_stock'}
            onChange={() => setAvailability('in_stock')}
          />
          <span>В наличии</span>
        </label>
        <label className={styles.radio}>
          <input
            type="radio"
            checked={availability === 'out_of_stock'}
            onChange={() => setAvailability('out_of_stock')}
          />
          <span>Нет в наличии</span>
        </label>
      </div>
    </aside>
  );
}
