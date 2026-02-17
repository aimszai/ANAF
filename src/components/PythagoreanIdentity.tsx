"use client";

import styles from './PythagoreanIdentity.module.css';

interface PythagoreanIdentityProps {
    angle: number;
}

export default function PythagoreanIdentity({ angle }: PythagoreanIdentityProps) {
    const sinVal = Math.sin(angle);
    const cosVal = Math.cos(angle);

    const sinSq = (sinVal * sinVal).toFixed(3);
    const cosSq = (cosVal * cosVal).toFixed(3);

    // Format standard values for display
    const sinDisplay = sinVal.toFixed(3);
    const cosDisplay = cosVal.toFixed(3);

    return (
        <div className={styles.container}>
            <h2 style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '0.5rem' }}>Pythagorean Identity</h2>

            <div className={styles.formula}>
                <span className={styles.sin}>sin²(θ)</span> + <span className={styles.cos}>cos²(θ)</span> = 1
            </div>

            <div className={styles.substitution}>
                <div className={styles.calculation}>
                    <span>(<span className={styles.sin}>{sinDisplay}</span>)²</span>
                    <span>+</span>
                    <span>(<span className={styles.cos}>{cosDisplay}</span>)²</span>
                    <span>= 1</span>
                </div>

                <div className={styles.calculation} style={{ opacity: 0.7, fontSize: '0.9em' }}>
                    <span className={styles.sin}>{sinSq}</span>
                    <span>+</span>
                    <span className={styles.cos}>{cosSq}</span>
                    <span>≈ 1.000</span>
                </div>
            </div>

            <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem', maxWidth: '300px' }}>
                For any angle θ, the square of the sine plus the square of the cosine always equals 1.
            </p>
        </div>
    );
}
