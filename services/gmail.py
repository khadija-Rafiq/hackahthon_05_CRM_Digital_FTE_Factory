import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from dotenv import load_dotenv

# Load .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))


class GmailService:
    def __init__(self):
        self.email = os.getenv("GMAIL_EMAIL")
        self.app_password = os.getenv("GMAIL_APP_PASSWORD", "").replace(" ", "")
        self.enabled = bool(self.email and self.app_password)
        if self.enabled:
            print(f"[Gmail] Configured for: {self.email}")
        else:
            print("[Gmail] WARNING: Email not configured. Check .env file!")

    def send_ticket_confirmation(self, to_email: str, ticket_id: str, name: str, subject: str, message: str):
        """Send ticket confirmation email to customer"""
        if not self.enabled:
            print("[Gmail] Email not configured. Skipping...")
            return False

        try:
            msg = MIMEMultipart()
            msg["From"] = self.email
            msg["To"] = to_email
            msg["Subject"] = f"Support Ticket Created - {ticket_id}"

            body = f"""
            <html>
            <body style="font-family: Arial, sans-serif; background: #f5f7fa; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #4a90d9;">Support Ticket Confirmation</h2>
                    <p>Dear {name},</p>
                    <p>Your support ticket has been created successfully.</p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0;">
                        <p><strong>Ticket ID:</strong> <span style="color: #4a90d9; font-size: 18px;">{ticket_id}</span></p>
                        <p><strong>Subject:</strong> {subject}</p>
                        <p><strong>Status:</strong> <span style="color: #dc3545;">Open</span></p>
                    </div>
                    
                    <p><strong>Your Message:</strong></p>
                    <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #4a90d9;">
                        {message}
                    </div>
                    
                    <p style="margin-top: 30px;">Please save your <strong>Ticket ID</strong> to check the status of your ticket.</p>
                    <p>Our support team will review your request and respond shortly.</p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
                </div>
            </body>
            </html>
            """

            msg.attach(MIMEText(body, "html"))

            # Connect to Gmail SMTP
            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.starttls()
            server.login(self.email, self.app_password)
            server.send_message(msg)
            server.quit()

            print(f"[Gmail] Confirmation email sent to {to_email}")
            return True

        except Exception as e:
            print(f"[Gmail] Error sending email: {str(e)}")
            return False

    def send_resolution_notification(self, to_email: str, ticket_id: str, name: str, subject: str):
        """Send ticket resolution notification"""
        if not self.enabled:
            print("[Gmail] Email not configured. Skipping...")
            return False

        try:
            msg = MIMEMultipart()
            msg["From"] = self.email
            msg["To"] = to_email
            msg["Subject"] = f"Ticket Resolved - {ticket_id}"

            body = f"""
            <html>
            <body style="font-family: Arial, sans-serif; background: #f5f7fa; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #28a745;">✅ Ticket Resolved</h2>
                    <p>Dear {name},</p>
                    <p>Your support ticket has been marked as resolved.</p>
                    
                    <div style="background: #d4edda; padding: 20px; border-radius: 4px; margin: 20px 0;">
                        <p><strong>Ticket ID:</strong> {ticket_id}</p>
                        <p><strong>Subject:</strong> {subject}</p>
                        <p><strong>Status:</strong> <span style="color: #28a745;">Resolved</span></p>
                    </div>
                    
                    <p>If you still need assistance, please create a new ticket.</p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px;">This is an automated message.</p>
                </div>
            </body>
            </html>
            """

            msg.attach(MIMEText(body, "html"))

            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.starttls()
            server.login(self.email, self.app_password)
            server.send_message(msg)
            server.quit()

            print(f"[Gmail] Resolution email sent to {to_email}")
            return True

        except Exception as e:
            print(f"[Gmail] Error sending email: {str(e)}")
            return False


# Global instance
gmail_service = GmailService()
