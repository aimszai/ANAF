"use client";

import { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import styles from './UnitCircle.module.css';

export default function UnitCircle() {
    const [angle, setAngle] = useState(Math.PI / 4); // Start at 45 degrees
    const svgRef = useRef<SVGSVGElement>(null);
    const isDragging = useRef(false);

    // Constants for SVG calculations
    const size = 100;
    const center = size / 2;
    const radius = 40;

    // Calculate coordinates based on angle
    // Note: SVG y-axis is inverted (down is positive), so we subtract for y
    const x = center + radius * Math.cos(angle);
    const y = center - radius * Math.sin(angle);

    // Tan line calculations
    // Tangent line touches at (center + radius, center) i.e. 0 degrees
    // It extends to y height determined by tan(angle)
    // We clamp it to avoid infinite drawing
    const tanHeight = Math.tan(angle) * radius;
    // If angle is effectively 90 or 270, tan is undefined/infinite.
    // We'll hide it or clamp visuals if needed, but simple line to (center+radius, center - tanHeight) works for reasonable values.

    // Interaction handlers
    const handleInteraction = (clientX: number, clientY: number) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate angle from center to mouse
        // Atan2 returns -PI to PI. 
        // -y because screen coordinates y goes down, but math y goes up.
        let newAngle = Math.atan2(-(clientY - centerY), clientX - centerX);

        // Normalize to 0 to 2PI for easier slider handling, but keep Math.atan2 output for calculations if strictly needed.
        if (newAngle < 0) newAngle += 2 * Math.PI;

        setAngle(newAngle);
    };

    const onMouseDown = (e: MouseEvent) => {
        isDragging.current = true;
        handleInteraction(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (isDragging.current) {
            handleInteraction(e.clientX, e.clientY);
        }
    };

    const onMouseUp = () => {
        isDragging.current = false;
    };

    const onTouchStart = (e: TouchEvent) => {
        isDragging.current = true;
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
        if (isDragging.current) {
            handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
        }
    };

    const onTouchEnd = () => {
        isDragging.current = false;
    };

    // Global event listeners for drag release outside component
    useEffect(() => {
        const handleGlobalUp = () => { isDragging.current = false; };
        window.addEventListener('mouseup', handleGlobalUp);
        window.addEventListener('touchend', handleGlobalUp);
        return () => {
            window.removeEventListener('mouseup', handleGlobalUp);
            window.removeEventListener('touchend', handleGlobalUp);
        };
    }, []);

    // Formatting values
    const degrees = (angle * 180 / Math.PI).toFixed(0);
    const sinVal = Math.sin(angle).toFixed(3);
    const cosVal = Math.cos(angle).toFixed(3);
    const tanVal = Math.abs(Math.tan(angle)) > 100 ? '∞' : Math.tan(angle).toFixed(3);

    return (
        <div className={styles.container}>
            <div className={styles.svgContainer}>
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${size} ${size}`}
                    className={styles.svg}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Grid/Axes */}
                    <line x1="0" y1={center} x2={size} y2={center} stroke="#ccc" strokeWidth="0.5" />
                    <line x1={center} y1="0" x2={center} y2={size} stroke="#ccc" strokeWidth="0.5" />

                    {/* Main Circle */}
                    <circle cx={center} cy={center} r={radius} fill="none" stroke="currentColor" strokeWidth="1" />

                    {/* Cosine Line (Blue) - along x-axis */}
                    <line
                        x1={center} y1={center}
                        x2={x} y2={center}
                        stroke="#3b82f6"
                        strokeWidth="2"
                    />

                    {/* Sine Line (Red) - vertical from x-axis to point */}
                    <line
                        x1={x} y1={center}
                        x2={x} y2={y}
                        stroke="#ef4444"
                        strokeWidth="2"
                    />

                    {/* Radius Line */}
                    <line x1={center} y1={center} x2={x} y2={y} stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />

                    {/* Tangent Line (Yellow) - Needs careful handling of quadrants, simple approach: always at x=1 (visual right side) */}
                    {/* A true geometric tangent visualization:
              If using the "tangent to circle at (1,0)" definition:
              Line from (center+radius, center) to (center+radius, center - tanHeight)
              Only valid for -90 < angle < 90 usually, but we can project the line from center through point to intersect x=1 line.
          */}
                    {Math.abs(Math.tan(angle)) < 10 && (
                        // Projection logic: we want to draw the line x=1 (relative to circle).
                        // That is x line at `center + radius`.
                        // The intersection point y is `center - radius * tan(angle)`.
                        // We draw from (center+radius, center) to that intersection.
                        // Note: If angle is in Q2/Q3, the intersection is "behind" used for visual consistency or we flip.
                        // Let's stick to the "project radius" method. 
                        // If cos(angle) is effectively 0, don't draw.
                        Math.abs(Math.cos(angle)) > 0.01 && (
                            <line
                                x1={center + radius}
                                y1={center}
                                x2={center + radius}
                                y2={center - radius * Math.tan(angle)}
                                stroke="#eab308"
                                strokeWidth="2"
                            />
                        )
                    )}

                    {/* Extension line to tangent (dotted) */}
                    {Math.abs(Math.tan(angle)) < 10 && Math.abs(Math.cos(angle)) > 0.01 && (
                        <line
                            x1={center} y1={center}
                            x2={center + radius} y2={center - radius * Math.tan(angle)}
                            stroke="#eab308" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5"
                        />
                    )}

                    {/* The Point */}
                    <circle cx={center + radius * Math.cos(angle)} cy={center - radius * Math.sin(angle)} r="3" fill="currentColor" />

                </svg>
            </div>

            <div className={styles.controls}>
                <div className={styles.sliderContainer}>
                    <label>Angle: {degrees}°</label>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={angle * 180 / Math.PI}
                        onChange={(e) => setAngle(Number(e.target.value) * Math.PI / 180)}
                        className={styles.slider}
                    />
                </div>

                <div className={styles.values}>
                    <div className={`${styles.valueCard} ${styles.sin}`}>
                        <h3>SIN</h3>
                        <p>{sinVal}</p>
                    </div>
                    <div className={`${styles.valueCard} ${styles.cos}`}>
                        <h3>COS</h3>
                        <p>{cosVal}</p>
                    </div>
                    <div className={`${styles.valueCard} ${styles.tan}`}>
                        <h3>TAN</h3>
                        <p>{tanVal}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
