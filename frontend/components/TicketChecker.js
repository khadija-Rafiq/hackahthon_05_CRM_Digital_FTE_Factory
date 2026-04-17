import { useState } from 'react';

const API_URL = 'http://localhost:8000';

export default function TicketChecker() {
  const [ticketId, setTicketId] = useState('');
  const [ticketResult, setTicketResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const checkTicket = async () => {
    if (!ticketId.trim()) {
      showAlert('Please enter a Ticket ID', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/tickets/${ticketId}`);
      if (!response.ok) throw new Error('Ticket not found');
      const ticket = await response.json();
      setTicketResult(ticket);
      setAlert({ show: false, message: '', type: '' });
    } catch (error) {
      showAlert('Ticket not found. Please check the ID.', 'error');
      setTicketResult(null);
    } finally {
      setLoading(false);
    }
  };

  const resolveTicket = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/tickets/${id}/resolve`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to resolve');
      window.alert('Ticket Resolved ✅');
      checkTicket();
    } catch (error) {
      window.alert('Error resolving ticket');
    }
  };

  return (
    <section id="check-status" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.badge}>🔍 Track Progress</span>
          <h2 style={styles.title}>Check Your Ticket Status</h2>
          <p style={styles.subtitle}>
            Enter your Ticket ID to view current status and conversation history
          </p>
        </div>

        <div style={styles.card}>
          {alert.show && (
            <div style={{
              ...styles.alert,
              ...(alert.type === 'success' ? styles.alertSuccess : styles.alertError)
            }}>
              {alert.message}
            </div>
          )}

          <div style={styles.searchBox}>
            <div style={styles.inputGroup}>
              <input
                style={styles.input}
                type="text"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                placeholder="e.g., TKT-1A2B3C4D"
                onKeyPress={(e) => e.key === 'Enter' && checkTicket()}
              />
              <button onClick={checkTicket} style={styles.button} disabled={loading}>
                {loading ? '🔍 Searching...' : '🔍 Check Status'}
              </button>
            </div>
          </div>

          {ticketResult && (
            <div style={styles.ticketCard}>
              <div style={styles.ticketHeader}>
                <div>
                  <p style={styles.ticketLabel}>Ticket ID</p>
                  <h3 style={styles.ticketValue}>{ticketResult.ticket_id}</h3>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  ...(ticketResult.status === 'open' ? styles.statusOpen : styles.statusResolved)
                }}>
                  {ticketResult.status === 'open' ? '🔴 Open' : '✅ Resolved'}
                </span>
              </div>

              <div style={styles.ticketBody}>
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Subject</span>
                    <span style={styles.infoValue}>{ticketResult.subject}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Created</span>
                    <span style={styles.infoValue}>
                      {new Date(ticketResult.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {ticketResult.messages && ticketResult.messages.length > 0 && (
                  <div style={styles.messages}>
                    <h4 style={styles.messagesTitle}>Conversation History</h4>
                    {ticketResult.messages.map((msg, idx) => (
                      <div key={idx} style={{
                        ...styles.message,
                        ...(msg.sender === 'customer' ? styles.messageCustomer : styles.messageAgent)
                      }}>
                        <div style={styles.messageHeader}>
                          <span style={styles.messageSender}>
                            {msg.sender === 'customer' ? '👤 You' : '🤖 Support Agent'}
                          </span>
                          <span style={styles.messageTime}>
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p style={styles.messageContent}>{msg.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {ticketResult.status === 'open' && (
                  <button
                    onClick={() => resolveTicket(ticketResult.ticket_id)}
                    style={styles.resolveButton}
                  >
                    <span>✅</span> Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          )}
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
    maxWidth: '900px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px'
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
    margin: 0
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
  },
  alert: {
    padding: '16px 20px',
    borderRadius: '12px',
    marginBottom: '25px',
    fontWeight: '500'
  },
  alertSuccess: {
    background: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
  },
  alertError: {
    background: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb'
  },
  searchBox: {
    marginBottom: '30px'
  },
  inputGroup: {
    display: 'flex',
    gap: '15px'
  },
  input: {
    flex: 1,
    padding: '16px 20px',
    border: '2px solid #e1e8ed',
    borderRadius: '12px',
    fontSize: '1.1rem',
    outline: 'none'
  },
  button: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1.05rem',
    fontWeight: '700',
    whiteSpace: 'nowrap'
  },
  ticketCard: {
    borderRadius: '16px',
    overflow: 'hidden',
    border: '2px solid #e1e8ed',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  ticketHeader: {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    padding: '25px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #dee2e6'
  },
  ticketLabel: {
    margin: '0 0 5px 0',
    fontSize: '0.85rem',
    color: '#6c757d',
    fontWeight: '500'
  },
  ticketValue: {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#1a1a2e'
  },
  statusBadge: {
    padding: '10px 20px',
    borderRadius: '25px',
    fontWeight: '700',
    fontSize: '0.95rem'
  },
  statusOpen: {
    background: '#fff3cd',
    color: '#856404'
  },
  statusResolved: {
    background: '#d4edda',
    color: '#155724'
  },
  ticketBody: {
    padding: '30px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '25px',
    marginBottom: '25px'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  infoLabel: {
    fontSize: '0.85rem',
    color: '#6c757d',
    fontWeight: '600'
  },
  infoValue: {
    fontSize: '1.05rem',
    color: '#1a1a2e',
    fontWeight: '600'
  },
  messages: {
    marginTop: '25px'
  },
  messagesTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '15px'
  },
  message: {
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '15px'
  },
  messageCustomer: {
    background: '#f8f9fa',
    borderLeft: '4px solid #667eea'
  },
  messageAgent: {
    background: '#e8f5e9',
    borderLeft: '4px solid #28a745'
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px'
  },
  messageSender: {
    fontWeight: '700',
    fontSize: '0.9rem'
  },
  messageTime: {
    fontSize: '0.8rem',
    color: '#6c757d'
  },
  messageContent: {
    margin: 0,
    color: '#495057',
    lineHeight: '1.6'
  },
  resolveButton: {
    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1.05rem',
    fontWeight: '700',
    marginTop: '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.4)'
  }
};
