import { useState, useEffect } from 'react';
import Link from 'next/link';

const API_URL = 'http://localhost:8000';

export default function Admin() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [ticketsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/tickets`),
        fetch(`${API_URL}/api/stats`)
      ]);
      
      if (ticketsRes.ok) {
        const ticketsData = await ticketsRes.json();
        setTickets(ticketsData);
      }
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveTicket = async (ticketId) => {
    try {
      await fetch(`${API_URL}/api/tickets/${ticketId}/resolve`, { method: 'POST' });
      fetchData();
    } catch (error) {
      console.error('Failed to resolve ticket:', error);
    }
  };

  const filteredTickets = filter === 'all' 
    ? tickets 
    : tickets.filter(t => t.status === filter);

  const statCards = [
    { label: 'Total Tickets', value: stats.total_tickets || 0, icon: '🎫', color: '#667eea' },
    { label: 'Open Tickets', value: stats.open_tickets || 0, icon: '🔴', color: '#dc3545' },
    { label: 'Resolved', value: stats.resolved_tickets || 0, icon: '✅', color: '#28a745' },
    { label: 'Customers', value: stats.total_customers || 0, icon: '👥', color: '#764ba2' }
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link href="/" style={styles.backLink}>
            ← Back to Home
          </Link>
          <h1 style={styles.title}>📊 Admin Dashboard</h1>
          <p style={styles.subtitle}>Monitor and manage all support tickets</p>
        </div>
      </header>

      <div style={styles.main}>
        {/* Stats */}
        <div style={styles.statsGrid}>
          {statCards.map((stat, idx) => (
            <div key={idx} style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: `${stat.color}15` }}>
                <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
              </div>
              <div style={{ ...styles.statValue, color: stat.color }}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tickets Table */}
        <div style={styles.ticketsSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>All Tickets</h2>
            <div style={styles.filters}>
              {['all', 'open', 'resolved'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    ...styles.filterBtn,
                    ...(filter === f ? styles.filterBtnActive : {})
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={styles.loading}>Loading tickets...</div>
          ) : filteredTickets.length === 0 ? (
            <div style={styles.empty}>No tickets found</div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Ticket ID</th>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Subject</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Created</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} style={styles.tr}>
                      <td style={styles.td}>
                        <code style={styles.ticketCode}>{ticket.id}</code>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.customerInfo}>
                          <div style={styles.customerName}>{ticket.name}</div>
                          <div style={styles.customerEmail}>{ticket.email}</div>
                        </div>
                      </td>
                      <td style={styles.td}>{ticket.subject}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          ...(ticket.status === 'open' ? styles.statusOpen : styles.statusResolved)
                        }}>
                          {ticket.status === 'open' ? '🔴 Open' : '✅ Resolved'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        {ticket.status === 'open' && (
                          <button
                            onClick={() => resolveTicket(ticket.id)}
                            style={styles.resolveBtn}
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8f9fa'
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '30px 20px',
    color: 'white'
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  backLink: {
    color: 'rgba(255,255,255,0.9)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    marginBottom: '15px',
    display: 'inline-block'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    margin: '0 0 10px 0'
  },
  subtitle: {
    fontSize: '1.05rem',
    color: 'rgba(255,255,255,0.9)',
    margin: 0
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '30px 20px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
  },
  statIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 15px'
  },
  statValue: {
    fontSize: '2.2rem',
    fontWeight: '800',
    marginBottom: '5px'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#6c757d',
    fontWeight: '600'
  },
  ticketsSection: {
    background: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  sectionTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#1a1a2e',
    margin: 0
  },
  filters: {
    display: 'flex',
    gap: '10px'
  },
  filterBtn: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: '2px solid #e1e8ed',
    background: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    color: '#6c757d'
  },
  filterBtnActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: '2px solid transparent'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#6c757d'
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#6c757d',
    fontSize: '1.1rem'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '15px 12px',
    borderBottom: '2px solid #e1e8ed',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#6c757d',
    textTransform: 'uppercase'
  },
  tr: {
    borderBottom: '1px solid #f0f0f0'
  },
  td: {
    padding: '15px 12px',
    fontSize: '0.95rem'
  },
  ticketCode: {
    background: '#f8f9fa',
    padding: '6px 12px',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '0.9rem',
    color: '#667eea'
  },
  customerInfo: {},
  customerName: {
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '3px'
  },
  customerEmail: {
    fontSize: '0.85rem',
    color: '#6c757d'
  },
  statusBadge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontWeight: '700',
    fontSize: '0.85rem',
    display: 'inline-block'
  },
  statusOpen: {
    background: '#fff3cd',
    color: '#856404'
  },
  statusResolved: {
    background: '#d4edda',
    color: '#155724'
  },
  resolveBtn: {
    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.85rem'
  }
};
