import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
    return (
        <nav style={{ padding: 'clamp(0.75rem, 3vw, 1.5rem) 5%', position: 'absolute', width: '100%', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <img src="/logo.png" alt="AutoDrive" style={{ height: 'clamp(28px, 6vw, 42px)', width: 'auto', filter: 'brightness(1)' }} />
                </Link>
                <div className="hide-mobile" style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)' }}></div>
                <span className="hide-mobile" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
                    CX Performance
                </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <motion.a
                    href="#login"
                    className="btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        fontSize: '0.7rem',
                        padding: '0.6rem 1rem',
                        borderRadius: '4px',
                        backgroundColor: 'var(--logo-blue)',
                        color: '#fff',
                        fontWeight: 800,
                        transition: 'all 0.3s ease',
                        boxShadow: '0 10px 20px rgba(52, 136, 186, 0.4)',
                        textDecoration: 'none',
                        textAlign: 'center'
                    }}
                >
                    Log In
                </motion.a>
                <motion.a
                    href="#beta"
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ fontSize: '0.7rem', padding: '0.6rem 1rem', borderRadius: '4px', boxShadow: '0 10px 20px rgba(102, 184, 72, 0.3)', textDecoration: 'none', textAlign: 'center' }}
                >
                    Join Beta
                </motion.a>
            </div>
        </nav>

    );
};

export default Navigation;
