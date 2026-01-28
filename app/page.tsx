/**
 * Главная страница - редирект на /catalog
 */

import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/catalog');
}
