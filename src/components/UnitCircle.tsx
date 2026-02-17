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
    const degreesVal = (angle * 180 / Math.PI).toFixed(1);
    const sinVal = Math.sin(angle).toFixed(3);
    const cosVal = Math.cos(angle).toFixed(3);
    const tanVal = Math.abs(Math.tan(angle)) > 100 ? '∞' : Math.tan(angle).toFixed(3);

    const cotVal = Math.abs(1 / Math.tan(angle)) > 100 ? '∞' : (1 / Math.tan(angle)).toFixed(3);
    const secVal = Math.abs(1 / Math.cos(angle)) > 100 ? '∞' : (1 / Math.cos(angle)).toFixed(3);
    const cscVal = Math.abs(1 / Math.sin(angle)) > 100 ? '∞' : (1 / Math.sin(angle)).toFixed(3);

    // Inverse values (principal values in degrees)
    // For display, we just show the principal value corresponding to the current function value
    // Note: asin/acos/atan return radians.
    const asinDeg = (Math.asin(Math.sin(angle)) * 180 / Math.PI).toFixed(0);
    const acosDeg = (Math.acos(Math.cos(angle)) * 180 / Math.PI).toFixed(0);
    const atanDeg = (Math.atan(Math.tan(angle)) * 180 / Math.PI).toFixed(0);

    return (
        <div className={styles.container}>
            <div className={styles.svgContainer}>
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${size} ${size}`}
                    className={styles.svg}
                    onMouseDown={onMouseDown}
                    // onMouseMove handled globally
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

                    {/* Lines Logic:
              - Sin (Red): Vertical from x-axis to point (x,y)
              - Cos (Blue): Horizontal from center to (x, center)
              - Tan (Yellow): Vertical at x=radius (right edge), extending to meet radial line
              - Cot (Orange): Horizontal at y=radius (top edge), extending to meet radial line
              - Sec (Violet): From center to Tan intersection (on x-axis if we project? No, sec is the hypotenuse of the tan triangle, i.e., from center to x-intercept of tangent line? 
                Actually, geometrically:
                1. Point P at angle theta.
                2. Tangent line at P hits x-axis at (sec, 0) and y-axis at (0, csc).
                3. Tangent vertical at (1,0) hits radial line at (1, tan).
                4. Cotangent horizontal at (0,1) hits radial line at (cot, 1).
          */}

                    {/* Let's implement the Tangent-at-P visualization for Sec/Csc as it's cleaner to see "all lines" */}
                    {/* Tangent Line at Point P (x,y) */}
                    {/* Equation of tangent at (cos, sin) is x*cos + y*sin = 1 (normalized) */}
                    {/* x-intercept (y=0): x = 1/cos = sec */}
                    {/* y-intercept (x=0): y = 1/sin = csc */}

                    {Math.abs(Math.cos(angle)) > 0.01 && Math.abs(Math.sin(angle)) > 0.01 && (
                        <line
                            x1={center + radius * (1 / Math.cos(angle))} y1={center}
                            x2={center} y2={center - radius * (1 / Math.sin(angle))}
                            stroke="#666" strokeWidth="0.5" strokeDasharray="2 2"
                        />
                    )}

                    {/* Secant Line (Violet) - Segment on x-axis from center to sec-intercept */}
                    {Math.abs(Math.cos(angle)) > 0.01 && Math.abs(1 / Math.cos(angle)) < 5 && (
                        <line
                            x1={center} y1={center}
                            x2={center + radius * (1 / Math.cos(angle))} y2={center}
                            stroke="#8b5cf6" strokeWidth="2"
                        />
                    )}

                    {/* Cosecant Line (Emerald) - Segment on y-axis from center to csc-intercept */}
                    {Math.abs(Math.sin(angle)) > 0.01 && Math.abs(1 / Math.sin(angle)) < 5 && (
                        <line
                            x1={center} y1={center}
                            x2={center} y2={center - radius * (1 / Math.sin(angle))}
                            stroke="#10b981" strokeWidth="2"
                        />
                    )}

                    {/* Cotangent Line (Orange) - Segment from (0,1) to (cot, 1) */}
                    {/* Visualized at y=radius (top) for standard "box" view, or using the tangent-at-P intersection to y-axis? 
               Standard "all-in-one" often shows Cot as the line on y=1 (top) meeting the radial line.
               Radial line eq: y = tan(theta) * x.
               Intersection with y=1 (normalized): 1 = tan * x => x = cot. 
               So from (0, radius) to (radius * cot, radius).
            */}
                    {Math.abs(Math.sin(angle)) > 0.01 && Math.abs(1 / Math.tan(angle)) < 5 && (
                        <>
                            {/* Reference line Top (y=1) */}
                            <line x1={0} y1={center - radius} x2={size} y2={center - radius} stroke="#ccc" strokeWidth="0.5" />
                            {/* Cot line */}
                            <line
                                x1={center} y1={center - radius}
                                x2={center + radius * (1 / Math.tan(angle))} y2={center - radius}
                                stroke="#f97316" strokeWidth="2"
                            />
                            {/* Radial extension to Cot */}
                            <line
                                x1={center} y1={center}
                                x2={center + radius * (1 / Math.tan(angle))} y2={center - radius}
                                stroke="#f97316" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5"
                            />
                        </>
                    )}

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
                    <line x1={center} y1={center} x2={x} y2={y} stroke="currentColor" strokeWidth="1.5" />

                    {/* Tangent Line (Yellow) - Vertical at x=1 */}
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
                    <text x={center + 40} y={center - 40} fontSize="14" fill="currentColor">{degreesVal}°</text>

                </svg>
            </div>

            <div className={styles.controls}>
                <div className={styles.sliderContainer}>
                    <label>Angle: {degreesVal}° / {(angle / Math.PI).toFixed(2)}π</label>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={angle * 180 / Math.PI}
                        onChange={(e) => onAngleChange(Number(e.target.value) * Math.PI / 180)}
                        className={styles.slider}
                    />
                </div>

                <div className={styles.sectionTitle}>Basic</div>
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

                <div className={styles.sectionTitle}>Reciprocal</div>
                <div className={styles.values}>
                    <div className={`${styles.valueCard} ${styles.csc}`}>
                        <h3>CSC</h3>
                        <p>{cscVal}</p>
                    </div>
                    <div className={`${styles.valueCard} ${styles.sec}`}>
                        <h3>SEC</h3>
                        <p>{secVal}</p>
                    </div>
                    <div className={`${styles.valueCard} ${styles.cot}`}>
                        <h3>COT</h3>
                        <p>{cotVal}</p>
                    </div>
                </div>

                <div className={styles.sectionTitle}>Inverse (Principal)</div>
                <div className={styles.values}>
                    <div className={`${styles.valueCard} ${styles.inv}`}>
                        <h3>ASIN</h3>
                        <p>{asinDeg}°</p>
                    </div>
                    <div className={`${styles.valueCard} ${styles.inv}`}>
                        <h3>ACOS</h3>
                        <p>{acosDeg}°</p>
                    </div>
                    <div className={`${styles.valueCard} ${styles.inv}`}>
                        <h3>ATAN</h3>
                        <p>{atanDeg}°</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
