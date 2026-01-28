'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FilterState } from '@/lib/types';
import styles from './Sort.module.css';

export default function Sort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'default';

  const handleSortChange = (value: FilterState['sort']) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'default') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <div className={styles.sort}>
      <label htmlFor="sort">Сортировка:</label>
      <select
        id="sort"
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value as FilterState['sort'])}
        className={styles.select}
      >
        <option value="default">По умолчанию</option>
        <option value="price_asc">Цена: по возрастанию</option>
        <option value="price_desc">Цена: по убыванию</option>
        <option value="name_asc">Название: А-Я</option>
        <option value="name_desc">Название: Я-А</option>
        <option value="rating">По рейтингу</option>
      </select>
    </div>
  );
}
