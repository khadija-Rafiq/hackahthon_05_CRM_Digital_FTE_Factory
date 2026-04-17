const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Responses',
    description: 'Our intelligent system understands your queries and provides accurate answers instantly.'
  },
  {
    icon: '⚡',
    title: 'Instant Ticket Creation',
    description: 'Submit a ticket and get a unique ID immediately. Track your request in real-time.'
  },
  {
    icon: '📧',
    title: 'Email Notifications',
    description: 'Receive confirmation and resolution updates directly to your email inbox.'
  },
  {
    icon: '🔍',
    title: 'Real-Time Tracking',
    description: 'Check your ticket status anytime using your unique Ticket ID.'
  },
  {
    icon: '✅',
    title: 'Easy Resolution',
    description: 'Mark tickets as resolved with a single click when your issue is solved.'
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security standards.'
  }
];

export default function Features() {
  return (
    <section id="features" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.badge}>✨ Why Choose Us</span>
          <h2 style={styles.title}>Powerful Support Features</h2>
          <p style={styles.subtitle}>
            Everything you need for fast, efficient customer support
          </p>
        </div>
        <div style={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.icon}>{feature.icon}</div>
              <h3 style={styles.cardTitle}>{feature.title}</h3>
              <p style={styles.cardDesc}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '100px 20px',
    background: '#f8f9fa'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px'
  },
  badge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '15px'
  },
  title: {
    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
    fontWeight: '800',
    color: '#1a1a2e',
    margin: '0 0 15px 0'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#6c757d',
    margin: 0,
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px'
  },
  card: {
    background: 'white',
    padding: '35px 30px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    transition: 'all 0.3s ease',
    textAlign: 'center'
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '20px',
    display: 'inline-block'
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 12px 0'
  },
  cardDesc: {
    fontSize: '1rem',
    color: '#6c757d',
    margin: 0,
    lineHeight: '1.6'
  }
};
