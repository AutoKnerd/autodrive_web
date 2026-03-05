import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const SampleRolloutPlan: React.FC = () => {
    return (
        <div className="sample-rollout-plan-page">
            <Navigation />

            <section
                className="dark-section"
                style={{
                    minHeight: '70vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0 5%',
                    background: '#0a0b0d',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage:
                            'linear-gradient(to right, rgba(10,11,13,1) 20%, rgba(10,11,13,0.4) 60%, rgba(10,11,13,0.8) 100%), url("/hero-visual-dealership.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.45,
                        zIndex: 1,
                        filter: 'grayscale(0.35) brightness(0.7)'
                    }}
                />

                <div className="container hero-content" style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ maxWidth: '920px' }}>
                        <h1
                            style={{
                                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                                color: '#fff',
                                fontWeight: 800,
                                marginBottom: '1rem',
                                letterSpacing: '-0.03em'
                            }}
                        >
                            Sample 90-Day Rollout Plan
                        </h1>
                        <h2
                            style={{
                                fontSize: 'clamp(1.1rem, 2.5vw, 1.8rem)',
                                color: 'var(--logo-blue)',
                                fontWeight: 500,
                                marginBottom: '2rem',
                                opacity: 0.9
                            }}
                        >
                            How AutoDriveCX installs inside a dealership without disrupting daily operations or existing management structures.
                        </h2>
                    <p
                            style={{
                                fontSize: '1.05rem',
                                color: 'rgba(255,255,255,0.65)',
                                lineHeight: 1.6,
                                maxWidth: '680px',
                                marginBottom: '3rem'
                            }}
                        >
                            The system activates in phases. Managers lead execution. Reinforcement Loop begins immediately.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <a
                                href="https://calendar.app.google/QWRXFH9k24iZnBZWA"
                                target="_blank"
                                rel="noopener"
                                className="btn btn-primary"
                                style={{ textDecoration: 'none', padding: '1rem 2rem' }}
                            >
                                Schedule Implementation Call
                            </a>
                            <Link
                                to="/#beta"
                                className="btn btn-ghost"
                                style={{ textDecoration: 'none', padding: '1rem 2rem' }}
                            >
                                Join Private Beta
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="light-section" style={{ background: '#fff', padding: 'var(--spacing-huge) 5%', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <div className="container" style={{ maxWidth: '980px' }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                        Deployment Overview
                    </h2>
                    <p style={{ fontSize: '1.08rem', color: '#4b5563', lineHeight: 1.7, marginBottom: '1rem' }}>
                        AutoDriveCX behavioral operating system installs through a controlled four-phase Deployment.
                    </p>
                    <p style={{ fontSize: '1.08rem', color: '#4b5563', lineHeight: 1.7, marginBottom: '1rem' }}>
                        Each phase activates a new layer of the behavioral operating system while dealership operations continue normally.
                    </p>
                    <p style={{ fontSize: '1.08rem', color: '#4b5563', lineHeight: 1.7, marginBottom: '1rem' }}>
                        Managers introduce the system gradually while sales, service, BDC, and support teams continue existing workflows.
                    </p>
                    <p style={{ fontSize: '1.08rem', color: '#111827', lineHeight: 1.7, fontWeight: 700 }}>
                        Activation window: approximately 90 days
                    </p>
                </div>
            </section>

            <section
                id="deployment-map"
                className="dark-section"
                style={{ background: '#111827', padding: 'var(--spacing-huge) 5%', borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
                <div className="container">
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.94)' }}>
                        90-Day Deployment Map
                    </h2>
                    <div style={{ border: '1px solid rgba(255,255,255,0.16)', background: '#0f172a' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.1)' }}>
                            {[
                                { week: 'Week 1-2', stage: 'Activation' },
                                { week: 'Week 3-4', stage: 'Manager Reinforcement' },
                                { week: 'Week 5-8', stage: 'Department Adoption' },
                                { week: 'Week 9-12', stage: 'Operational Stabilization' }
                            ].map((item) => (
                                <div key={item.week} style={{ background: '#111827', padding: '1.5rem 1.25rem' }}>
                                    <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, color: 'rgba(255,255,255,0.55)', marginBottom: '0.5rem' }}>
                                        {item.week}
                                    </p>
                                    <p style={{ fontSize: '1rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{item.stage}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="light-section" style={{ background: '#f7f7f7', padding: 'var(--spacing-huge) 5%', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <div className="container" style={{ maxWidth: '860px' }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.6rem', letterSpacing: '-0.02em' }}>
                        Dealership Reality Check
                    </h2>
                    <p style={{ fontSize: '1.06rem', color: '#4b5563', lineHeight: 1.75, marginBottom: '1rem' }}>
                        Dealership floors are unpredictable.
                    </p>
                    <p style={{ fontSize: '1.06rem', color: '#4b5563', lineHeight: 1.75, marginBottom: '1rem' }}>
                        Managers are interrupted constantly.
                        <br />
                        Service lanes fill unexpectedly.
                        <br />
                        Sales teams juggle walk-ins, appointments, and digital leads at the same time.
                    </p>
                    <p style={{ fontSize: '1.06rem', color: '#4b5563', lineHeight: 1.75, marginBottom: '1rem' }}>
                        Consistency doesn&apos;t fail because people don&apos;t care.
                    </p>
                    <p style={{ fontSize: '1.06rem', color: '#4b5563', lineHeight: 1.75, marginBottom: '1rem' }}>
                        It fails because execution drifts under pressure.
                    </p>
                    <p style={{ fontSize: '1.06rem', color: '#4b5563', lineHeight: 1.75, marginBottom: '1rem' }}>
                        AutoDriveCX was designed specifically for this environment.
                    </p>
                    <p style={{ fontSize: '1.06rem', color: '#4b5563', lineHeight: 1.75, marginBottom: '1rem' }}>
                        Execution happens inside normal workflow.
                        <br />
                        Managers reinforce standards between real customer interactions.
                        <br />
                        Behavior is measured continuously instead of waiting for CSI reports weeks later.
                    </p>
                    <p style={{ fontSize: '1.06rem', color: '#4b5563', lineHeight: 1.75 }}>
                        The system works because it fits how dealerships actually operate.
                    </p>

                    <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '2rem' }}>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            See How AutoDriveCX Would Deploy in Your Store
                        </h3>
                        <p style={{ fontSize: '1.02rem', color: '#4b5563', lineHeight: 1.7, marginBottom: '0.7rem' }}>
                            Every dealership installs the system slightly differently depending on department structure and leadership coverage.
                        </p>
                        <p style={{ fontSize: '1.02rem', color: '#4b5563', lineHeight: 1.7, marginBottom: '1.6rem' }}>
                            Schedule a short implementation call to walk through how deployment would look in your store.
                        </p>
                        <a
                            href="https://calendar.app.google/QWRXFH9k24iZnBZWA"
                            target="_blank"
                            rel="noopener"
                            className="btn btn-primary"
                            style={{ textDecoration: 'none' }}
                        >
                            Schedule Implementation Call
                        </a>
                    </div>
                </div>
            </section>

            <section className="light-section" style={{ background: '#f8f9fa', padding: 'var(--spacing-huge) 5%', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <div className="container">
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '3rem', letterSpacing: '-0.02em' }}>
                        The 90-Day Rollout Timeline
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1px', background: '#e5e7eb', border: '1px solid #e5e7eb' }}>
                        {[
                            {
                                phase: 'Phase 1 - System Activation (Week 1-2)',
                                items: ['Dashboard installed', 'Manager Champion assigned', 'Primary CX priority identified', 'Manager onboarding session completed'],
                                outcome: 'Leadership gains visibility into behavior patterns across departments.'
                            },
                            {
                                phase: 'Phase 2 - Manager Reinforcement Begins (Week 3-4)',
                                items: ['First Execution Reps activated', 'Managers begin observation logging', 'Coaching prompts begin appearing'],
                                outcome: 'Behavior data begins accumulating across the dealership.'
                            },
                            {
                                phase: 'Phase 3 - Department Adoption (Week 5-8)',
                                items: ['Execution Reps embedded into daily workflows', 'Weekly Reinforcement Loop sessions begin', 'Behavior trendlines become visible'],
                                outcome: 'Managers begin identifying drift before performance degrades.'
                            },
                            {
                                phase: 'Phase 4 - Operational Stabilization (Week 9-12)',
                                items: ['Coaching triggers activate automatically', 'Manager reinforcement rhythm stabilizes', 'Cross-department CX alignment improves'],
                                outcome: 'Consistency becomes structural rather than motivational.'
                            }
                        ].map((block) => (
                            <div key={block.phase} style={{ background: '#fff', padding: '2.25rem', display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.12rem', fontWeight: 800, marginBottom: '1.2rem', lineHeight: 1.3 }}>{block.phase}</h3>
                                <ul style={{ listStyle: 'none', marginBottom: '1.5rem' }}>
                                    {block.items.map((item) => (
                                        <li key={item} style={{ marginBottom: '0.65rem', color: '#4b5563', lineHeight: 1.45 }}>
                                            • {item}
                                        </li>
                                    ))}
                                </ul>
                                <p style={{ marginTop: 'auto', fontSize: '0.92rem', fontWeight: 700, color: '#111827' }}>Outcome:</p>
                                <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: 1.5 }}>{block.outcome}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="dark-section" style={{ background: '#111827', padding: 'var(--spacing-huge) 5%', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="container">
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.94)' }}>
                        The AutoDriveCX Reinforcement Rhythm
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.16)' }}>
                        {[
                            { label: 'Daily', text: 'Execution Reps reinforce behavioral standards across departments.' },
                            { label: 'Weekly', text: 'Managers operate the Reinforcement Loop.' },
                            { label: 'Monthly', text: 'Ownership reviews compliance and drift trends.' }
                        ].map((item) => (
                            <div key={item.label} style={{ background: '#111827', padding: '1.8rem' }}>
                                <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, color: 'rgba(255,255,255,0.56)', marginBottom: '0.65rem' }}>
                                    {item.label}
                                </p>
                                <p style={{ fontSize: '0.98rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.6 }}>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="light-section" style={{ background: '#fff', padding: 'var(--spacing-huge) 5%', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <div className="container">
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                        What Managers Actually Do
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: '#4b5563', marginBottom: '2.5rem' }}>
                        Managers operate AutoDriveCX through three simple actions.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: '#e5e7eb', border: '1px solid #e5e7eb' }}>
                        {[
                            {
                                title: 'Assign Execution Reps',
                                body: 'Managers select daily Execution Reps aligned to current CX priorities.',
                                time: 'Time required: 2-3 minutes'
                            },
                            {
                                title: 'Observe Behavior',
                                body: 'Managers observe normal customer interactions across departments. The system logs patterns and surfaces behavioral drift automatically.',
                                time: 'Time required: no additional meetings'
                            },
                            {
                                title: 'Reinforce Weekly',
                                body: 'Managers lead a short weekly Reinforcement Loop session using an auto-generated coaching guide.',
                                time: 'Time required: 10-15 minutes'
                            }
                        ].map((item) => (
                            <div key={item.title} style={{ background: '#fff', padding: '2.25rem' }}>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>{item.title}</h3>
                                <p style={{ fontSize: '0.98rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '1rem' }}>{item.body}</p>
                                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>{item.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="light-section" style={{ background: '#f8f9fa', padding: 'var(--spacing-huge) 5%', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <div className="container" style={{ maxWidth: '980px' }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                        What Teams Experience
                    </h2>
                    <p style={{ fontSize: '1.08rem', color: '#4b5563', lineHeight: 1.7, marginBottom: '1rem' }}>
                        Frontline teams experience AutoDriveCX as short Execution Reps embedded directly in daily workflow.
                    </p>
                    <p style={{ fontSize: '1.08rem', color: '#111827', lineHeight: 1.7, marginBottom: '1rem' }}>
                        Not training. <br />
                        Not meetings. <br />
                        Just repetition.
                    </p>
                    <p style={{ fontSize: '1.08rem', color: '#111827', fontWeight: 700, lineHeight: 1.7 }}>
                        Typical daily participation: about 5 minutes
                    </p>
                </div>
            </section>

            <section className="dark-section" style={{ background: '#111827', padding: 'var(--spacing-huge) 5%', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="container">
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.94)' }}>
                        Behavior Stabilization Milestones
                    </h2>
                    <div style={{ border: '1px solid rgba(255,255,255,0.16)', background: '#0f172a', padding: '1.25rem' }}>
                        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                            <div style={{ position: 'absolute', left: '2%', right: '2%', top: '1.2rem', height: '1px', background: 'rgba(255,255,255,0.16)', zIndex: 0 }} />
                            {[
                                { day: 'Day 1', title: 'System Activation' },
                                { day: 'Day 30', title: 'Behavior Pattern Visibility' },
                                { day: 'Day 60', title: 'Early Drift Intervention' },
                                { day: 'Day 90', title: 'Culture Stabilized' }
                            ].map((item) => (
                                <div key={item.day} style={{ position: 'relative', zIndex: 1, background: '#111827', padding: '0.5rem 0.75rem' }}>
                                    <p style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, color: 'rgba(255,255,255,0.56)', marginBottom: '0.55rem' }}>
                                        {item.day}
                                    </p>
                                    <p style={{ fontSize: '0.98rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>{item.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="light-section" style={{ background: '#fff', padding: 'var(--spacing-huge) 5%', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <div className="container">
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.02em' }}>
                        What Changes by Day 90
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1px', background: '#e5e7eb', border: '1px solid #e5e7eb' }}>
                        {[
                            { day: 'Day 30', text: 'Behavior patterns become measurable.' },
                            { day: 'Day 60', text: 'Managers intervene earlier when execution begins to drift.' },
                            { day: 'Day 90', text: 'Customer experience becomes consistent across departments.' }
                        ].map((item) => (
                            <div key={item.day} style={{ background: '#fff', padding: '2.25rem' }}>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.8rem' }}>{item.day}</h3>
                                <p style={{ fontSize: '0.98rem', color: '#4b5563', lineHeight: 1.6 }}>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="light-section" style={{ background: '#f8f9fa', padding: 'var(--spacing-huge) 5%', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <div className="container" style={{ maxWidth: '980px' }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                        Why This Rollout Works
                    </h2>
                    <p style={{ fontSize: '1.08rem', color: '#4b5563', lineHeight: 1.7, marginBottom: '1rem' }}>
                        Most dealership initiatives fail because they attempt large behavioral changes all at once.
                    </p>
                    <p style={{ fontSize: '1.08rem', color: '#4b5563', lineHeight: 1.7, marginBottom: '1rem' }}>
                        AutoDriveCX installs consistency gradually.
                    </p>
                    <p style={{ fontSize: '1.08rem', color: '#111827', lineHeight: 1.7 }}>
                        Managers lead the change. <br />
                        Teams experience reinforcement instead of disruption.
                    </p>
                </div>
            </section>

            <section
                className="dark-section"
                style={{ background: '#111827', padding: 'var(--spacing-huge) 5%', borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
                <div className="container" style={{ maxWidth: '860px' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.4rem', letterSpacing: '-0.02em', color: '#fff' }}>
                        Is This Happening in Your Store?
                    </h2>
                    <p style={{ fontSize: '1.04rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, marginBottom: '1.1rem' }}>
                        If you&apos;re seeing any of the following patterns in your dealership, it may be time for a short implementation conversation:
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.4rem 0' }}>
                        <li style={{ fontSize: '1.04rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.65, marginBottom: '0.65rem' }}>
                            • CSI or gross slipping without a clear root cause
                        </li>
                        <li style={{ fontSize: '1.04rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.65, marginBottom: '0.65rem' }}>
                            • Managers stuck in fire drills instead of reinforcement
                        </li>
                        <li style={{ fontSize: '1.04rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.65, marginBottom: '0.65rem' }}>
                            • Inconsistent handoffs between sales, service, and BDC
                        </li>
                        <li style={{ fontSize: '1.04rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.65 }}>
                            • Standards changing by shift, by person, or by mood
                        </li>
                    </ul>
                    <p style={{ fontSize: '1.04rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, marginBottom: '0.85rem' }}>
                        The implementation call is a short working session.
                        <br />
                        We map AutoDriveCX to your dealership structure and confirm whether the deployment model fits.
                    </p>
                    <p style={{ fontSize: '1.04rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, marginBottom: '2rem' }}>
                        No commitment.
                        <br />
                        No disruption plan.
                        <br />
                        Just clarity.
                    </p>
                    <p style={{ fontSize: '1.04rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, marginBottom: '1.4rem' }}>
                        Most dealerships use this call to pressure-test whether the system would actually work inside their store before making any decisions.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <a
                            href="https://calendar.app.google/QWRXFH9k24iZnBZWA"
                            target="_blank"
                            rel="noopener"
                            className="btn btn-primary"
                            style={{ textDecoration: 'none' }}
                        >
                            Schedule Implementation Call
                        </a>
                        <a href="#deployment-map" className="btn btn-ghost" style={{ textDecoration: 'none' }}>
                            View Deployment Plan
                        </a>
                    </div>
                </div>
            </section>

            <section className="dark-section" style={{ padding: '8rem 5%', background: '#0a0b0d', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="container">
                    <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#fff', marginBottom: '2rem' }}>
                        See How AutoDriveCX Would Install in Your Store
                    </h2>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a
                            href="https://calendar.app.google/QWRXFH9k24iZnBZWA"
                            target="_blank"
                            rel="noopener"
                            className="btn btn-primary"
                            style={{ textDecoration: 'none' }}
                        >
                            Schedule Implementation Call
                        </a>
                        <Link to="/#beta" className="btn btn-ghost" style={{ textDecoration: 'none' }}>
                            Join Private Beta
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default SampleRolloutPlan;
