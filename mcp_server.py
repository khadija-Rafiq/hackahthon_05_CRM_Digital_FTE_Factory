# mcp_server.py

def search_knowledge_base(query):
    return "Sample result for: " + query


def create_ticket(customer_id, issue, priority, channel):
    return f"ticket_{customer_id}"


def get_customer_history(customer_id):
    return "No history yet"


def send_response(ticket_id, message, channel):
    return "sent"