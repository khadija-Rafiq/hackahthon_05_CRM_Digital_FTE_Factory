"""
WhatsApp Service - Twilio Integration
Sends WhatsApp messages and notifications via Twilio API.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file (fix path resolution)
env_path = Path(__file__).parent.parent / '.env'
print(f"[WhatsApp] Loading .env from: {env_path}")
load_dotenv(dotenv_path=env_path)

try:
    from twilio.rest import Client
    TWILIO_AVAILABLE = True
except ImportError:
    TWILIO_AVAILABLE = False
    print("[WhatsApp] WARNING: twilio package not installed. Run: pip install twilio")


class WhatsAppService:
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.from_number = os.getenv("TWILIO_WHATSAPP_NUMBER", "whatsapp:+14155238886")  # Twilio sandbox
        self.customer_number = os.getenv("CUSTOMER_WHATSAPP_NUMBER", "")

        print(f"[WhatsApp] Account SID: {self.account_sid[:10]}..." if self.account_sid else "[WhatsApp] Account SID: NOT SET")
        print(f"[WhatsApp] From Number: {self.from_number}")

        self.enabled = False

        if TWILIO_AVAILABLE and self.account_sid and self.auth_token:
            try:
                self.client = Client(self.account_sid, self.auth_token)
                self.enabled = True
                print(f"[WhatsApp] ✅ Twilio initialized successfully!")
            except Exception as e:
                print(f"[WhatsApp] ❌ Error initializing Twilio: {str(e)}")
        else:
            print("[WhatsApp] ❌ WARNING: Twilio not configured. Check .env file!")

    def send_message(self, to_number: str, message: str) -> bool:
        """Send WhatsApp message to customer"""
        if not self.enabled:
            print("[WhatsApp] Service not configured. Skipping...")
            return False

        try:
            # Format number with whatsapp: prefix if not already
            if not to_number.startswith("whatsapp:"):
                to_number = f"whatsapp:{to_number}"

            print(f"[WhatsApp] Attempting to send message to {to_number}...")
            
            msg = self.client.messages.create(
                from_=self.from_number,
                body=message,
                to=to_number
            )

            print(f"[WhatsApp] ✅ Message sent! SID: {msg.sid}")
            return True

        except Exception as e:
            error_msg = str(e)
            print(f"[WhatsApp] ❌ Error sending message: {error_msg}")
            # Log common errors
            if "sandbox" in error_msg.lower():
                print("[WhatsApp] 💡 TIP: User must join sandbox first!")
                print("[WhatsApp] 💡 Send 'join <sandbox-code>' to +14155238886")
            return False

    def send_ticket_confirmation(self, to_number: str, ticket_id: str, name: str, subject: str) -> bool:
        """Send ticket confirmation via WhatsApp"""
        message = f"""
🎫 *Ticket Created Successfully!*

Hi {name}!

📌 *Ticket ID:* {ticket_id}
📋 *Subject:* {subject}
✅ *Status:* Open

Please save your Ticket ID to check status later.

Our team will respond shortly! 🚀
        """.strip()

        return self.send_message(to_number, message)

    def send_resolution_notification(self, to_number: str, ticket_id: str, name: str, subject: str) -> bool:
        """Send ticket resolution notification via WhatsApp"""
        message = f"""
✅ *Ticket Resolved*

Hi {name}!

Your ticket has been resolved.

📌 *Ticket ID:* {ticket_id}
📋 *Subject:* {subject}
✅ *Status:* Resolved

Need more help? Create a new ticket anytime!
        """.strip()

        return self.send_message(to_number, message)

    def send_ai_response(self, to_number: str, ticket_id: str, response: str) -> bool:
        """Send AI assistant response via WhatsApp"""
        message = f"""
🤖 *Support Assistant*

📌 *Ticket:* {ticket_id}

{response}

---
Need more help? Reply to this message!
        """.strip()

        return self.send_message(to_number, message)

    def handle_incoming_message(self, from_number: str, message: str) -> dict:
        """Process incoming WhatsApp message and create ticket if needed"""
        # Check if message contains ticket ID
        ticket_id = None
        if "TKT-" in message.upper():
            # Extract ticket ID
            import re
            match = re.search(r'TKT-[A-Z0-9]+', message.upper())
            if match:
                ticket_id = match.group(0)

        return {
            "from": from_number,
            "message": message,
            "ticket_id": ticket_id,
            "auto_reply": "Thanks for your message! Our AI assistant will respond shortly. 🚀"
        }


# Global instance
whatsapp_service = WhatsAppService()
