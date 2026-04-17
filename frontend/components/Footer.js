export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          <div style={styles.brand}>
            <div style={styles.logo}>
              <span style={styles.logoIcon}>🎫</span>
              <span style={styles.logoText}>TechCorp Support</span>
            </div>
            <p style={styles.brandDesc}>
              AI-powered customer support system providing 24/7 assistance with instant ticket creation and email notifications.
            </p>
          </div>

          <div style={styles.links}>
            <h4 style={styles.linksTitle}>Quick Links</h4>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={styles.link}>
              Home
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} style={styles.link}>
              Features
            </button>
            <button onClick={() => document.getElementById('submit-ticket')?.scrollIntoView({ behavior: 'smooth' })} style={styles.link}>
              Submit Ticket
            </button>
            <button onClick={() => document.getElementById('check-status')?.scrollIntoView({ behavior: 'smooth' })} style={styles.link}>
              Check Status
            </button>
          </div>

          <div style={styles.contact}>
            <h4 style={styles.contactTitle}>Contact</h4>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📧</span>
              <span>support@techcorp.com</span>
            </div>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>🕐</span>
              <span>24/7 AI Support</span>
            </div>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>⚡</span>
              <span>Avg. Response: &lt;5 min</span>
            </div>
          </div>
        </div>

        <div style={styles.bottom}>
          <p style={styles.copyright}>
            © {currentYear} TechCorp Support System. All rights reserved.
          </p>
          <div style={styles.badges}>
            <span style={styles.badge}>Built with Next.js</span>
            <span style={styles.badge}>FastAPI Backend</span>
            <span style={styles.badge}>SQLite CRM</span>
          </div>
          <p style={styles.madeBy}>
            Made with <span style={styles.heart}>❤️</span> by <span style={styles.name}>Khadija Rafiq</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#1a1a2e',
    color: 'white',
    padding: '60px 20px 30px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginBottom: '40px'
  },
  brand: {},
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px'
  },
  logoIcon: {
    fontSize: '28px'
  },
  logoText: {
    fontSize: '1.3rem',
    fontWeight: '700'
  },
  brandDesc: {
    color: 'rgba(255,255,255,0.7)',
    lineHeight: '1.6',
    fontSize: '0.95rem'
  },
  links: {},
  linksTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '20px',
    color: 'white'
  },
  link: {
    display: 'block',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.7)',
    padding: '8px 0',
    cursor: 'pointer',
    fontSize: '0.95rem',
    textAlign: 'left',
    transition: 'color 0.3s ease'
  },
  contact: {},
  contactTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '20px',
    color: 'white'
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.95rem'
  },
  contactIcon: {
    fontSize: '1.2rem'
  },
  bottom: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px'
  },
  copyright: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.9rem',
    margin: 0
  },
  badges: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  badge: {
    background: 'rgba(255,255,255,0.1)',
    padding: '6px 14px',
    borderRadius: '15px',
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.8)'
  },
  madeBy: {
    width: '100%',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.95rem',
    marginTop: '20px',
    padding: '15px 0',
    borderTop: '1px solid rgba(255,255,255,0.1)'
  },
  heart: {
    color: '#ff4757'
  },
  name: {
    color: '#667eea',
    fontWeight: '700'
  }
};
