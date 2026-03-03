import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Layers, ShieldCheck, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Home: React.FC = () => {
    const [activeDriftMode, setActiveDriftMode] = useState<'typical' | 'autodrive'>('typical');
    const [activePillar, setActivePillar] = useState<number | null>(null);
    const [activeNode, setActiveNode] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveNode((prev) => (prev + 1) % 6);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="home">
            <Navigation />

            {/* Hero Section */}
            <section className="dark-section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                {/* Hero Background Visual */}
                <div style={{
                    position: 'absolute', top: 0, right: 0, width: '100%', height: '100%',
                    backgroundImage: 'url("/hero-visual-dealership.png")', backgroundSize: 'cover', backgroundPosition: 'center',
                    maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 40%, rgba(0,0,0,0.1) 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 40%, rgba(0,0,0,0.1) 100%)',
                    opacity: 0.6,
                    zIndex: 1,
                    filter: 'saturate(0.5) brightness(0.8)'
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div style={{ marginBottom: '3rem' }}>
                            <h1 style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', lineHeight: 0.8, marginBottom: '0.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em' }}>
                                AutoDrive
                            </h1>
                            <div style={{ marginTop: '1rem' }}>
                                <span style={{ fontWeight: 500, opacity: 0.8, fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', color: 'var(--logo-blue)', fontFamily: 'var(--font-heading)' }}>
                                    Dealership CX Performance Infrastructure.
                                </span>
                            </div>
                        </div>

                        <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4.5rem', maxWidth: '1000px' }}>
                            <div style={{ borderLeft: '3px solid var(--logo-blue)', paddingLeft: '2rem' }}>
                                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: 600, marginBottom: '0.2rem' }}>Stabilize culture.</p>
                                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: 600, marginBottom: '0.2rem' }}>Protect CSI.</p>
                                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: 600, color: 'var(--logo-green)' }}>Increase gross.</p>
                            </div>
                            <div style={{ color: 'var(--text-primary-dark)', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <p style={{ marginBottom: '0.8rem', fontSize: '1rem', fontWeight: 400, opacity: 0.8, letterSpacing: '0.02em' }}>AI-guided development for consultants.</p>
                                <p style={{ marginBottom: '0.8rem', fontSize: '1rem', fontWeight: 400, opacity: 0.8, letterSpacing: '0.02em' }}>Manager-led accountability for teams.</p>
                                <p style={{ fontSize: '1rem', fontWeight: 400, opacity: 0.8, letterSpacing: '0.02em' }}>Executive clarity for ownership.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <a href="#beta" className="btn btn-primary" style={{ padding: '1.4rem 2.8rem' }}>Join Private Beta</a>
                            <Link to="/implementation" className="btn btn-ghost" style={{ padding: '1.4rem 2.8rem', textDecoration: 'none' }}>
                                Explore Dealership Implementation
                            </Link>
                        </div>
                        <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary-dark)', fontSize: '0.9rem', fontWeight: 500, opacity: 0.6 }}>
                            Private beta implementation in progress.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* CSI Drift Section */}
            <section className="light-section" style={{
                padding: 'var(--spacing-huge) 5%',
                overflow: 'hidden',
                backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
                backgroundSize: '30px 30px'
            }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '4rem', position: 'relative', zIndex: 100 }}>
                        <button
                            onMouseEnter={() => setActiveDriftMode('typical')}
                            style={{
                                padding: '1rem 2rem',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                border: '1px solid',
                                borderColor: activeDriftMode === 'typical' ? '#000' : '#ddd',
                                background: activeDriftMode === 'typical' ? '#000' : 'transparent',
                                color: activeDriftMode === 'typical' ? '#fff' : '#000',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                borderRadius: '4px',
                                boxShadow: activeDriftMode === 'typical' ? '0 10px 20px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            Typical Reactive Model
                        </button>
                        <button
                            onMouseEnter={() => setActiveDriftMode('autodrive')}
                            style={{
                                padding: '1rem 2rem',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                border: '1px solid',
                                borderColor: activeDriftMode === 'autodrive' ? 'var(--logo-green)' : '#ddd',
                                background: activeDriftMode === 'autodrive' ? 'var(--logo-green)' : 'transparent',
                                color: activeDriftMode === 'autodrive' ? '#fff' : '#000',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                borderRadius: '4px',
                                boxShadow: activeDriftMode === 'autodrive' ? '0 10px 20px rgba(102, 184, 72, 0.2)' : 'none'
                            }}
                        >
                            The AutoDrive Path
                        </button>
                    </div>

                    <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <AnimatePresence mode="wait">
                                {activeDriftMode === 'typical' ? (
                                    <motion.div
                                        key="typical-text"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1, marginBottom: '2rem', maxWidth: '500px' }}>
                                            CSI doesn’t collapse.<br />
                                            <span style={{ color: 'var(--logo-blue)' }}>It drifts.</span>
                                        </h2>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', borderLeft: '1px solid #ddd', paddingLeft: '2rem' }}>
                                            {/* Items */}
                                            {[
                                                { num: '01', text: 'Culture shifts slowly, moving incrementally away from core standards.' },
                                                { num: '02', text: 'Coaching consistency fades as daily pressures prioritize the immediate.' },
                                                { num: '03', text: 'Standards loosen quietly until the drift becomes the new baseline.' }
                                            ].map(item => (
                                                <div key={item.num} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.4, marginTop: '0.3rem' }}>{item.num}</span>
                                                    <p style={{ color: 'var(--text-secondary-light)', fontSize: '1.2rem' }}>{item.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="autodrive-text"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1, marginBottom: '2rem', maxWidth: '600px' }}>
                                            The Infrastructure <br />
                                            <span style={{ color: 'var(--logo-green)' }}>of Consistency.</span>
                                        </h2>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', borderLeft: '3px solid var(--logo-green)', paddingLeft: '2rem' }}>
                                            {[
                                                { num: '01', text: 'Immediate identification of operational deviations before they impact profit.' },
                                                { num: '02', text: 'Automated accountability ensures standards are met without over-management.' },
                                                { num: '03', text: 'Full visibility into the \'blind spots\' that traditional systems can\'t track.' }
                                            ].map(item => (
                                                <div key={item.num} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--logo-green)', marginTop: '0.3rem' }}>{item.num}</span>
                                                    <p style={{ color: 'var(--text-secondary-light)', fontSize: '1.2rem' }}>{item.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            style={{
                                position: 'relative',
                                background: '#f9fafb',
                                padding: 'clamp(1rem, 5vw, 3rem)',
                                border: '1px solid #e0e6ed',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.05)',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                width: '100%'
                            }}
                        >
                            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '0.6rem', opacity: 0.3, color: '#000', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                                Store Performance Wave // Real-Time
                            </div>

                            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '12px', height: '3px', background: '#26c6da', borderRadius: '4px' }}></div>
                                    <span style={{ fontSize: '0.65rem', color: '#000', opacity: 0.6, letterSpacing: '0.1em', fontWeight: 600 }}>PERFORMANCE WAVE</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #66bb6a' }}></div>
                                    <span style={{ fontSize: '0.65rem', color: '#000', opacity: 0.6, letterSpacing: '0.1em', fontWeight: 600 }}>DEPTH OF MASTERY</span>
                                </div>
                            </div>

                            <div style={{ background: '#fff', borderRadius: '4px', border: '1px solid #edf2f7', padding: '1rem' }}>
                                <svg width="100%" height="300" viewBox="0 0 500 300" style={{ overflow: 'visible' }}>
                                    <defs>
                                        <pattern id="dot-pattern-light" width="10" height="10" patternUnits="userSpaceOnUse">
                                            <circle cx="1" cy="1" r="0.8" fill="rgba(0,0,0,0.03)" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#dot-pattern-light)" />
                                    <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                                    <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                                    <line x1="0" y1="250" x2="500" y2="250" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                                    <AnimatePresence mode="wait">
                                        {activeDriftMode === 'typical' ? (
                                            <motion.g key="typical-wave">
                                                {[
                                                    { color: '#ffa726', d: "M 0 80 C 100 80, 180 100, 220 220 L 260 140 C 300 180, 350 220, 500 300", delay: 0 },
                                                    { color: '#ec407a', d: "M 0 120 C 120 120, 200 140, 220 240 L 260 180 C 300 210, 360 250, 500 320", delay: 0.1 },
                                                    { color: '#ab47bc', d: "M 0 150 C 140 150, 210 170, 225 250 L 265 210 C 310 240, 380 280, 500 340", delay: 0.2 },
                                                    { color: '#26c6da', d: "M 0 60 C 80 60, 160 80, 210 180 L 250 110 C 290 150, 340 200, 500 280", delay: 0.3 }
                                                ].map((wave, idx) => (
                                                    <motion.path
                                                        key={idx}
                                                        d={wave.d}
                                                        fill="none"
                                                        stroke={wave.color}
                                                        strokeWidth="2"
                                                        strokeDasharray="2,4"
                                                        initial={{ pathLength: 0, opacity: 0 }}
                                                        animate={{ pathLength: 1, opacity: 0.5 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 2, delay: wave.delay }}
                                                    />
                                                ))}
                                                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                                                    <line x1="220" y1="220" x2="220" y2="280" stroke="#f44336" strokeWidth="1" strokeDasharray="2,2" />
                                                    <text x="130" y="275" fontSize="8" fill="#f44336" fontWeight="700">CRITICAL DROP</text>
                                                    <text x="380" y="290" fontSize="10" fill="#f44336" fontWeight="800" letterSpacing="1" opacity="0.8">SUSTAINABILITY GAP</text>
                                                </motion.g>
                                            </motion.g>
                                        ) : (
                                            <motion.g key="autodrive-wave">
                                                {[
                                                    { color: '#66bb6a', d: "M 0 150 C 150 140, 350 120, 500 80", delay: 0 },
                                                    { color: '#26c6da', d: "M 0 180 C 150 170, 350 130, 500 100", delay: 0.1 },
                                                    { color: '#ab47bc', d: "M 0 210 C 150 200, 350 150, 500 120", delay: 0.2 },
                                                    { color: '#ffa726', d: "M 0 100 C 150 90, 350 60, 500 40", delay: 0.3 }
                                                ].map((wave, idx) => (
                                                    <motion.path
                                                        key={idx}
                                                        d={wave.d}
                                                        fill="none"
                                                        stroke={wave.color}
                                                        strokeWidth="2.5"
                                                        strokeDasharray="1,2"
                                                        initial={{ pathLength: 0, opacity: 0 }}
                                                        animate={{ pathLength: 1, opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 1.5, delay: wave.delay }}
                                                    />
                                                ))}
                                                <text x="350" y="60" fontSize="10" fill="#66bb6a" fontWeight="800" letterSpacing="1">REINFORCED OPTIMIZATION</text>
                                            </motion.g>
                                        )}
                                    </AnimatePresence>
                                </svg>
                            </div>

                            {/* CX Metrics Grid */}
                            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.8rem', borderTop: '1px solid #edf2f7', paddingTop: '2rem' }}>
                                {[
                                    { label: 'EMPATHY', score: activeDriftMode === 'typical' ? '28%' : '94%', icon: '😊', bgColor: '#b2ebf2', color: '#00acc1' },
                                    { label: 'LISTENING', score: activeDriftMode === 'typical' ? '12%' : '88%', icon: '👂', bgColor: '#c8e6c9', color: '#43a047' },
                                    { label: 'TRUST', score: activeDriftMode === 'typical' ? '41%' : '96%', icon: '🤝', bgColor: '#f8bbd0', color: '#d81b60' },
                                    { label: 'FOLLOW UP', score: activeDriftMode === 'typical' ? '6%' : '91%', icon: '🔄', bgColor: '#fff9c4', color: '#fbc02d' },
                                    { label: 'CLOSING', score: activeDriftMode === 'typical' ? '52%' : '89%', icon: '🎯', bgColor: '#e1bee7', color: '#8e24aa' },
                                    { label: 'RELATIONSHIP', score: activeDriftMode === 'typical' ? '14%' : '95%', icon: '👥', bgColor: '#ffe0b2', color: '#fb8c00' }
                                ].map((metric) => (
                                    <div key={metric.label} style={{ textAlign: 'center' }}>
                                        <div style={{
                                            width: '32px', height: '32px', margin: '0 auto 0.8rem',
                                            background: activeDriftMode === 'autodrive' ? metric.bgColor : '#f1f5f9',
                                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem',
                                            transition: 'all 0.3s ease', border: activeDriftMode === 'autodrive' ? 'none' : '1px solid #e2e8f0'
                                        }}>
                                            {metric.icon}
                                        </div>
                                        <div style={{ fontSize: '0.5rem', fontWeight: 700, color: '#000', opacity: 0.4, marginBottom: '0.3rem', letterSpacing: '0.05em' }}>{metric.label}</div>
                                        <motion.div
                                            key={metric.score}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{ fontSize: '1rem', fontWeight: 900, color: activeDriftMode === 'typical' ? '#f44336' : '#2d3748' }}
                                        >
                                            {metric.score}
                                        </motion.div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: activeDriftMode === 'autodrive' ? '#66bb6a' : '#f44336', fontWeight: 800 }}> System status: </span>
                                    <span style={{ fontSize: '0.65rem', color: '#000', opacity: 0.6 }}>
                                        {activeDriftMode === 'autodrive' ? 'Infrastructure active. Reinforcement locked.' : 'Drift detected. Baseline unanchored.'}
                                    </span>
                                </div>
                                <div style={{ padding: '0.4rem 0.8rem', background: activeDriftMode === 'autodrive' ? 'rgba(102, 187, 106, 0.1)' : 'rgba(244, 67, 54, 0.1)', borderRadius: '4px', border: `1px solid ${activeDriftMode === 'autodrive' ? '#66bb6a' : '#f44336'}` }}>
                                    <span style={{ fontSize: '0.6rem', fontWeight: 900, color: activeDriftMode === 'autodrive' ? '#66bb6a' : '#f44336' }}>
                                        {activeDriftMode === 'autodrive' ? 'OPTIMIZING' : 'CRITICAL'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Pillars Section */}
            <section className="light-section" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', background: '#fdfdfd' }}>
                <div className="container">
                    <div style={{ marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>A performance operating system.</h2>
                        <p style={{ color: 'var(--text-secondary-light)', fontSize: '1.2rem', opacity: 0.6 }}>Architected for behavioral consistency and profit stability.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                        {/* Pillar 1 */}
                        <motion.button onClick={() => setActivePillar(activePillar === 0 ? null : 0)} style={{
                            padding: '3rem', border: activePillar === 0 ? '2px solid var(--logo-blue)' : '1px solid #e0e0e0', borderRadius: '4px', background: '#fff', textAlign: 'left', cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: activePillar === 0 ? '0 20px 40px rgba(52, 136, 186, 0.1)' : 'none', transform: activePillar === 0 ? 'translateY(-5px)' : 'none'
                        }}>
                            <Layers style={{ marginBottom: '1.5rem', color: 'var(--logo-blue)', opacity: activePillar === 0 ? 1 : 0.4 }} size={32} />
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800 }}>Culture & CSI Stability</h3>
                            <p style={{ color: 'var(--text-secondary-light)', fontSize: '0.95rem', lineHeight: 1.4 }}>Daily reinforcement strengthens tone, empathy, and follow-through.</p>
                        </motion.button>
                        {/* Pillar 2 */}
                        <motion.button onClick={() => setActivePillar(activePillar === 1 ? null : 1)} style={{
                            padding: '3rem', border: activePillar === 1 ? '2px solid var(--logo-green)' : '1px solid #e0e0e0', borderRadius: '4px', background: '#fff', textAlign: 'left', cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: activePillar === 1 ? '0 20px 40px rgba(102, 184, 72, 0.1)' : 'none', transform: activePillar === 1 ? 'translateY(-5px)' : 'none'
                        }}>
                            <TrendingUp style={{ marginBottom: '1.5rem', color: 'var(--logo-green)', opacity: activePillar === 1 ? 1 : 0.4 }} size={32} />
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800 }}>Performance & Gross Growth</h3>
                            <p style={{ color: 'var(--text-secondary-light)', fontSize: '0.95rem', lineHeight: 1.4 }}>Structured skill progression builds confidence and precision.</p>
                        </motion.button>
                        {/* Pillar 3 */}
                        <motion.button onClick={() => setActivePillar(activePillar === 2 ? null : 2)} style={{
                            padding: '3rem', border: activePillar === 2 ? '2px solid #000' : '1px solid #e0e0e0', borderRadius: '4px', background: '#fff', textAlign: 'left', cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: activePillar === 2 ? '0 20px 40px rgba(0,0,0,0.05)' : 'none', transform: activePillar === 2 ? 'translateY(-5px)' : 'none'
                        }}>
                            <ShieldCheck style={{ marginBottom: '1.5rem', color: '#000', opacity: activePillar === 2 ? 1 : 0.4 }} size={32} />
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800 }}>Leadership Discipline</h3>
                            <p style={{ color: 'var(--text-secondary-light)', fontSize: '0.95rem', lineHeight: 1.4 }}>Managers coach with visibility. Ownership operates with clarity.</p>
                        </motion.button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activePillar !== null && (
                            <motion.div key={activePillar} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.5, ease: "easeOut" }}
                                style={{ background: '#f8f9fa', padding: '4rem', borderRadius: '8px', border: '1px solid #eef0f2', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '0.7rem', opacity: 0.3, letterSpacing: '0.2em', fontWeight: 900 }}>PILLAR // 0{activePillar + 1}</div>
                                <div style={{ maxWidth: '900px' }}>
                                    <p style={{ fontSize: 'clamp(1.1rem, 4vw, 1.6rem)', fontWeight: 500, lineHeight: 1.3, color: '#1a1a1a', letterSpacing: '-0.01em', marginBottom: 'clamp(2rem, 5vw, 4rem)' }}>
                                        {activePillar === 0 && "AutoDrive stabilizes customer experience by stabilizing behavior. CSI does not fluctuate because mood changes. It improves because standards become repeatable."}
                                        {activePillar === 1 && "Gross grows when confidence grows. Confidence grows when skills are structured. AutoDrive turns soft skills into measurable performance drivers."}
                                        {activePillar === 2 && "AutoDrive makes leadership visible. Managers stop guessing who is improving and start coaching with precision."}
                                    </p>
                                    <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                                        {(activePillar === 0 ? [
                                            { title: 'Daily Behavioral Reinforcement', body: 'Micro-drills and XP-based repetition embed tone, empathy, and clarity into muscle memory.', fix: 'Inconsistent greetings, uneven follow-through.' },
                                            { title: 'Trust Leak Detection', body: 'The system surfaces breakdowns in clarity or follow-up before they hit surveys.', fix: '"We don’t know why CSI dropped."' },
                                            { title: 'Experience Standardization', body: 'Clear CX rules across all departments ensure brand unity.', fix: 'One department strong, another damaging the brand.' },
                                            { title: 'Follow-Through Protocols', body: 'Structured delivery moments and post-sale touchpoints generate loyalty.', fix: 'Lost customer momentum after sale.' }
                                        ] : activePillar === 1 ? [
                                            { title: 'Structured Skill Progression', body: 'Sales behaviors advance in levels, ensuring continuous development.', fix: 'Reps plateauing after month twelve.' },
                                            { title: 'Discovery Depth Engine', body: 'Needs assessment mastery increases alignment.', fix: '"Just looking" customers who never commit.' },
                                            { title: 'Confidence Under Pressure', body: 'Objection handling becomes practiced protocols, not reactive stress.', fix: 'Unnecessary discounting under tension.' },
                                            { title: 'Objection Intelligence', body: 'Hesitation detection software improves close rates.', fix: 'Deals dying quietly.' }
                                        ] : [
                                            { title: 'Manager Visibility Dashboard', body: 'Skill trends and coaching opportunities available in real time.', fix: 'Coaching based on manager gut feeling.' },
                                            { title: 'Role-Based Skill Mapping', body: 'Defined tracks built for specific dealership roles.', fix: 'Generic corporate training.' },
                                            { title: 'Coaching Guides', body: 'Frameworks to turn sales meetings into growth events.', fix: 'Directionless standups.' },
                                            { title: 'XP Systems', body: 'Progress is visible, gamified, and measured against KPIs.', fix: 'Initiative fatigue.' }
                                        ]).map((item, i) => (
                                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                                                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.8rem', color: activePillar === 0 ? 'var(--logo-blue)' : activePillar === 1 ? 'var(--logo-green)' : '#000' }}>{item.title}</h4>
                                                <p style={{ fontSize: '0.95rem', color: '#4a4a4a', marginBottom: '1.2rem', lineHeight: 1.5 }}>{item.body}</p>
                                                <div style={{ padding: '0.8rem 1.2rem', background: '#fff', borderLeft: '3px solid #ddd', borderRadius: '0 4px 4px 0' }}>
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4, display: 'block', marginBottom: '0.2rem' }}>What This Fixes</span>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a' }}>{item.fix}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* REINFORCEMENT ENGINE - PULSE CORE VERSION */}
            <section className="dark-section" style={{
                padding: 'var(--spacing-huge) 5%', background: '#0a0b0d', position: 'relative', overflow: 'hidden',
                borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)'
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: 'linear-gradient(rgba(102, 184, 72, 0.05) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(102, 184, 72, 0.05) 1.5px, transparent 1.5px)',
                    backgroundSize: '100px 100px', opacity: 0.3, zIndex: 1
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', lineHeight: 0.85, fontWeight: 800, color: '#fff' }}>
                            Training events don’t<br />create <span style={{ color: 'rgba(255,255,255,0.2)' }}>consistency.</span>
                        </motion.h2>
                        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', color: 'var(--logo-green)', marginTop: '0.8rem' }}>Reinforcement does.</h2>
                    </div>

                    <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative', height: 'clamp(350px, 60vh, 550px)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(102, 184, 72, 0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 1 }} />
                            <svg width="100%" height="100%" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible', zIndex: 10, maxWidth: '500px' }}>
                                <defs>
                                    <clipPath id="orbClip"><circle cx="300" cy="300" r="148" /></clipPath>
                                    <radialGradient id="glassGrad" cx="35%" cy="35%" r="50%"><stop offset="0%" stopColor="rgba(255,255,255,0.25)" /><stop offset="60%" stopColor="rgba(255,255,255,0)" /><stop offset="100%" stopColor="rgba(0,0,0,0.4)" /></radialGradient>
                                </defs>
                                <motion.circle cx="300" cy="300" r="150" fill="rgba(102, 184, 72, 0.15)" style={{ filter: 'blur(20px)' }} animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
                                <motion.g animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: '300px 300px' }}>
                                    <image href="/pulse-core.png" x="150" y="150" width="300" height="300" clipPath="url(#orbClip)" />
                                </motion.g>
                                <circle cx="300" cy="300" r="148" fill="url(#glassGrad)" style={{ opacity: 0.8, pointerEvents: 'none' }} />
                                <motion.circle cx="300" cy="300" r="170" fill="none" stroke="rgba(102, 184, 72, 0.3)" strokeWidth="1" strokeDasharray="2, 15" animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
                                <motion.circle cx="300" cy="300" r="190" fill="none" stroke="rgba(52, 136, 186, 0.2)" strokeWidth="0.5" strokeDasharray="20, 40" animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
                                {["Daily Micro-Drill", "Live Application", "XP & Skill Logging", "Skill Trend Update", "Manager Coaching Trigger", "Weekly Team Reinforcement"].map((label, i) => {
                                    const angle = (i * 60 - 90) * (Math.PI / 180), radius = 240, x = 300 + radius * Math.cos(angle), y = 300 + radius * Math.sin(angle), isActive = activeNode === i;
                                    return (
                                        <g key={label}>
                                            {isActive && <motion.line initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }} x1="300" y1="300" x2={x} y2={y} stroke="var(--logo-green)" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 5px var(--logo-green))' }} />}
                                            <circle cx={x} cy={y} r="8" fill={isActive ? 'var(--logo-green)' : '#15181e'} stroke={isActive ? '#fff' : 'rgba(255,255,255,0.2)'} strokeWidth="2" />
                                            <text x={x} y={y + (y > 300 ? 30 : -20)} textAnchor="middle" fill={isActive ? '#fff' : 'rgba(255,255,255,0.3)'} style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{label}</text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>

                        <div>
                            <div style={{ borderLeft: '4px solid var(--logo-green)', paddingLeft: '3rem', marginBottom: '4rem' }}>
                                <h3 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '1.5rem', color: '#fff' }}>The Infrastructure of Alignment</h3>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', lineHeight: 1.6 }}>Consistency is a systemic output, not a human variable. AutoDrive stabilizes dealership performance by anchoring skills through a closed-loop reinforcement cycle.</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                {[
                                    { title: "High Resolution", body: "Operational deviations detected with precision in performance trends." },
                                    { title: "Dynamic Alignment", body: "Coaching triggers target behavioral slips the moment they manifest." },
                                    { title: "Atomic Stability", body: "Systems ensure core habits never degrade over time." }
                                ].map((feature, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                                        <div style={{ marginTop: '0.5rem', width: '20px', height: '2px', background: 'var(--logo-green)' }}></div>
                                        <div><h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.2em' }}>{feature.title} //</h4><p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)' }}>{feature.body}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container" style={{ marginTop: '8rem', position: 'relative', zIndex: 10 }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '4rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                            {[
                                { event: "Micro-Drill", msg: "Tone & Body Language Reps", status: "SYNCED" },
                                { event: "Live Log", msg: "3-Step Greeting Validated", status: "VALID" },
                                { event: "Trend Check", msg: "Consistency Score: 94%", status: "OPTIMAL" },
                                { event: "Coaching", msg: "Manager Insight Prompted", status: "REINFORCED" }
                            ].map((step, i) => (
                                <div key={step.event} style={{ textAlign: 'center' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)' }}>PHASE 0{i + 1} // SYSTEM CYCLE</span>
                                    <div style={{ margin: '1rem 0', height: '2px', background: i === 3 ? 'var(--logo-green)' : 'rgba(255,255,255,0.1)' }}></div>
                                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{step.event}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{step.msg}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="dark-section" style={{ padding: '10rem 5%', textAlign: 'center', background: '#0a0b0d', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                <div className="container">
                    <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>Most dealerships train in bursts.<br />AutoDrive reinforces daily.</h3>
                    <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: 'rgba(255,255,255,0.5)', maxWidth: '850px', margin: '2rem auto 0' }}>Consistency is what happens when behavior is measured every day and coached every week.</p>
                </div>
            </section>

            <section className="light-section" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', background: '#fff' }}>
                <div className="container">
                    <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Cards */}
                        {[
                            { role: 'Consultant', items: ['AI-guided skill development', 'Real-time performance feedback', 'Career-defining training path'], cta: 'Join Private Beta', link: '#beta', primary: true },
                            { role: 'Manager', items: ['Automated team accountability', 'Coaching visibility & tracking', 'Culture stability controls'], cta: 'Explore Dealership Implementation', link: '/implementation', primary: false },
                            { role: 'Dealer Principal', items: ['Executive performance clarity', 'Gross profit risk mitigation', 'Enterprise-level scalability'], cta: 'Explore Dealership Implementation', link: '/implementation', primary: false }
                        ].map(card => (
                            <div key={card.role} style={{ padding: 'clamp(1.5rem, 5vw, 3rem)', background: '#fff', border: '1px solid #eee' }}>
                                <h3 style={{ fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem', opacity: 0.6 }}>{card.role}</h3>
                                <ul style={{ listStyle: 'none', marginBottom: '3rem' }}>
                                    {card.items.map(item => <li key={item} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}><ChevronRight size={16} /> {item}</li>)}
                                </ul>
                                {card.link.startsWith('/') ? (
                                    <Link to={card.link} className={`btn ${card.primary ? 'btn-primary' : 'btn-ghost-dark'}`} style={{ width: '100%', textDecoration: 'none', textAlign: 'center' }}>{card.cta}</Link>
                                ) : (
                                    <a href={card.link} className={`btn ${card.primary ? 'btn-primary' : 'btn-ghost-dark'}`} style={{ width: '100%', textDecoration: 'none', textAlign: 'center' }}>{card.cta}</a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="dark-section" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem', color: '#fff' }}>Dealership performance will not<br />improve by accident.</h2>
                    <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, opacity: 0.9, marginBottom: '2rem', color: '#fff' }}>It will improve by design.</h3>
                    <p style={{ color: 'var(--text-secondary-dark)', fontSize: '1.2rem', marginBottom: '4rem' }}>AutoDrive installs design into daily behavior.</p>
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="#beta" className="btn btn-primary">Join Private Beta</a>
                        <Link to="/implementation" className="btn btn-ghost" style={{ textDecoration: 'none' }}>Explore Dealership Implementation</Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
