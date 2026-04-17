import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav style={{
      ...styles.navbar,
      ...(scrolled ? styles.navbarScrolled : {})
    }}>
      <div style={styles.navContainer}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🎫</span>
          <span style={styles.logoText}>TechCorp Support</span>
        </div>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={styles.desktopMenu}>
          <button onClick={() => scrollToSection('features')} style={styles.navLink}>Features</button>
          <button onClick={() => scrollToSection('submit-ticket')} style={styles.navLink}>Submit Ticket</button>
          <button onClick={() => scrollToSection('check-status')} style={styles.navLink}>Check Status</button>
          <Link href="/admin" style={styles.adminButton}>
            <span>📊</span> Admin Dashboard
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          style={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={styles.mobileMenu}>
          <button onClick={() => scrollToSection('features')} style={styles.mobileLink}>Features</button>
          <button onClick={() => scrollToSection('submit-ticket')} style={styles.mobileLink}>Submit Ticket</button>
          <button onClick={() => scrollToSection('check-status')} style={styles.mobileLink}>Check Status</button>
          <Link href="/admin" style={styles.mobileLink}>Admin Dashboard</Link>
        </div>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: '20px 0',
    transition: 'all 0.3s ease',
    background: 'transparent'
  },
  navbarScrolled: {
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
    padding: '12px 0'
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logoIcon: {
    fontSize: '28px'
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: 'white',
    transition: 'color 0.3s ease'
  },
  desktopMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px'
  },
  navLink: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.9)',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'all 0.3s ease'
  },
  adminButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: 'white',
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.3s ease'
  },
  mobileMenuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    className: 'mobile-menu-btn'
  },
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  },
  mobileLink: {
    background: 'none',
    border: 'none',
    color: '#333',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '12px',
    textAlign: 'left',
    borderRadius: '6px',
    textDecoration: 'none'
  }
};
