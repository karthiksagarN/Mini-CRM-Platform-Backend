# Customer Representative Management Backend

This repository is a backend system for campaign management built with Node.js, Express, MongoDB and Passport (Google OAuth). It supports:

- Google OAuth 2.0 authentication
- Secure endpoints for customer and order ingestion (supports batch)
- Audience segmentation with rule evaluation
- Campaign creation tied to audience segments
- Simulated delivery with logging and delivery receipts
- AI integration to convert natural language to segmentation rules

## Features

1. Authentication
   - Google OAuth login and JWT issuance.
   - Campaign routes protected by JWT authentication.

2. Data Ingestion APIs
   - Create single or batch customers and orders.

3. Audience Segmentation
   - Define rules (equals, contains, greaterThan, lessThan).
   - Evaluate rules against customers.
   - Preview audience size before saving.

4. Campaign Management
   - Create campaigns tied to a saved segment.
   - Send campaigns to segment audiences (simulated vendor with 90% success).
   - Communication logs stored with statuses.

5. AI Integration
   - Convert natural language to segmentation rules using OpenAI-compatible API (AI_API_KEY required).
   - Fallback simple parser if AI not configured.

## Setup

1. Clone the repo and install dependencies:

   # Mini-CRM-Platform-Backend
# Mini-CRM-Platform-Backend
