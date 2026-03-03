import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
    return (
        <nav style={{ padding: '2rem 5%', position: 'absolute', width: '100%', zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
                    <img src="/logo.png" alt="AutoDrive" style={{ height: '48px', width: 'auto', filter: 'brightness(0.9)' }} />
                </Link>
                <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)' }}></div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
                    CX Performance
                </span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <motion.a
                    href="#login"
                    className="btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        fontSize: '0.75rem',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '4px',
                        backgroundColor: 'var(--logo-blue)',
                        color: '#fff',
                        fontWeight: 800,
                        transition: 'all 0.3s ease',
                        boxShadow: '0 10px 20px rgba(52, 136, 186, 0.4)',
                        textDecoration: 'none'
                    }}
                >
                    Log In
                </motion.a>
                <motion.a
                    href="#beta"
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ fontSize: '0.75rem', padding: '0.75rem 1.5rem', borderRadius: '4px', boxShadow: '0 10px 20px rgba(102, 184, 72, 0.3)', textDecoration: 'none' }}
                >
                    Join Private Beta
                </motion.a>
            </div>
        </nav>
    );
};

export default Navigation;
