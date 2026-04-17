# Transition Checklist: General → Custom Agent

## 1. Discovered Requirements
- Multi-channel support (Email, WhatsApp, Web)
- Ticket system
- Customer identification
- Response formatting per channel
- Escalation system

## 2. Working Prompts
"You are a helpful support assistant. Answer clearly and politely."

## 3. Edge Cases

| Edge Case | Handling |
|----------|---------|
| Empty message | Ask again |
| Angry user | Escalate |
| Refund request | Escalate |

## 4. Response Patterns
- Email: Formal
- WhatsApp: Short
- Web: Medium

## 5. Escalation Rules
- Angry message
- Refund
- Complaint

## 6. Performance
- Response time: 2 sec
- Accuracy: 85%
- Escalation: 15%