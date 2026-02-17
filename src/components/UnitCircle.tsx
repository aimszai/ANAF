"use client";

import { useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import styles from './UnitCircle.module.css';

interface UnitCircleProps {
    angle: number;
    onAngleChange: (angle: number) => void;
}

export default function UnitCircle({ angle, onAngleChange }: UnitCircleProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const isDragging = useRef(false);

    // Constants for SVG calculations
    const size = 300; // Increased size for better visibility
    const center = size / 2;
    const radius = 120;

    // Calculate coordinates based on angle
    const x = center + radius * Math.cos(angle);
    const y = center - radius * Math.sin(angle);

    // Interaction handlers
    const handleInteraction = (clientX: number, clientY: number) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate angle from center to mouse
        let newAngle = Math.atan2(-(clientY - centerY), clientX - centerX);

        // Normalize to 0 to 2PI
        if (newAngle < 0) newAngle += 2 * Math.PI;

        onAngleChange(newAngle);
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

    // Global event listeners
    useEffect(() => {
        const handleGlobalUp = () => { isDragging.current = false; };
        const handleGlobalMove = (e: globalThis.MouseEvent) => {
            if (isDragging.current) {
                handleInteraction(e.clientX, e.clientY);
            }
        }

        window.addEventListener('mouseup', handleGlobalUp);
        window.addEventListener('mousemove', handleGlobalMove);
        window.addEventListener('touchend', handleGlobalUp);
        return () => {
            window.removeEventListener('mouseup', handleGlobalUp);
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('touchend', handleGlobalUp);
        };
    }, [onAngleChange]);

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
                    // onMouseMove handled globally for smoother drag
                    // onMouseUp handled globally
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Grid/Axes */}
                    <line x1="0" y1={center} x2={size} y2={center} stroke="#ccc" strokeWidth="1" />
                    <line x1={center} y1="0" x2={center} y2={size} stroke="#ccc" strokeWidth="1" />

                    {/* Main Circle */}
                    <circle cx={center} cy={center} r={radius} fill="none" stroke="currentColor" strokeWidth="1.5" />

                    {/* Cosine Line (Blue) */}
                    <line
                        x1={center} y1={center}
                        x2={x} y2={center}
                        stroke="#3b82f6"
                        strokeWidth="3"
                    />

                    {/* Sine Line (Red) */}
                    <line
                        x1={x} y1={center}
                        x2={x} y2={y}
                        stroke="#ef4444"
                        strokeWidth="3"
                    />

                    {/* Radius Line */}
                    <line x1={center} y1={center} x2={x} y2={y} stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />

                    {/* Tangent Line (Yellow) */}
                    {Math.abs(Math.tan(angle)) < 10 && Math.abs(Math.cos(angle)) > 0.01 && (
                        <line
                            x1={center + radius}
                            y1={center}
                            x2={center + radius}
                            y2={center - radius * Math.tan(angle)}
                            stroke="#eab308"
                            strokeWidth="3"
                        />
                    )}

                    {/* Extension line to tangent (dotted) */}
                    {Math.abs(Math.tan(angle)) < 10 && Math.abs(Math.cos(angle)) > 0.01 && (
                        <line
                            x1={center} y1={center}
                            x2={center + radius} y2={center - radius * Math.tan(angle)}
                            stroke="#eab308" strokeWidth="1" strokeDasharray="3 3" opacity="0.5"
                        />
                    )}

                    {/* The Point */}
                    <circle cx={x} cy={y} r="6" fill="currentColor" cursor="pointer" />

                    {/* Angle Arc */}
                    <path
                        d={`M ${center} ${center} L ${center + 30} ${center} A 30 30 0 ${angle > Math.PI ? 1 : 0} 0 ${center + 30 * Math.cos(angle)} ${center - 30 * Math.sin(angle)} Z`}
                        fill="rgba(100, 100, 100, 0.2)"
                        stroke="currentColor"
                        strokeWidth="1"
                    />
                    <text x={center + 40} y={center - 40} fontSize="14" fill="currentColor">{degrees}°</text>

                </svg>
            </div>

            <div className={styles.controls}>
                <div className={styles.sliderContainer}>
                    <label>Angle: {degrees}° / {(angle / Math.PI).toFixed(2)}π</label>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={angle * 180 / Math.PI}
                        onChange={(e) => onAngleChange(Number(e.target.value) * Math.PI / 180)}
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
