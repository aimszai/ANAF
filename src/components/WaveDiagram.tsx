"use client";

import styles from './WaveDiagram.module.css';

interface WaveDiagramProps {
    angle: number; // in radians
}

export default function WaveDiagram({ angle }: WaveDiagramProps) {
    const width = 600;
    const height = 200;
    const padding = 20;

    // Plotting area
    const plotWidth = width - padding * 2;
    const plotHeight = height - padding * 2;
    const centerY = height / 2;

    // Scale factor (amplitude 1 = 80px)
    const amplitudeScale = plotHeight / 2.5;

    // Generate paths
    // x: 0 to 2PI maps to 0 to plotWidth
    const points = 100;

    const generatePath = (func: (x: number) => number) => {
        let d = "";
        for (let i = 0; i <= points; i++) {
            const t = (i / points) * 2 * Math.PI;
            const x = padding + (i / points) * plotWidth;
            // SVG y is down, so we invert func result
            const val = func(t);
            // Clamp for Tan to avoid huge spikes
            const clampedVal = Math.max(-1.5, Math.min(1.5, val));

            // If we clamped, we might want to break the path to avoid drawing vertical lines for asymptotes
            // For simplicity in this version, we'll just draw.
            const y = centerY - clampedVal * amplitudeScale;

            if (i === 0) d += `M ${x} ${y}`;
            else d += ` L ${x} ${y}`;
        }
        return d;
    };

    const sinPath = generatePath(Math.sin);
    const cosPath = generatePath(Math.cos);

    // Tan needs special handling / multiple paths to avoid connecting asymptotes
    // But for now, let's just stick to sin/cos as primary, and maybe tan if requested explicitly or handle carefully.
    // The user asked for "sin, cos, etc."
    // Let's draw tan but break it at asymptotes (PI/2, 3PI/2)
    const generateTanPath = () => {
        let d = "";
        let isDrawing = false;
        for (let i = 0; i <= points; i++) {
            const t = (i / points) * 2 * Math.PI;
            const x = padding + (i / points) * plotWidth;
            const val = Math.tan(t);

            if (Math.abs(val) > 3) {
                isDrawing = false;
                continue;
            }

            const y = centerY - val * amplitudeScale;

            if (!isDrawing) {
                d += ` M ${x} ${y}`;
                isDrawing = true;
            } else {
                d += ` L ${x} ${y}`;
            }
        }
        return d;
    }
    const tanPath = generateTanPath();


    // Current indicator
    // Normalize angle to [0, 2PI) for display on graph (which usually shows one period)
    let normalizedAngle = angle % (2 * Math.PI);
    if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;

    const currentX = padding + (normalizedAngle / (2 * Math.PI)) * plotWidth;

    // Intersection points
    const sinY = centerY - Math.sin(angle) * amplitudeScale;
    const cosY = centerY - Math.cos(angle) * amplitudeScale;
    const tanVal = Math.tan(angle);
    const tanY = Math.abs(tanVal) > 3 ? null : centerY - tanVal * amplitudeScale;

    return (
        <div className={styles.container}>
            <div className={styles.svgContainer}>
                <svg viewBox={`0 0 ${width} ${height}`} className={styles.svg} preserveAspectRatio="none">
                    {/* Axes */}
                    <line x1={padding} y1={centerY} x2={width - padding} y2={centerY} stroke="#ccc" strokeWidth="1" />
                    <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#ccc" strokeWidth="1" />

                    {/* Labels 0, PI, 2PI */}
                    <text x={padding} y={centerY + 20} fontSize="12" fill="#999" textAnchor="middle">0 (0°)</text>
                    <text x={padding + plotWidth / 2} y={centerY + 20} fontSize="12" fill="#999" textAnchor="middle">π (180°)</text>
                    <text x={width - padding} y={centerY + 20} fontSize="12" fill="#999" textAnchor="middle">2π (360°)</text>

                    {/* Paths */}
                    <path d={tanPath} stroke="#eab308" strokeWidth="1.5" fill="none" strokeDasharray="4 4" opacity="0.6" />
                    <path d={sinPath} stroke="#ef4444" strokeWidth="2" fill="none" />
                    <path d={cosPath} stroke="#3b82f6" strokeWidth="2" fill="none" />

                    {/* Current Angle Line */}
                    <line x1={currentX} y1={padding} x2={currentX} y2={height - padding} stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />

                    {/* Intersection Dots */}
                    <circle cx={currentX} cy={sinY} r="4" fill="#ef4444" />
                    <circle cx={currentX} cy={cosY} r="4" fill="#3b82f6" />
                    {tanY !== null && <circle cx={currentX} cy={tanY} r="3" fill="#eab308" />}
                </svg>
            </div>

            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <div className={styles.dot} style={{ background: '#ef4444' }} />
                    <span>sin(x)</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.dot} style={{ background: '#3b82f6' }} />
                    <span>cos(x)</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.dot} style={{ background: '#eab308' }} />
                    <span>tan(x)</span>
                </div>
            </div>
        </div>
    );
}
