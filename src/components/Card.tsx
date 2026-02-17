import Link from 'next/link';
import styles from './Card.module.css';

interface CardProps {
    title: string;
    description: string;
    link: string;
}

export default function Card({ title, description, link }: CardProps) {
    return (
        <Link href={link} className={styles.card}>
            <h2>{title} &rarr;</h2>
            <p>{description}</p>
        </Link>
    );
}
