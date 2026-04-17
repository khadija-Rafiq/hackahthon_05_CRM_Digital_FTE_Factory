"""
SQLite Database Module - Free CRM System
Replaces in-memory storage with persistent SQLite database.
"""

import sqlite3
import os
from datetime import datetime
from typing import Optional, List, Dict, Any

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "crm.db")


def get_connection() -> sqlite3.Connection:
    """Get database connection with row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def init_db():
    """Initialize database schema."""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Customers table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS customers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            metadata TEXT DEFAULT '{}'
        )
    """)
    
    # Tickets table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tickets (
            id TEXT PRIMARY KEY,
            customer_id TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'open',
            priority TEXT DEFAULT 'medium',
            channel TEXT DEFAULT 'web_form',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            resolved_at TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        )
    """)
    
    # Messages/Conversations table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            ticket_id TEXT NOT NULL,
            sender TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (ticket_id) REFERENCES tickets(id)
        )
    """)
    
    # Create indexes
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_tickets_customer ON tickets(customer_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_messages_ticket ON messages(ticket_id)")
    
    conn.commit()
    conn.close()
    print("[Database] CRM initialized successfully")


def create_customer(name: str, email: str) -> str:
    """Create or get customer by email. Returns customer_id."""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check if customer exists
    cursor.execute("SELECT id FROM customers WHERE email = ?", (email,))
    existing = cursor.fetchone()
    
    if existing:
        conn.close()
        return existing["id"]
    
    # Create new customer
    import uuid
    customer_id = f"CUST-{uuid.uuid4().hex[:8].upper()}"
    
    cursor.execute(
        "INSERT INTO customers (id, name, email) VALUES (?, ?, ?)",
        (customer_id, name, email)
    )
    conn.commit()
    conn.close()
    return customer_id


def create_ticket(customer_id: str, subject: str, message: str, 
                  email: str = "", name: str = "", channel: str = "web_form") -> Dict[str, Any]:
    """Create a new ticket. Returns ticket data."""
    import uuid
    ticket_id = f"TKT-{uuid.uuid4().hex[:8].upper()}"
    
    conn = get_connection()
    cursor = conn.cursor()
    
    # Create ticket
    cursor.execute(
        "INSERT INTO tickets (id, customer_id, subject, message, channel) VALUES (?, ?, ?, ?, ?)",
        (ticket_id, customer_id, subject, message, channel)
    )
    
    # Create initial message
    message_id = f"MSG-{uuid.uuid4().hex[:8].upper()}"
    cursor.execute(
        "INSERT INTO messages (id, ticket_id, sender, content) VALUES (?, ?, ?, ?)",
        (message_id, ticket_id, "customer", message)
    )
    
    conn.commit()
    
    # Fetch complete ticket
    cursor.execute("""
        SELECT t.*, c.name, c.email 
        FROM tickets t 
        JOIN customers c ON t.customer_id = c.id 
        WHERE t.id = ?
    """, (ticket_id,))
    
    ticket = dict(cursor.fetchone())
    conn.close()
    
    return ticket


def get_ticket(ticket_id: str) -> Optional[Dict[str, Any]]:
    """Get ticket by ID with customer info."""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT t.*, c.name, c.email 
        FROM tickets t 
        JOIN customers c ON t.customer_id = c.id 
        WHERE t.id = ?
    """, (ticket_id.upper(),))
    
    ticket = cursor.fetchone()
    if not ticket:
        conn.close()
        return None
    
    result = dict(ticket)
    
    # Get messages
    cursor.execute(
        "SELECT * FROM messages WHERE ticket_id = ? ORDER BY created_at",
        (ticket_id.upper(),)
    )
    result["messages"] = [dict(m) for m in cursor.fetchall()]
    
    conn.close()
    return result


def resolve_ticket(ticket_id: str) -> Optional[Dict[str, Any]]:
    """Mark ticket as resolved."""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "UPDATE tickets SET status = 'resolved', resolved_at = CURRENT_TIMESTAMP WHERE id = ?",
        (ticket_id.upper(),)
    )
    conn.commit()
    
    ticket = get_ticket(ticket_id)
    conn.close()
    return ticket


def get_all_tickets() -> List[Dict[str, Any]]:
    """Get all tickets with customer info."""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT t.*, c.name, c.email 
        FROM tickets t 
        JOIN customers c ON t.customer_id = c.id 
        ORDER BY t.created_at DESC
    """)
    
    tickets = [dict(t) for t in cursor.fetchall()]
    conn.close()
    return tickets


def get_customer_tickets(customer_id: str) -> List[Dict[str, Any]]:
    """Get all tickets for a customer."""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT * FROM tickets WHERE customer_id = ? ORDER BY created_at DESC",
        (customer_id,)
    )
    
    tickets = [dict(t) for t in cursor.fetchall()]
    conn.close()
    return tickets


def add_message(ticket_id: str, sender: str, content: str) -> Dict[str, Any]:
    """Add a message to a ticket conversation."""
    import uuid
    message_id = f"MSG-{uuid.uuid4().hex[:8].upper()}"
    
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO messages (id, ticket_id, sender, content) VALUES (?, ?, ?, ?)",
        (message_id, ticket_id.upper(), sender, content)
    )
    conn.commit()
    
    cursor.execute("SELECT * FROM messages WHERE id = ?", (message_id,))
    message = dict(cursor.fetchone())
    conn.close()
    
    return message


def get_stats() -> Dict[str, Any]:
    """Get ticket statistics."""
    conn = get_connection()
    cursor = conn.cursor()
    
    stats = {}
    
    # Total tickets
    cursor.execute("SELECT COUNT(*) as count FROM tickets")
    stats["total_tickets"] = cursor.fetchone()["count"]
    
    # Open tickets
    cursor.execute("SELECT COUNT(*) as count FROM tickets WHERE status = 'open'")
    stats["open_tickets"] = cursor.fetchone()["count"]
    
    # Resolved tickets
    cursor.execute("SELECT COUNT(*) as count FROM tickets WHERE status = 'resolved'")
    stats["resolved_tickets"] = cursor.fetchone()["count"]
    
    # Total customers
    cursor.execute("SELECT COUNT(*) as count FROM customers")
    stats["total_customers"] = cursor.fetchone()["count"]
    
    conn.close()
    return stats


# Initialize database on import
init_db()
