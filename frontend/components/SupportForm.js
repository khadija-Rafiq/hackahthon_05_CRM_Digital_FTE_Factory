import { useState } from 'react';

const API_URL = 'http://localhost:8000';

export default function SupportForm() {
  const [submitMethod, setSubmitMethod] = useState('email'); // 'email' or 'whatsapp'
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [whatsappData, setWhatsappData] = useState({ name: '', phone: '', subject: '', message: '' });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Client-side validation
    if (!formData.name.trim()) {
      showAlert('❌ Please enter your full name', 'error');
      setSubmitting(false);
      return;
    }
    if (!formData.email.trim()) {
      showAlert('❌ Please enter your email address', 'error');
      setSubmitting(false);
      return;
    }
    if (!formData.subject.trim()) {
      showAlert('❌ Please enter a subject', 'error');
      setSubmitting(false);
      return;
    }
    if (!formData.message.trim()) {
      showAlert('❌ Please describe your issue in the message field', 'error');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || 'Failed to create ticket';
        showAlert(`❌ ${errorMessage}`, 'error');
        setSubmitting(false);
        return;
      }
      
      const result = await response.json();
      showAlert(`✅ Ticket created! Your Ticket ID: ${result.ticket_id}. Confirmation email sent to ${formData.email}`, 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error:', error);
      showAlert(`❌ Error creating ticket: ${error.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Client-side validation
    if (!whatsappData.name.trim()) {
      showAlert('❌ Please enter your full name', 'error');
      setSubmitting(false);
      return;
    }
    if (!whatsappData.phone.trim()) {
      showAlert('❌ Please enter your WhatsApp number', 'error');
      setSubmitting(false);
      return;
    }
    if (!whatsappData.subject.trim()) {
      showAlert('❌ Please enter a subject', 'error');
      setSubmitting(false);
      return;
    }
    if (!whatsappData.message.trim()) {
      showAlert('❌ Please describe your issue in the message field', 'error');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/whatsapp/ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(whatsappData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || 'Failed to create WhatsApp ticket';
        showAlert(`❌ ${errorMessage}`, 'error');
        setSubmitting(false);
        return;
      }
      
      const result = await response.json();
      showAlert(`✅ Ticket created! Your Ticket ID: ${result.ticket_id}. Confirmation sent to WhatsApp: ${result.phone}`, 'success');
      setWhatsappData({ name: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error:', error);
      showAlert(`❌ Error creating WhatsApp ticket: ${error.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="submit-ticket" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.badge}>📝 Get Help</span>
          <h2 style={styles.title}>Submit a Support Ticket</h2>
          <p style={styles.subtitle}>
            Fill out the form below and our AI assistant will respond via email or WhatsApp
          </p>
        </div>

        <div style={styles.formCard}>
          {alert.show && (
            <div style={{
              ...styles.alert,
              ...(alert.type === 'success' ? styles.alertSuccess : styles.alertError)
            }}>
              {alert.message}
            </div>
          )}

          {/* Method Switcher Tabs */}
          <div style={styles.tabs}>
            <button
              type="button"
              onClick={() => setSubmitMethod('email')}
              style={{
                ...styles.tab,
                ...(submitMethod === 'email' ? styles.tabActive : styles.tabInactive)
              }}
            >
              📧 Email
            </button>
            <button
              type="button"
              onClick={() => setSubmitMethod('whatsapp')}
              style={{
                ...styles.tab,
                ...(submitMethod === 'whatsapp' ? styles.tabActive : styles.tabInactive)
              }}
            >
              💬 WhatsApp
            </button>
          </div>

          {/* Email Form */}
          {submitMethod === 'email' && (
            <form onSubmit={handleEmailSubmit}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}>👤</span>
                    Full Name
                  </label>
                  <input
                    style={styles.input}
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}>📧</span>
                    Email Address
                  </label>
                  <input
                    style={styles.input}
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>📋</span>
                  Subject
                </label>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>💬</span>
                  Message
                </label>
                <textarea
                  style={{ ...styles.input, ...styles.textarea }}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your issue in detail..."
                  required
                />
              </div>

              <button type="submit" style={styles.button} disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner">⏳</span> Submitting...
                  </>
                ) : (
                  <>
                    <span>🚀</span> Submit Ticket via Email
                  </>
                )}
              </button>
            </form>
          )}

          {/* WhatsApp Form */}
          {submitMethod === 'whatsapp' && (
            <form onSubmit={handleWhatsAppSubmit}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}>👤</span>
                    Full Name
                  </label>
                  <input
                    style={styles.input}
                    type="text"
                    value={whatsappData.name}
                    onChange={(e) => setWhatsappData({ ...whatsappData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}>📱</span>
                    WhatsApp Number
                  </label>
                  <input
                    style={styles.input}
                    type="tel"
                    value={whatsappData.phone}
                    onChange={(e) => setWhatsappData({ ...whatsappData, phone: e.target.value })}
                    placeholder="03123456789"
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>📋</span>
                  Subject
                </label>
                <input
                  style={styles.input}
                  type="text"
                  value={whatsappData.subject}
                  onChange={(e) => setWhatsappData({ ...whatsappData, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>💬</span>
                  Message
                </label>
                <textarea
                  style={{ ...styles.input, ...styles.textarea }}
                  value={whatsappData.message}
                  onChange={(e) => setWhatsappData({ ...whatsappData, message: e.target.value })}
                  placeholder="Describe your issue in detail..."
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  ...styles.button,
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)'
                }}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner">⏳</span> Submitting...
                  </>
                ) : (
                  <>
                    <span>💬</span> Submit Ticket via WhatsApp
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '100px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative'
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
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '15px',
    border: '1px solid rgba(255,255,255,0.3)'
  },
  title: {
    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
    fontWeight: '800',
    color: 'white',
    margin: '0 0 15px 0'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.9)',
    margin: 0
  },
  formCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  alert: {
    padding: '16px 20px',
    borderRadius: '12px',
    marginBottom: '25px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
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
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '0'
  },
  formGroup: {
    marginBottom: '25px'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
    fontSize: '0.95rem'
  },
  labelIcon: {
    fontSize: '1.1rem'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e1e8ed',
    borderRadius: '10px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box'
  },
  textarea: {
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  button: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '700',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease'
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    padding: '5px',
    background: '#f5f7fa',
    borderRadius: '12px'
  },
  tab: {
    flex: 1,
    padding: '14px 20px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  tabActive: {
    background: 'white',
    color: '#667eea',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  tabInactive: {
    background: 'transparent',
    color: '#666'
  }
};
