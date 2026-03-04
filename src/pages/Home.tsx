import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Home: React.FC = () => {
    const [activeDriftMode, setActiveDriftMode] = useState<'typical' | 'autodrive'>('typical');

    const snapshotMetrics = activeDriftMode === 'typical'
        ? [
            { label: 'Behavior Consistency Index', value: '62%', status: 'Risk', tone: '#f44336' },
            { label: 'Manager Coaching Coverage', value: '54%', status: 'Watch', tone: '#f59e0b' },
            { label: 'Drift Alerts', value: '31%', status: 'Active', tone: '#f44336' },
            { label: 'Standards Compliance', value: '68%', status: 'Watch', tone: '#f59e0b' }
        ]
        : [
            { label: 'Behavior Consistency Index', value: '92%', status: 'Stable', tone: '#43a047' },
            { label: 'Manager Coaching Coverage', value: '88%', status: 'Holding', tone: '#43a047' },
            { label: 'Drift Alerts', value: '09%', status: 'Active', tone: '#f59e0b' },
            { label: 'Standards Compliance', value: '94%', status: 'Stable', tone: '#43a047' }
        ];

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

                <div className="container hero-content" style={{ position: 'relative', zIndex: 10 }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div style={{ marginBottom: '3rem' }}>
                            <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 5.2rem)', lineHeight: 1.02, marginBottom: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', maxWidth: '920px' }}>
                                Protect CSI. Protect Gross. Stabilize Culture.
                            </h1>
                            <div style={{ marginTop: '1rem' }}>
                                <span style={{ fontWeight: 500, opacity: 0.95, fontSize: 'clamp(1.05rem, 2.1vw, 1.5rem)', color: '#d7e2eb', maxWidth: '900px', display: 'block' }}>
                                    AutoDrive is the manager-led execution system that keeps dealership performance consistent when pressure hits.
                                </span>
                            </div>
                        </div>

                        <div className="mobile-stack" style={{ marginBottom: '4rem', maxWidth: '1100px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '8px', padding: '1.25rem 1.2rem' }}>
                                <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.11em', fontWeight: 800, color: 'var(--logo-green)', marginBottom: '0.55rem' }}>Consultants</p>
                                <p style={{ fontSize: '1rem', color: '#f4f7fa', lineHeight: 1.5 }}>Daily behavior reps that eliminate drift and reinforce process.</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '8px', padding: '1.25rem 1.2rem' }}>
                                <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.11em', fontWeight: 800, color: 'var(--logo-blue)', marginBottom: '0.55rem' }}>Managers</p>
                                <p style={{ fontSize: '1rem', color: '#f4f7fa', lineHeight: 1.5 }}>Structured accountability loops that correct issues before metrics slip.</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '8px', padding: '1.25rem 1.2rem' }}>
                                <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.11em', fontWeight: 800, color: '#ffffff', marginBottom: '0.55rem' }}>Ownership</p>
                                <p style={{ fontSize: '1rem', color: '#f4f7fa', lineHeight: 1.5 }}>Predictable behavior. Protected revenue. Durable culture.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 'clamp(1rem, 3vw, 2rem)', flexWrap: 'wrap', alignItems: 'center' }}>
                            <a href="#beta" className="btn btn-primary" style={{ padding: 'clamp(1rem, 3vw, 1.4rem) clamp(2rem, 5vw, 2.8rem)', fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>Book Performance Strategy Call</a>
                            <Link to="/implementation" className="btn btn-ghost" style={{ padding: 'clamp(1rem, 3vw, 1.4rem) clamp(2rem, 5vw, 2.8rem)', textDecoration: 'none', fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>
                                View 90-Day Rollout Plan
                            </Link>
                        </div>
                        <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary-dark)', fontSize: '0.9rem', fontWeight: 500, opacity: 0.6 }}>
                            Built for live dealership floors. No shutdowns. No one-off training events.
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
                                                { num: '01', text: 'Standards slip gradually as day-to-day pressure pulls teams off process.' },
                                                { num: '02', text: 'Coaching cadence breaks when managers are forced into constant fire drills.' },
                                                { num: '03', text: 'Small misses compound until weak execution becomes normal.' }
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
                                            Engineered <br />
                                            <span style={{ color: 'var(--logo-green)' }}>Consistency.</span>
                                        </h2>
                                        <p style={{ color: 'var(--text-secondary-light)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.8rem', maxWidth: '620px' }}>
                                            AutoDrive gives managers a daily operating system for behavior control on the floor.
                                            It prevents drift early, keeps coaching visible, and turns execution into a measurable discipline.
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', borderLeft: '3px solid var(--logo-green)', paddingLeft: '2rem' }}>
                                            {[
                                                { num: '01', text: 'Daily reps reinforce the exact behaviors your process depends on.' },
                                                { num: '02', text: 'Managers see drift signals early and coach before CSI or gross is affected.' },
                                                { num: '03', text: 'Accountability loops document who was coached, on what, and when.' },
                                                { num: '04', text: 'Leadership tracks trend stability by role, team, and store over time.' }
                                            ].map(item => (
                                                <div key={item.num} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--logo-green)', marginTop: '0.3rem' }}>{item.num}</span>
                                                    <p style={{ color: 'var(--text-secondary-light)', fontSize: '1.2rem' }}>{item.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <p style={{ color: '#121111', fontSize: '1rem', marginTop: '1.6rem', fontWeight: 700 }}>
                                            Consistency is engineered through daily execution, not left to chance.
                                        </p>
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
                                Performance Snapshot // Live
                            </div>

                            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.9rem' }}>
                                {snapshotMetrics.map((metric) => (
                                    <div key={metric.label} style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '1rem 1.1rem' }}>
                                        <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', fontWeight: 700, marginBottom: '0.5rem' }}>{metric.label}</p>
                                        <p style={{ fontSize: '2.2rem', lineHeight: 1, fontWeight: 800, color: '#111827', marginBottom: '0.65rem' }}>{metric.value}</p>
                                        <span style={{ display: 'inline-block', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, color: metric.tone, border: `1px solid ${metric.tone}`, borderRadius: '999px', padding: '0.2rem 0.55rem' }}>
                                            {metric.status}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '1.4rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.1em', fontWeight: 800 }}>System status: </span>
                                    <span style={{ fontSize: '0.72rem', color: '#111827', opacity: 0.9, fontWeight: 500 }}>
                                        {activeDriftMode === 'autodrive'
                                            ? 'Daily coaching active. Standards are holding across the floor.'
                                            : 'Drift pressure is rising. Coaching cadence needs correction this week.'}
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
                        <p style={{ color: 'var(--text-secondary-light)', fontSize: '1.1rem', opacity: 0.75, maxWidth: '860px' }}>
                            Three interdependent layers govern floor execution, manager intervention, and ownership control.
                        </p>
                    </div>

                    <div style={{ borderTop: '1px solid #d7dde4', borderBottom: '1px solid #d7dde4', background: '#fff' }}>
                        {[
                            {
                                layer: 'Layer 01 // Execution Layer',
                                title: 'Floor Behavior Control',
                                lines: [
                                    'Daily reps lock in greeting, discovery, follow-up, and handoff standards.',
                                    'This layer produces the operating signal used by management and ownership.'
                                ]
                            },
                            {
                                layer: 'Layer 02 // Management Layer',
                                title: 'Coaching & Correction',
                                lines: [
                                    'Managers act on Layer 01 drift signals through scheduled coaching loops.',
                                    'This layer converts weak execution into corrected execution within the same week.'
                                ]
                            },
                            {
                                layer: 'Layer 03 // Governance Layer',
                                title: 'Ownership Oversight',
                                lines: [
                                    'Ownership reviews coverage, drift frequency, and compliance by team and store.',
                                    'This layer enforces standards and resource decisions across the operating system.'
                                ]
                            }
                        ].map((item, index) => (
                            <div
                                key={item.layer}
                                style={{
                                    padding: '2rem 0',
                                    borderTop: index === 0 ? 'none' : '1px solid #e5e7eb'
                                }}
                            >
                                <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 800, color: '#6b7280', marginBottom: '0.75rem' }}>
                                    {item.layer}
                                </p>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.55rem', fontWeight: 800, color: '#111827' }}>{item.title}</h3>
                                <p style={{ color: '#4b5563', fontSize: '0.98rem', lineHeight: 1.55, marginBottom: '0.25rem' }}>{item.lines[0]}</p>
                                <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.lines[1]}</p>
                            </div>
                        ))}
                    </div>
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

                    <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'start' }}>
                        <div style={{ width: '100%', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, rgba(102, 184, 72, 0.1) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 1 }} />
                            <div style={{ position: 'relative', zIndex: 10, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(5px)' }}>
                                <p style={{ fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>
                                    System Architecture // Control Loop v3.2
                                </p>
                                <img
                                    src="/reinforcement-system.png"
                                    alt="The Reinforcement System high-fidelity 3D architecture"
                                    style={{ width: '100%', display: 'block', borderRadius: '4px', filter: 'contrast(1.1) brightness(1.1)' }}
                                />
                            </div>
                        </div>

                        <div>
                            <div style={{ borderLeft: '2px solid var(--logo-green)', paddingLeft: '2rem', marginBottom: '3rem' }}>
                                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: '#fff', letterSpacing: '-0.01em' }}>Infrastructure of Alignment</h3>
                                <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.05rem', lineHeight: 1.65, maxWidth: '620px' }}>
                                    AutoDrive runs a daily control loop across execution, visibility, and correction.
                                    Every behavior rep is logged, drift is surfaced early, and coaching triggers are routed to managers before performance degrades.
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                                {[
                                    { title: "Daily Execution Layer", body: "Micro-drills and live-floor reps reinforce greeting, discovery, handoff, and follow-up standards." },
                                    { title: "Behavior Logging Layer", body: "Each completed rep is time-stamped so managers can see completion, consistency, and role-level gaps." },
                                    { title: "Drift Detection Layer", body: "The system flags repeat misses and declining behaviors before CSI and gross are impacted." },
                                    { title: "Coaching Trigger Layer", body: "Manager prompts convert drift alerts into scheduled corrections and documented follow-through." }
                                ].map((feature, i) => (
                                    <div key={i} style={{ borderTop: i === 0 ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                                        <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'rgba(255,255,255,0.72)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.5rem' }}>{feature.title}</h4>
                                        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.62)', lineHeight: 1.55 }}>{feature.body}</p>
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
