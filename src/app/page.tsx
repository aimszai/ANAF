import Image from 'next/image';
import styles from './page.module.css';
import Card from '@/components/Card';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Analysis Studies</h1>
      </div>

      <div className={styles.grid}>
        <Card
          title="Trigonometry"
          description="Explore advanced trigonometric functions and identities."
          link="/trigonometry"
        />
        {/* Add more topics here */}
      </div>
    </main>
  );
}
