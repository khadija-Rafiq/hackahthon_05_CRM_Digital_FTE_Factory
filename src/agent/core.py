# src/agent/core.py

def normalize_message(message, channel):
    """
    Har channel ka message ek jaisa banata hai
    """
    return message.strip().lower()


def search_docs(query):
    """
    Fake knowledge base search (abhi simple version)
    """
    docs = {
        "login": "You can reset your password using 'Forgot Password'.",
        "payment": "We support credit card and PayPal payments.",
        "dashboard": "Dashboard shows your activity and analytics.",
        "pricing": "Our pricing plans are Basic, Pro, and Enterprise."
    }

    for key in docs:
        if key in query:
            return docs[key]

    return "Sorry, I couldn't find relevant information."


def format_response(response, channel):
    """
    Channel ke hisab se response style change
    """
    if channel == "email":
        return f"Dear Customer,\n\n{response}\n\nRegards,\nSupport Team"

    elif channel == "whatsapp":
        return response[:100]  # short reply

    else:  # web form
        return f"{response}"


def should_escalate(message):
    """
    Simple escalation logic
    """
    bad_words = ["angry", "refund", "complaint", "bad"]

    for word in bad_words:
        if word in message:
            return True

    return False


def handle_request(message, channel):
    """
    MAIN FUNCTION (Core Loop)
    """
    normalized = normalize_message(message, channel)

    answer = search_docs(normalized)

    escalate = should_escalate(normalized)

    formatted = format_response(answer, channel)

    return {
        "response": formatted,
        "escalate": escalate
    }

# simple memory
memory = {}

def save_conversation(user, message):
    if user not in memory:
        memory[user] = []

    memory[user].append(message)


def get_history(user):
    return memory.get(user, [])