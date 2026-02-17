import UnitCircle from '@/components/UnitCircle';

export default function Trigonometry() {
    return (
        <div style={{
            padding: '4rem 2rem',
            maxWidth: '800px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
        }}>
            <div>
                <h1 style={{ marginBottom: '1rem' }}>Trigonometry</h1>
                <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
                    The Unit Circle is a circle with a radius of 1, centered at the origin (0,0).
                    It is a fundamental tool in trigonometry for defining sine, cosine, and tangent functions
                    for all real numbers.
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <UnitCircle />
            </div>

            <div style={{
                background: 'rgba(var(--foreground), 0.03)',
                padding: '1.5rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                lineHeight: '1.6'
            }}>
                <h3>Key Concepts</h3>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li>
                        <strong style={{ color: '#ef4444' }}>Sine (sin)</strong>: The y-coordinate of the point on the unit circle.
                    </li>
                    <li>
                        <strong style={{ color: '#3b82f6' }}>Cosine (cos)</strong>: The x-coordinate of the point on the unit circle.
                    </li>
                    <li>
                        <strong style={{ color: '#eab308' }}>Tangent (tan)</strong>: The length of the segment on the tangent line (x=1).
                        Equivalent to sin/cos.
                    </li>
                </ul>
            </div>
        </div>
    );
}
