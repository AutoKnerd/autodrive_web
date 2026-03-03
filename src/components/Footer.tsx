import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="dark-section" style={{ padding: '4rem 5%', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <img src="/logo.png" alt="AutoDrive Logo" style={{ height: '52px', width: 'auto', opacity: 0.5, marginBottom: '1.5rem', filter: 'grayscale(1)' }} />
            <div style={{ opacity: 0.4, fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                &copy; {new Date().getFullYear()} AUTODRIVE. ALL RIGHTS RESERVED.
            </div>
        </footer>
    );
};

export default Footer;
