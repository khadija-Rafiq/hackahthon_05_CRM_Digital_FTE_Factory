export default function Hero() {
  return (
    <section style={styles.hero}>
      <div style={styles.heroOverlay}></div>
      <div style={styles.heroContent}>
        <div style={styles.badge}>
          <span style={styles.badgeIcon}>⚡</span>
          <span>24/7 AI-Powered Support</span>
        </div>
        <h1 style={styles.title}>
          Get Help When You Need It
        </h1>
        <p style={styles.subtitle}>
          Our intelligent support system handles your queries instantly. 
          Submit a ticket, track status, and get responses via email - all automated.
        </p>
        <div style={styles.ctaGroup}>
          <button 
            onClick={() => document.getElementById('submit-ticket').scrollIntoView({ behavior: 'smooth' })}
            style={styles.primaryBtn}
          >
            📝 Submit a Ticket
          </button>
          <button 
            onClick={() => document.getElementById('check-status').scrollIntoView({ behavior: 'smooth' })}
            style={styles.secondaryBtn}
          >
            🔍 Check Status
          </button>
        </div>
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>24/7</div>
            <div style={styles.statLabel}>Availability</div>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>&lt;5min</div>
            <div style={styles.statLabel}>Response Time</div>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>100%</div>
            <div style={styles.statLabel}>Automated</div>
          </div>
        </div>
      </div>
      <div style={styles.scrollIndicator}>
        <span>Scroll to explore</span>
        <span style={styles.scrollArrow}>↓</span>
      </div>
    </section>
  );
}

const styles = {
  hero: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: '120px 20px 60px',
    textAlign: 'center'
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)',
    pointerEvents: 'none'
  },
  heroContent: {
    maxWidth: '900px',
    position: 'relative',
    zIndex: 1
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    padding: '10px 20px',
    borderRadius: '30px',
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: '500',
    marginBottom: '25px',
    border: '1px solid rgba(255,255,255,0.2)'
  },
  badgeIcon: {
    fontSize: '1.2rem'
  },
  title: {
    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
    fontWeight: '800',
    color: 'white',
    margin: '0 0 20px 0',
    lineHeight: '1.1',
    textShadow: '0 4px 20px rgba(0,0,0,0.2)'
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    color: 'rgba(255,255,255,0.9)',
    margin: '0 0 35px 0',
    lineHeight: '1.6',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  ctaGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '50px'
  },
  primaryBtn: {
    background: 'white',
    color: '#667eea',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease'
  },
  secondaryBtn: {
    background: 'rgba(255,255,255,0.15)',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.3)',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease'
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '30px',
    flexWrap: 'wrap'
  },
  statItem: {
    textAlign: 'center'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '800',
    color: 'white',
    marginBottom: '5px'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500'
  },
  statDivider: {
    width: '1px',
    height: '40px',
    background: 'rgba(255,255,255,0.3)'
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.85rem',
    animation: 'bounce 2s infinite'
  },
  scrollArrow: {
    fontSize: '1.5rem'
  }
};
