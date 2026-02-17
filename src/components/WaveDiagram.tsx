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

    // Helper for discontinuous paths (tan, sec, csc, cot)
    const generateDiscontinuousPath = (func: (x: number) => number) => {
        let d = "";
        let isDrawing = false;
        for (let i = 0; i <= points; i++) {
            const t = (i / points) * 2 * Math.PI;
            const x = padding + (i / points) * plotWidth;
            const val = func(t);

            // Check for undefined or asymptotic values
            if (!isFinite(val) || Math.abs(val) > 3) {
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

    const tanPath = generateDiscontinuousPath(Math.tan);
    const cotPath = generateDiscontinuousPath((x) => 1 / Math.tan(x));
    const secPath = generateDiscontinuousPath((x) => 1 / Math.cos(x));
    const cscPath = generateDiscontinuousPath((x) => 1 / Math.sin(x));


    // Current indicator
    // Normalize angle to [0, 2PI) for display on graph (which usually shows one period)
    let normalizedAngle = angle % (2 * Math.PI);
    if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;

    const currentX = padding + (normalizedAngle / (2 * Math.PI)) * plotWidth;

    // Intersection points
    const sinY = centerY - Math.sin(angle) * amplitudeScale;
    const cosY = centerY - Math.cos(angle) * amplitudeScale;

    const getPointY = (val: number) => Math.abs(val) > 3 ? null : centerY - val * amplitudeScale;

    const tanY = getPointY(Math.tan(angle));
    const cotY = getPointY(1 / Math.tan(angle));
    const secY = getPointY(1 / Math.cos(angle));
    const cscY = getPointY(1 / Math.sin(angle));

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

                    {/* Secondary Paths (Dashed/Thinner) */}
                    <path d={secPath} stroke="#8b5cf6" strokeWidth="1.5" fill="none" strokeDasharray="4 4" opacity="0.6" />
                    <path d={cscPath} stroke="#10b981" strokeWidth="1.5" fill="none" strokeDasharray="4 4" opacity="0.6" />
                    <path d={cotPath} stroke="#f97316" strokeWidth="1.5" fill="none" strokeDasharray="4 4" opacity="0.6" />
                    <path d={tanPath} stroke="#eab308" strokeWidth="1.5" fill="none" strokeDasharray="4 4" opacity="0.6" />

                    {/* Primary Paths */}
                    <path d={sinPath} stroke="#ef4444" strokeWidth="2" fill="none" />
                    <path d={cosPath} stroke="#3b82f6" strokeWidth="2" fill="none" />

                    {/* Current Angle Line */}
                    <line x1={currentX} y1={padding} x2={currentX} y2={height - padding} stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />

                    {/* Intersection Dots */}
                    {secY !== null && <circle cx={currentX} cy={secY} r="3" fill="#8b5cf6" />}
                    {cscY !== null && <circle cx={currentX} cy={cscY} r="3" fill="#10b981" />}
                    {cotY !== null && <circle cx={currentX} cy={cotY} r="3" fill="#f97316" />}
                    {tanY !== null && <circle cx={currentX} cy={tanY} r="3" fill="#eab308" />}

                    <circle cx={currentX} cy={sinY} r="4" fill="#ef4444" />
                    <circle cx={currentX} cy={cosY} r="4" fill="#3b82f6" />
                </svg>
            </div>

            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <div className={styles.dot} style={{ background: '#ef4444' }} />
                    <span>sin</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.dot} style={{ background: '#3b82f6' }} />
                    <span>cos</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.dot} style={{ background: '#eab308' }} />
                    <span>tan</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.dot} style={{ background: '#10b981' }} />
                    <span>csc</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.dot} style={{ background: '#8b5cf6' }} />
                    <span>sec</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.dot} style={{ background: '#f97316' }} />
                    <span>cot</span>
                </div>
            </div>
        </div>
    );
}
