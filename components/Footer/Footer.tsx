import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.links}>
          <a href="/about">О магазине</a>
          <a href="/delivery">Доставка</a>
          <a href="/return">Возврат</a>
          <a href="/contacts">Контакты</a>
        </div>
        <div className={styles.schedule}>
          Режим работы: Пн-Пт 9:00-21:00, Сб-Вс 10:00-20:00
        </div>
        <div className={styles.copyright}>
          © 2026 Код и Кофе. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
