import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Calendar, X, Mail } from 'lucide-react';

const FloatingCTA: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [footerLift, setFooterLift] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const doc = document.documentElement;
            const maxScrollable = doc.scrollHeight - window.innerHeight;
            const progress = maxScrollable > 0 ? window.scrollY / maxScrollable : 0;
            
            // Show after 20% scroll
            setIsVisible(progress >= 0.2);

            // Lift up when footer is visible
            const pixelsFromBottom = doc.scrollHeight - (window.scrollY + window.innerHeight);
            setFooterLift(Math.max(0, 140 - pixelsFromBottom));
        };

        const onResize = () => {
            setIsMobile(window.innerWidth <= 768);
            onScroll();
        };

        onResize();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div 
            style={{ 
                position: 'fixed', 
                right: isMobile ? '20px' : '30px', 
                bottom: `${(isMobile ? 20 : 30) + footerLift}px`,
                zIndex: 2000,
                transition: 'bottom 220ms ease'
            }}
        >
            <AnimatePresence>
                {isVisible && (
                    <div style={{ position: 'relative' }}>
                        {/* Expandable Menu */}
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                    style={{
                                        position: 'absolute',
                                        bottom: isMobile ? '70px' : '80px',
                                        right: 0,
                                        width: '280px',
                                        background: '#fff',
                                        borderRadius: '20px',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
                                        padding: '1.5rem',
                                        color: '#111827',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.75rem'
                                    }}
                                >
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>How can we help?</h3>
                                    </div>
                                    
                                    <a 
                                        href="https://calendar.app.google/2gZsELsJfGXFUYDq5" 
                                        target="_blank" 
                                        rel="noopener"
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '0.75rem', 
                                            padding: '1rem', 
                                            background: 'var(--logo-green)', 
                                            color: '#fff', 
                                            borderRadius: '12px',
                                            textDecoration: 'none',
                                            fontWeight: 800,
                                            fontSize: '0.95rem',
                                            transition: 'transform 0.2s',
                                            boxShadow: '0 4px 12px rgba(102, 184, 72, 0.2)'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <Calendar size={18} />
                                        Schedule Demo
                                    </a>

                                    <a 
                                        href="mailto:sprocket@autoknerd.com" 
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '0.75rem', 
                                            padding: '1rem', 
                                            background: '#f3f4f6', 
                                            color: '#111827', 
                                            borderRadius: '12px',
                                            textDecoration: 'none',
                                            fontWeight: 800,
                                            fontSize: '0.95rem',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <Mail size={18} />
                                        Email to Inquire
                                    </a>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Main Button */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleOpen}
                            style={{
                                width: isMobile ? '56px' : '64px',
                                height: isMobile ? '56px' : '64px',
                                borderRadius: '50%',
                                background: isOpen ? '#111827' : 'var(--logo-green)',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 10px 24px rgba(0,0,0,0.2)',
                                position: 'relative'
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ opacity: 0, rotate: -45 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: 45 }}
                                    >
                                        <X size={28} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="chat"
                                        initial={{ opacity: 0, rotate: 45 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: -45 }}
                                    >
                                        <MessageSquare size={28} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                        
                        {!isOpen && !isMobile && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 }}
                                style={{
                                    position: 'absolute',
                                    right: '80px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: '#111827',
                                    color: '#fff',
                                    padding: '0.7rem 1.4rem',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    fontWeight: 700,
                                    whiteSpace: 'nowrap',
                                    pointerEvents: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            >
                                Contact Us
                                <div style={{
                                    position: 'absolute',
                                    right: '-6px',
                                    top: '50%',
                                    marginTop: '-6px',
                                    width: '12px',
                                    height: '12px',
                                    background: '#111827',
                                    transform: 'rotate(45deg)'
                                }} />
                            </motion.div>
                        )}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FloatingCTA;
