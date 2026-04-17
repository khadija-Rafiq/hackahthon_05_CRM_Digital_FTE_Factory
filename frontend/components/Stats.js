import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000';

export default function Stats() {
  const [stats, setStats] = useState({
    total_tickets: 0,
    open_tickets: 0,
    resolved_tickets: 0,
    total_customers: 0
  });

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const statItems = [
    { icon: '🎫', label: 'Total Tickets', value: stats.total_tickets, color: '#667eea' },
    { icon: '🔴', label: 'Open Tickets', value: stats.open_tickets, color: '#dc3545' },
    { icon: '✅', label: 'Resolved', value: stats.resolved_tickets, color: '#28a745' },
    { icon: '👥', label: 'Customers', value: stats.total_customers, color: '#764ba2' }
  ];

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Live Support Statistics</h2>
          <p style={styles.subtitle}>Real-time overview of our support performance</p>
        </div>
        <div style={styles.grid}>
          {statItems.map((item, index) => (
            <div key={index} style={styles.statCard}>
              <div style={{ ...styles.iconCircle, background: `${item.color}15` }}>
                <span style={styles.icon}>{item.icon}</span>
              </div>
              <div style={styles.statValue}>{item.value}</div>
              <div style={styles.statLabel}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '80px 20px',
    background: 'white'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px'
  },
  title: {
    fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
    fontWeight: '800',
    color: '#1a1a2e',
    margin: '0 0 10px 0'
  },
  subtitle: {
    fontSize: '1.05rem',
    color: '#6c757d',
    margin: 0
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '25px'
  },
  statCard: {
    background: 'white',
    padding: '35px 25px',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    border: '2px solid #f0f0f0',
    transition: 'all 0.3s ease'
  },
  iconCircle: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px'
  },
  icon: {
    fontSize: '2rem'
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '0.95rem',
    color: '#6c757d',
    fontWeight: '600'
  }
};
