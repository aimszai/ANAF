"use client";

import { useState } from 'react';
import UnitCircle from '@/components/UnitCircle';
import WaveDiagram from '@/components/WaveDiagram';

export default function Trigonometry() {
    const [angle, setAngle] = useState(Math.PI / 4);

    return (
        <div style={{
            padding: '4rem 2rem',
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '3rem'
        }}>
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ marginBottom: '1rem' }}>Trigonometry Explorer</h1>
                <p style={{ opacity: 0.8, lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>
                    Interact with the Unit Circle to see how Sine, Cosine, and Tangent relate to the angle.
                    Watch the wave diagram update in real-time.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem',
                alignItems: 'start'
            }}>
                {/* Unit Circle Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.2rem', opacity: 0.9 }}>Unit Circle</h2>
                    <UnitCircle angle={angle} onAngleChange={setAngle} />
                </div>

                {/* Wave Diagram Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.2rem', opacity: 0.9 }}>Wave Function</h2>
                    <div style={{ width: '100%' }}>
                        <WaveDiagram angle={angle} />
                    </div>
                    <p style={{ fontSize: '0.9rem', opacity: 0.7, textAlign: 'center', maxWidth: '400px' }}>
                        The x-axis represents the angle in radians (and degrees). The y-axis shows the value of the trigonometric function.
                    </p>
                </div>
            </div>

            <div style={{
                background: 'rgba(var(--foreground), 0.03)',
                padding: '2rem',
                borderRadius: '12px',
                fontSize: '0.95rem',
                lineHeight: '1.7'
            }}>
                <h3>Understanding the Connections</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
                    <div>
                        <strong style={{ color: '#ef4444', display: 'block', marginBottom: '0.5rem' }}>Sine (sin)</strong>
                        On the unit circle, it's the vertical height (y). On the graph, it starts at 0, peaks at 1 (90° / π/2), and returns to 0 at 180° (π).
                    </div>
                    <div>
                        <strong style={{ color: '#3b82f6', display: 'block', marginBottom: '0.5rem' }}>Cosine (cos)</strong>
                        On the unit circle, it's the horizontal distance (x). On the graph, it starts at 1, crosses 0 at 90° (π/2), and reaches -1 at 180° (π).
                    </div>
                    <div>
                        <strong style={{ color: '#eab308', display: 'block', marginBottom: '0.5rem' }}>Tangent (tan)</strong>
                        It represents the slope of the line. Undefined at 90° and 270° where the lines are vertical (asymptotes).
                    </div>
                </div>
            </div>
        </div>
    );
}
