# Support Ticket System

## Overview
Ye project ek simple **Support Ticket System** hai jo FastAPI backend aur React/Next.js frontend use karta hai.  
Users apna ticket submit kar sakte hain, status check kar sakte hain aur tickets resolve bhi kar sakte hain.

---

## Features

1. **Submit Ticket**  
   - User form fill karta hai: Name, Email, Subject, Message  
   - Submit karne par ticket ID generate hota hai  

2. **Check Ticket Status**  
   - Ticket ID enter karne par current status aur details show hoti hain  

3. **Mark as Resolved**  
   - Ticket resolve karne ke liye `Mark as Resolved` button use hota hai  
   - Alert: `Ticket Resolved ✅`  

---

## Backend Setup

1. Clone project ya apni folder me backend add karo
2. Virtual environment create karo:
   ```bash
   python -m venv venv
   source venv/bin/activate   # Mac/Linux
   venv\Scripts\activate      # Windows