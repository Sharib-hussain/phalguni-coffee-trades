# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     React App                              │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  App.jsx                                             │ │ │
│  │  │  - Manages global state                              │ │ │
│  │  │  - Fetches prices on load                            │ │ │
│  │  │  - Displays price cards and history                  │ │ │
│  │  │  - Handles language toggle                           │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  PriceForm.jsx (NEW)                                 │ │ │
│  │  │  - Input fields: date, arabica, robusta, arecanut    │ │ │
│  │  │  - Form validation                                   │ │ │
│  │  │  - Sends POST /api/add-price                         │ │ │
│  │  │  - Handles success/error responses                   │ │ │
│  │  │  - Bilingual support (EN/KN)                         │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ POST
                     HTTP Request (JSON)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL (Server)                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  /api/add-price.js (Serverless Function)                  │ │
│  │                                                            │ │
│  │  1. Parse request body                                    │ │
│  │  2. Validate fields                                       │ │
│  │  3. Read environment variables:                           │ │
│  │     - GOOGLE_SHEETS_CREDENTIALS                           │ │
│  │     - SHEET_ID                                            │ │
│  │  4. Create GoogleAuth with service account               │ │
│  │  5. Append row to Google Sheet                            │ │
│  │  6. Return success/error response                         │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ googleapis
                     Google Sheets API Call
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  GOOGLE CLOUD (External)                        │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Google Sheets API                                        │ │
│  │  - Authenticates with service account                    │ │
│  │  - Appends row to spreadsheet                            │ │
│  │  - Validates permissions                                 │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      GOOGLE SHEETS                              │
│                                                                  │
│  Date       │ Arabica │ Robusta │ Arecanut                     │
│  ────────────┼─────────┼─────────┼──────────                    │
│  2024-01-15 │   150   │   120   │   80                         │
│  2024-01-16 │   152   │   118   │   82                         │
│  2024-01-17 │ 151.50  │ 119.75  │   81    ← NEW ROW (Added)    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────┐
│ User Input  │
│ (Form Data) │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────┐
│  PriceForm.jsx               │
│  - Validate fields           │
│  - Show loading state        │
└──────┬───────────────────────┘
       │
       │ fetch("/api/add-price", {POST, JSON})
       │
       ▼
┌──────────────────────────────┐
│  Vercel /api/add-price       │
│  - Parse body                │
│  - Validate input            │
│  - Load credentials          │
│  - Authenticate Google       │
│  - Append to Sheet           │
└──────┬───────────────────────┘
       │
       │ googleapis.sheets.append()
       │
       ▼
┌──────────────────────────────┐
│  Google Sheets               │
│  - Add new row               │
│  - Update spreadsheet        │
└──────┬───────────────────────┘
       │
       │ Success Response
       │
       ▼
┌──────────────────────────────┐
│  PriceForm.jsx               │
│  - Show success message      │
│  - Reset form                │
│  - Trigger price refresh     │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  App.jsx                     │
│  - Fetch updated prices      │
│  - Update UI with new data   │
└──────────────────────────────┘
```

## Component Hierarchy

```
App.jsx
├── Header
├── NotificationBanner
├── Main
│   ├── PriceCard (Arabica)
│   ├── PriceCard (Robusta)
│   ├── PriceCard (Arecanut)
│   ├── PriceHistory
│   │   └── Chart / Table
│   ├── PriceForm (NEW) ✨
│   │   ├── Input (date)
│   │   ├── Input (arabica)
│   │   ├── Input (robusta)
│   │   ├── Input (arecanut)
│   │   ├── Button (submit)
│   │   ├── SuccessMessage
│   │   └── ErrorMessage
│   └── ContactCard
├── Footer
└── FloatingButtons
```

## Environment & Configuration Flow

```
┌──────────────────────────────────────┐
│  Developer Environment               │
│  .env.local (local development only) │
└──────────────┬───────────────────────┘
               │
               │ (no upload to repo)
               │
               ▼
┌──────────────────────────────────────┐
│  Vercel Dashboard                    │
│  Settings > Environment Variables    │
│                                      │
│  GOOGLE_SHEETS_CREDENTIALS = {...}   │
│  SHEET_ID = abc123...                │
└──────────────┬───────────────────────┘
               │
               │ (injected at runtime)
               │
               ▼
┌──────────────────────────────────────┐
│  Serverless Function Runtime         │
│  /api/add-price.js                   │
│                                      │
│  process.env.GOOGLE_SHEETS_CREDENTIALS
│  process.env.SHEET_ID                │
└──────────────────────────────────────┘
```

## Error Handling Flow

```
Request to /api/add-price
│
├─ Check method (POST)? ──NO──> 405 Method Not Allowed
│
├─ Env vars set? ──NO──> 500 Server Configuration Error
│
├─ Parse JSON ──FAIL──> 400 Bad Request
│
├─ Validate fields ──NO──> 400 Missing Required Fields
│
├─ Create Auth ──FAIL──> 500 Authentication Error
│
├─ Append to Sheet ──FAIL──> 500 Sheets API Error
│
└─ SUCCESS ──> 200 Price Added Successfully
```

## Security Model

```
┌─────────────────────────────────────┐
│  Secret Credentials                 │
│  (Service Account JSON)             │
└─────────────┬───────────────────────┘
              │
              │ NOT in source code
              │ NOT in frontend
              │
              ▼
┌─────────────────────────────────────┐
│  Vercel Environment Variables       │
│  (Encrypted, backend only)          │
└─────────────┬───────────────────────┘
              │
              │ Only accessible by /api/add-price.js
              │ Never sent to browser
              │
              ▼
┌─────────────────────────────────────┐
│  Google Service Account             │
│  (Limited to Sheet access only)     │
└─────────────┬───────────────────────┘
              │
              │ Can only modify specific sheet
              │ Cannot access other files/sheets
              │
              ▼
┌─────────────────────────────────────┐
│  Google Sheets Document             │
│  (Target spreadsheet)               │
└─────────────────────────────────────┘
```

## Deployment Pipeline

```
Local Development
       │
       │ git push
       │
       ▼
GitHub Repository
       │
       │ (webhook)
       │
       ▼
Vercel Build
├─ npm install (including googleapis)
├─ npm run build (build React app)
├─ Configure environment variables
└─ Deploy to edge network
       │
       ▼
Production Live
├─ Frontend served at root
├─ API functions at /api/*
└─ Ready for requests
```

---

This architecture ensures:
- ✅ Security: Credentials never exposed to frontend
- ✅ Scalability: Serverless functions auto-scale
- ✅ Reliability: Google Sheets as source of truth
- ✅ Performance: Fast API responses
- ✅ Maintainability: Clear separation of concerns
