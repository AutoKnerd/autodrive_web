import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const IndividualTrial: React.FC = () => {
    const { pathname, hash } = useLocation();
    const enrollmentRef = useRef<HTMLElement | null>(null);
    const startTrialAnchor = '/start-trial#trial-enrollment';
    const directCheckoutUrl = import.meta.env.VITE_STRIPE_CHECKOUT_URL as string | undefined;

    useEffect(() => {
        if ((pathname === '/start-trial' && hash === '#trial-enrollment') && enrollmentRef.current) {
            enrollmentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [pathname, hash]);

    const handleCheckoutStart = () => {
        if (directCheckoutUrl) {
            window.location.assign(directCheckoutUrl);
            return;
        }

        window.location.assign('/api/create-checkout-session');
    };

    return (
        <div>
            <Navigation />

            <section className="dark-section home-hero" style={{ minHeight: '92vh', paddingTop: '140px' }}>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.62)', fontWeight: 800, marginBottom: '1rem' }}>
                        INDIVIDUAL ENTRY PATH
                    </p>
                    <h1 style={{ fontSize: 'clamp(2.2rem, 7vw, 4.8rem)', lineHeight: 1.04, color: '#fff', maxWidth: '860px', marginBottom: '1rem' }}>
                        Try AutoDriveCX - Individual Trial
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.82)', maxWidth: '900px', fontSize: 'clamp(1rem, 2vw, 1.3rem)', marginBottom: '0.75rem' }}>
                        Experience the behavioral reinforcement system used to stabilize execution inside dealership sales floors and service lanes.
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.66)', maxWidth: '900px', fontSize: '1rem', marginBottom: '2rem' }}>
                        This trial allows individual professionals to experience the system before dealership-wide deployment.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link to={startTrialAnchor} className="btn btn-primary">
                            Start 30-Day Individual Trial
                        </Link>
                        <Link to="/sample-rollout-plan" className="btn btn-ghost" style={{ textDecoration: 'none' }}>
                            Explore Dealership Implementation
                        </Link>
                    </div>
                </div>
            </section>

            <section className="light-section" style={{ padding: '3rem 5% 2.5rem 5%', backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
                <div className="container" style={{ maxWidth: '980px' }}>
                    <blockquote style={{ borderLeft: '4px solid var(--logo-blue)', padding: '1.1rem 1.2rem', background: '#fff', boxShadow: '0 10px 24px rgba(0,0,0,0.05)' }}>
                        <p style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)', lineHeight: 1.45, color: '#111827', fontWeight: 600 }}>
                            "We already use apps to improve our physical fitness.
                            <br />
                            AutoDriveCX applies the same idea to the habits that drive our mental and financial performance."
                        </p>
                    </blockquote>
                </div>
            </section>

            <section className="light-section" style={{ paddingTop: '2.5rem' }}>
                <div className="container">
                    <h2 style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', marginBottom: '1.8rem' }}>
                        What You Experience In The Trial
                    </h2>
                    <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                        <article style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', padding: '1.2rem' }}>
                            <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--logo-blue)', fontWeight: 800, marginBottom: '0.5rem' }}>Execution Reps</p>
                            <p style={{ color: '#111827', marginBottom: '0.75rem' }}>
                                Short operational reps designed to reinforce customer interaction habits during real dealership workflow.
                            </p>
                            <p style={{ color: '#374151', fontWeight: 700 }}>Typical time commitment: 3-5 minutes.</p>
                        </article>
                        <article style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', padding: '1.2rem' }}>
                            <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--logo-green)', fontWeight: 800, marginBottom: '0.5rem' }}>Behavior Logging</p>
                            <p style={{ color: '#111827' }}>
                                Each rep is logged and time-stamped so users can see how consistency improves over time.
                            </p>
                        </article>
                        <article style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', padding: '1.2rem' }}>
                            <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#111827', fontWeight: 800, marginBottom: '0.5rem' }}>Execution Drift Awareness</p>
                            <p style={{ color: '#111827' }}>
                                See how the system detects behavioral drift and signals when execution starts slipping.
                            </p>
                        </article>
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                        <Link to={startTrialAnchor} className="btn btn-primary">
                            Start 30-Day Individual Trial
                        </Link>
                    </div>
                </div>
            </section>

            <section className="dark-section" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
                <div className="container">
                    <h2 style={{ color: '#fff', marginBottom: '1rem', fontSize: 'clamp(1.9rem, 4vw, 2.8rem)' }}>
                        Why Individual Users Try It
                    </h2>
                    <ul style={{ color: 'rgba(255,255,255,0.85)', display: 'grid', gap: '0.6rem', paddingLeft: '1.2rem', marginBottom: '1.8rem' }}>
                        <li>Improve execution under pressure</li>
                        <li>Reinforce customer interaction habits</li>
                        <li>Build consistent dealership workflow habits</li>
                        <li>Understand the reinforcement system managers use</li>
                        <li>Sharpen sales and service lane interactions</li>
                    </ul>
                    <Link to={startTrialAnchor} className="btn btn-primary">
                        Start 30-Day Individual Trial
                    </Link>
                </div>
            </section>

            <section className="light-section">
                <div className="container">
                    <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', marginBottom: '1.4rem' }}>
                        How The Trial Works
                    </h2>
                    <div style={{ display: 'grid', gap: '1rem', maxWidth: '900px' }}>
                        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', padding: '1rem 1.2rem' }}>
                            <p style={{ fontWeight: 800, marginBottom: '0.45rem' }}>Step 1 - Start Individual Trial</p>
                            <p>Create account and activate your 30-day trial.</p>
                        </div>
                        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', padding: '1rem 1.2rem' }}>
                            <p style={{ fontWeight: 800, marginBottom: '0.45rem' }}>Step 2 - Complete Daily Execution Reps</p>
                            <p>Short reps reinforce customer interaction habits inside real dealership workflow.</p>
                        </div>
                        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', padding: '1rem 1.2rem' }}>
                            <p style={{ fontWeight: 800, marginBottom: '0.45rem' }}>Step 3 - Review Behavior Signals</p>
                            <p>See how the AutoDriveCX reinforcement loop detects execution drift.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="trial-enrollment" ref={enrollmentRef} className="dark-section" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
                <div className="container" style={{ maxWidth: '760px' }}>
                    <h2 style={{ color: '#fff', marginBottom: '0.9rem', fontSize: 'clamp(1.9rem, 4vw, 2.8rem)' }}>
                        Trial Enrollment
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.72)', marginBottom: '1.6rem' }}>
                        Start your individual trial now.
                    </p>
                    <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '10px', padding: 'clamp(1.6rem, 4vw, 2.4rem)', maxWidth: '620px', margin: '0 auto' }}>
                        <h3 style={{ color: '#fff', fontSize: 'clamp(1.35rem, 3vw, 1.8rem)', marginBottom: '0.7rem', textAlign: 'center' }}>
                            AutoDriveCX Individual
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.78)', marginBottom: '1rem', lineHeight: 1.65, textAlign: 'center' }}>
                            For sales consultants, service advisors, and BDC professionals who want to strengthen execution habits and customer interaction consistency.
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.86)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, marginBottom: '0.75rem' }}>
                            Included in the trial
                        </p>
                        <ul style={{ color: 'rgba(255,255,255,0.88)', paddingLeft: '1.2rem', display: 'grid', gap: '0.45rem', marginBottom: '1rem' }}>
                            <li>Daily Execution Reps (3-5 minutes)</li>
                            <li>Behavioral performance tracking</li>
                            <li>Execution drift detection</li>
                            <li>Reinforcement habit building</li>
                        </ul>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.18)', margin: '1.1rem 0', paddingTop: '1rem' }}>
                            <p style={{ color: '#fff', fontWeight: 800, lineHeight: 1.6 }}>
                                30-Day Free Trial
                                <br />
                                <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.82)' }}>Then $29/month - cancel anytime.</span>
                            </p>
                        </div>
                        <button type="button" onClick={handleCheckoutStart} className="btn btn-primary" style={{ width: '100%', fontWeight: 800, padding: '1.1rem 1.2rem' }}>
                            Start 30-Day Individual Trial
                        </button>
                        <p style={{ marginTop: '0.85rem', color: 'rgba(255,255,255,0.62)', fontSize: '0.85rem', textAlign: 'center' }}>
                            No charge today • Cancel anytime before billing begins
                        </p>
                    </div>
                </div>
            </section>

            <section className="light-section" style={{ paddingTop: '3.5rem' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '1rem' }}>
                        Dealership Deployment
                    </h2>
                    <p style={{ color: '#111827', lineHeight: 1.7, marginBottom: '0.9rem' }}>
                        AutoDriveCX is designed to stabilize execution across the entire dealership.
                    </p>
                    <p style={{ color: '#374151', lineHeight: 1.7, marginBottom: '1.6rem' }}>
                        Many individual users start the trial to experience the reinforcement system and later introduce it to their managers or dealer principals.
                    </p>
                    <a href="https://calendar.app.google/QWRXFH9k24iZnBZWA" target="_blank" rel="noopener" className="btn btn-primary">
                        Schedule Dealership Implementation
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default IndividualTrial;
