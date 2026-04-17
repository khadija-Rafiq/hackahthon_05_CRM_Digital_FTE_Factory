from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import uuid
from datetime import datetime

# ============================
# App Setup
# ============================
app = FastAPI(title="Support Ticket API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================
# Data Model
# ============================
class SupportRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

# ============================
# Temporary Storage
# ============================
tickets = {}

# ============================
# CREATE TICKET
# ============================
@app.post("/support/submit")
async def submit(data: SupportRequest):
    ticket_id = str(uuid.uuid4())

    tickets[ticket_id] = {
        "data": data.dict(),
        "status": "open",
        "created_at": datetime.now().isoformat()
    }

    return {
        "ticket_id": ticket_id,
        "message": "Your request received successfully"
    }

# ============================
# GET TICKET
# ============================
@app.get("/support/ticket/{ticket_id}")
async def get_ticket(ticket_id: str):
    ticket = tickets.get(ticket_id)

    if ticket:
        return {
            "ticket_id": ticket_id,
            "status": ticket["status"],
            "created_at": ticket["created_at"],
            "data": ticket["data"]
        }

    return {"message": "Ticket not found"}

# ============================
# UPDATE STATUS
# ============================
@app.put("/support/ticket/{ticket_id}")
async def update_ticket(ticket_id: str):
    if ticket_id in tickets:
        tickets[ticket_id]["status"] = "resolved"
        return {"message": "Ticket marked as resolved"}

    return {"message": "Ticket not found"}