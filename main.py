from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import database
from services.gmail import gmail_service
from services.whatsapp import whatsapp_service

app = FastAPI(title="Support Ticket System - CRM")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TicketSubmit(BaseModel):
    name: str
    email: str
    subject: str
    message: str


class TicketResponse(BaseModel):
    ticket_id: str
    name: str
    email: str
    subject: str
    message: str
    status: str
    created_at: str


class MessageSubmit(BaseModel):
    sender: str
    content: str


@app.get("/")
def root():
    stats = database.get_stats()
    return {
        "message": "Support Ticket System API",
        "status": "running",
        "stats": stats
    }


@app.post("/api/tickets")
def submit_ticket(ticket: TicketSubmit):
    try:
        # Create or get customer
        customer_id = database.create_customer(ticket.name, ticket.email)

        # Create ticket
        new_ticket = database.create_ticket(
            customer_id=customer_id,
            subject=ticket.subject,
            message=ticket.message,
            email=ticket.email,
            name=ticket.name,
            channel="web_form"
        )

        # Send confirmation email (non-blocking - don't fail if email fails)
        try:
            print(f"[DEBUG] Sending email to {ticket.email}...")
            print(f"[DEBUG] Gmail service enabled: {gmail_service.enabled}")

            result = gmail_service.send_ticket_confirmation(
                ticket.email,
                new_ticket["id"],
                ticket.name,
                ticket.subject,
                ticket.message
            )

            print(f"[DEBUG] Email send result: {result}")
        except Exception as email_error:
            print(f"[WARNING] Email failed but ticket was created: {str(email_error)}")
            # Continue - ticket should still be created even if email fails

        return {
            "ticket_id": new_ticket["id"],
            "name": new_ticket["name"],
            "email": new_ticket["email"],
            "subject": new_ticket["subject"],
            "message": new_ticket["message"],
            "status": new_ticket["status"],
            "created_at": new_ticket["created_at"]
        }
    except Exception as e:
        print(f"[ERROR] Failed to create ticket: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to create ticket: {str(e)}")


@app.get("/api/tickets/{ticket_id}")
def get_ticket(ticket_id: str):
    ticket = database.get_ticket(ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    return {
        "ticket_id": ticket["id"],
        "name": ticket["name"],
        "email": ticket["email"],
        "subject": ticket["subject"],
        "message": ticket["message"],
        "status": ticket["status"],
        "created_at": ticket["created_at"],
        "messages": ticket.get("messages", [])
    }


@app.post("/api/tickets/{ticket_id}/resolve")
def resolve_ticket(ticket_id: str):
    ticket = database.resolve_ticket(ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Send resolution notification email
    gmail_service.send_resolution_notification(
        ticket["email"],
        ticket_id,
        ticket["name"],
        ticket["subject"]
    )
    
    return {
        "ticket_id": ticket["id"],
        "name": ticket["name"],
        "email": ticket["email"],
        "subject": ticket["subject"],
        "message": ticket["message"],
        "status": ticket["status"],
        "created_at": ticket["created_at"]
    }


@app.get("/api/tickets")
def list_tickets():
    tickets = database.get_all_tickets()
    return tickets


@app.get("/api/stats")
def get_stats():
    return database.get_stats()


@app.post("/api/tickets/{ticket_id}/messages")
def add_message(ticket_id: str, message: MessageSubmit):
    ticket = database.get_ticket(ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    new_message = database.add_message(
        ticket_id=ticket_id,
        sender=message.sender,
        content=message.content
    )
    
    return new_message


# ==========================================
# WhatsApp Webhook Endpoints
# ==========================================

@app.post("/api/whatsapp/webhook")
async def whatsapp_webhook(request: Request):
    """
    Twilio WhatsApp webhook endpoint
    Receives incoming WhatsApp messages and creates tickets
    """
    try:
        form_data = await request.form()
        
        from_number = form_data.get("From", "")
        message_body = form_data.get("Body", "")
        
        print(f"[WhatsApp Webhook] Received from {from_number}: {message_body}")
        
        # Process incoming message
        result = whatsapp_service.handle_incoming_message(from_number, message_body)
        
        # Create ticket from WhatsApp message
        customer_id = database.create_customer(
            name=from_number.replace("whatsapp:", ""),
            email=""  # WhatsApp users may not have email
        )
        
        new_ticket = database.create_ticket(
            customer_id=customer_id,
            subject=f"WhatsApp: {message_body[:50]}...",
            message=message_body,
            email="",
            name=from_number.replace("whatsapp:", ""),
            channel="whatsapp"
        )
        
        # Send auto-reply
        if whatsapp_service.enabled:
            whatsapp_service.send_message(
                from_number,
                result["auto_reply"]
            )
        
        return {
            "status": "success",
            "ticket_id": new_ticket["id"],
            "message": "Ticket created from WhatsApp"
        }
        
    except Exception as e:
        print(f"[ERROR] WhatsApp webhook failed: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Webhook error: {str(e)}")


@app.get("/api/whatsapp/webhook")
async def whatsapp_webhook_verify(request: Request):
    """
    Twilio webhook verification (GET request)
    """
    from fastapi.responses import PlainTextResponse
    query_params = dict(request.query_params)
    
    # Return verification token
    if "hub.challenge" in query_params:
        return PlainTextResponse(content=query_params["hub.challenge"])
    
    return {"status": "ok"}


class WhatsAppTicketSubmit(BaseModel):
    name: str
    phone: str
    subject: str
    message: str


@app.post("/api/whatsapp/ticket")
def create_whatsapp_ticket(ticket: WhatsAppTicketSubmit):
    """
    Create ticket via WhatsApp (manual API call)
    """
    try:
        # Create or get customer
        customer_id = database.create_customer(ticket.name, "")
        
        # Create ticket
        new_ticket = database.create_ticket(
            customer_id=customer_id,
            subject=ticket.subject,
            message=ticket.message,
            email="",
            name=ticket.name,
            channel="whatsapp"
        )
        
        # Send WhatsApp confirmation
        try:
            phone_with_prefix = ticket.phone
            if not phone_with_prefix.startswith("whatsapp:"):
                phone_with_prefix = f"whatsapp:{phone_with_prefix}"
            
            whatsapp_service.send_ticket_confirmation(
                phone_with_prefix,
                new_ticket["id"],
                ticket.name,
                ticket.subject
            )
        except Exception as email_error:
            print(f"[WARNING] WhatsApp notification failed: {str(email_error)}")
        
        return {
            "ticket_id": new_ticket["id"],
            "name": new_ticket["name"],
            "phone": ticket.phone,
            "subject": new_ticket["subject"],
            "message": new_ticket["message"],
            "status": new_ticket["status"],
            "created_at": new_ticket["created_at"],
            "channel": "whatsapp"
        }
        
    except Exception as e:
        print(f"[ERROR] Failed to create WhatsApp ticket: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to create WhatsApp ticket: {str(e)}")


# ==========================================
# Startup Event
# ==========================================

@app.on_event("startup")
async def startup_event():
    """Initialize database on app startup"""
    try:
        database.init_db()
        print("\n✅ Application started successfully!")
        print(f"API running on http://localhost:8000")
        print(f"Docs available at http://localhost:8000/docs")
    except Exception as e:
        print(f"[ERROR] Failed to initialize database: {str(e)}")
        raise


if __name__ == "__main__":
    import uvicorn
    database.init_db()
    uvicorn.run(app, host="0.0.0.0", port=8000)
