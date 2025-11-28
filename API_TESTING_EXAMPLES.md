# API Testing Examples

## cURL Commands

### Test 1: Valid Request with All Fields

```bash
curl -X POST http://localhost:5173/api/add-price \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-20",
    "arabica": "150.50",
    "robusta": "120.75",
    "arecanut": "80.25"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Price added successfully",
  "updates": {
    "spreadsheetId": "...",
    "updatedRange": "Sheet1!A8:D8",
    "updatedRows": 1,
    "updatedColumns": 4,
    "updatedCells": 4
  }
}
```

---

### Test 2: Valid Request without Arecanut (Optional Field)

```bash
curl -X POST http://localhost:5173/api/add-price \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-21",
    "arabica": "151.25",
    "robusta": "121.50"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Price added successfully",
  "updates": {
    "spreadsheetId": "...",
    "updatedRange": "Sheet1!A9:D9",
    "updatedRows": 1,
    "updatedColumns": 4,
    "updatedCells": 4
  }
}
```

---

### Test 3: Missing Required Field (Arabica)

```bash
curl -X POST http://localhost:5173/api/add-price \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-20",
    "robusta": "120.75",
    "arecanut": "80.25"
  }'
```

**Expected Response (400):**
```json
{
  "error": "Missing required fields: date, arabica, robusta"
}
```

---

### Test 4: Missing Required Field (Robusta)

```bash
curl -X POST http://localhost:5173/api/add-price \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-20",
    "arabica": "150.50",
    "arecanut": "80.25"
  }'
```

**Expected Response (400):**
```json
{
  "error": "Missing required fields: date, arabica, robusta"
}
```

---

### Test 5: Missing Required Field (Date)

```bash
curl -X POST http://localhost:5173/api/add-price \
  -H "Content-Type: application/json" \
  -d '{
    "arabica": "150.50",
    "robusta": "120.75"
  }'
```

**Expected Response (400):**
```json
{
  "error": "Missing required fields: date, arabica, robusta"
}
```

---

### Test 6: Invalid HTTP Method (GET)

```bash
curl -X GET http://localhost:5173/api/add-price
```

**Expected Response (405):**
```json
{
  "error": "Method not allowed"
}
```

---

### Test 7: Invalid HTTP Method (PUT)

```bash
curl -X PUT http://localhost:5173/api/add-price \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-20",
    "arabica": "150.50",
    "robusta": "120.75"
  }'
```

**Expected Response (405):**
```json
{
  "error": "Method not allowed"
}
```

---

### Test 8: Empty JSON

```bash
curl -X POST http://localhost:5173/api/add-price \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response (400):**
```json
{
  "error": "Missing required fields: date, arabica, robusta"
}
```

---

### Test 9: Server Configuration Error (Missing Env Vars)

*Only possible if GOOGLE_SHEETS_CREDENTIALS or SHEET_ID not set*

```bash
curl -X POST http://localhost:5173/api/add-price \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-20",
    "arabica": "150.50",
    "robusta": "120.75"
  }'
```

**Expected Response (500):**
```json
{
  "error": "Server configuration error"
}
```

---

### Test 10: Decimal Prices

```bash
curl -X POST http://localhost:5173/api/add-price \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-20",
    "arabica": "150.99",
    "robusta": "120.99",
    "arecanut": "80.99"
  }'
```

**Expected Response (200):**
Data added successfully, all decimals preserved.

---

### Test 11: Large Numbers

```bash
curl -X POST http://localhost:5173/api/add-price \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-20",
    "arabica": "9999.99",
    "robusta": "9999.99",
    "arecanut": "9999.99"
  }'
```

**Expected Response (200):**
All values stored correctly without truncation.

---

### Test 12: Special Characters in Optional Field

```bash
curl -X POST http://localhost:5173/api/add-price \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-20",
    "arabica": "150.50",
    "robusta": "120.75",
    "arecanut": "N/A"
  }'
```

**Expected Response (200):**
Value "N/A" stored as-is in the spreadsheet.

---

## JavaScript Fetch Examples

### Success Case

```javascript
async function addPrice() {
  const response = await fetch('/api/add-price', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: '2024-01-20',
      arabica: '150.50',
      robusta: '120.75',
      arecanut: '80.25'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Error:', error.error);
    return;
  }

  const data = await response.json();
  console.log('Success:', data.message);
}
```

---

### Error Handling

```javascript
async function addPriceWithErrorHandling() {
  try {
    const response = await fetch('/api/add-price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: '2024-01-20',
        arabica: '150.50',
        robusta: '120.75'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Success:', data);
    return data;
  } catch (error) {
    console.error('Failed to add price:', error.message);
    // Show user-friendly error message
    return null;
  }
}
```

---

### With Retry Logic

```javascript
async function addPriceWithRetry(maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('/api/add-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: '2024-01-20',
          arabica: '150.50',
          robusta: '120.75'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      return await response.json();
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts`);
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
}
```

---

## Postman Setup

### 1. Create Request

- **Method**: POST
- **URL**: `http://localhost:5173/api/add-price` (local) or your Vercel URL
- **Headers**: `Content-Type: application/json`

### 2. Body (JSON)

```json
{
  "date": "2024-01-20",
  "arabica": "150.50",
  "robusta": "120.75",
  "arecanut": "80.25"
}
```

### 3. Send

Click "Send" and check the response.

---

## Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Price added successfully |
| 400 | Bad Request | Missing required fields |
| 405 | Method Not Allowed | Using GET instead of POST |
| 500 | Server Error | Configuration error or API failure |

---

## Testing Timeline

### Quick Test (1 minute)
```bash
# Single valid request
curl -X POST http://localhost:5173/api/add-price \
  -H "Content-Type: application/json" \
  -d '{"date":"2024-01-20","arabica":"150","robusta":"120"}'

# Check for 200 response
# Verify data appears in Google Sheet
```

### Standard Test (5 minutes)
```bash
# Test 1: Valid request ✓
# Test 2: Missing field ✓
# Test 3: Wrong method (GET) ✓
# Verify all three work as expected
```

### Comprehensive Test (30 minutes)
```bash
# All 12 test cases above
# Browser form submission
# Mobile responsiveness
# Language switching
# Error message clarity
```

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "error": "Server configuration error" | Env vars not set | Set GOOGLE_SHEETS_CREDENTIALS and SHEET_ID |
| Empty response | Network error | Check internet connection |
| 405 Method Not Allowed | Using GET | Use POST instead |
| "error": "Missing required fields" | Forgot date/arabica/robusta | Include all 3 in request |
| Data not in sheet | Wrong SHEET_ID | Verify sheet ID in Vercel env vars |

---

## Debug Mode

Enable detailed logging in the API by modifying `/api/add-price.js`:

```javascript
console.log('Request received:', req.body);
console.log('Credentials loaded:', !!credentials.client_email);
console.log('Sheet ID:', sheetId);
```

Then check Vercel logs:
1. Go to Vercel Dashboard
2. Select your project
3. Go to Deployments
4. Click on recent deployment
5. Click "Logs" tab

---

**Test Status**: All scenarios covered
**Last Updated**: 2024
