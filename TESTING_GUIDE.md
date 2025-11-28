# Testing Guide: Price Submission Feature

## Pre-Deployment Testing

### 1. Frontend Component Testing

#### Test Case 1.1: Form Renders Correctly
```
Steps:
1. Run npm run dev
2. Visit http://localhost:5173
3. Scroll to find the "Add Price" form

Expected:
✓ Form appears below price history
✓ All input fields visible
✓ Submit button shows "Add Price" text
✓ Form is responsive on desktop
```

#### Test Case 1.2: Form Fields Populate Correctly
```
Steps:
1. Load the form
2. Check date input value

Expected:
✓ Date field pre-filled with today's date (YYYY-MM-DD format)
✓ Price fields are empty
✓ All fields accept keyboard input
```

#### Test Case 1.3: Language Support
```
Steps:
1. Form loads in English
2. Click language toggle
3. Check form text

Expected:
✓ Form labels translate to Kannada
✓ Button text changes to Kannada
✓ Form is still fully functional
```

#### Test Case 1.4: Form Validation
```
Steps:
1. Try to submit empty form
2. Try to submit with only date
3. Fill all required fields and submit

Expected:
✓ Error message appears for empty form
✓ Validation prevents submission
✓ Can only submit when date, arabica, robusta filled
```

### 2. API Testing (Local)

#### Test Case 2.1: Invalid Request Method
```bash
# Test GET request (should fail)
curl -X GET http://localhost:5173/api/add-price

Expected:
✓ 405 Method Not Allowed
```

#### Test Case 2.2: Missing Required Fields
```bash
# Test with missing arabica price
curl -X POST http://localhost:5173/api/add-price \
  -H "Content-Type: application/json" \
  -d '{"date":"2024-01-20","robusta":"120"}'

Expected:
✓ 400 Bad Request
✓ Error message: "Missing required fields"
```

#### Test Case 2.3: Valid Request
```bash
# Test with all required fields
curl -X POST http://localhost:5173/api/add-price \
  -H "Content-Type: application/json" \
  -d '{
    "date":"2024-01-20",
    "arabica":"150.50",
    "robusta":"120.75",
    "arecanut":"80.25"
  }'

Expected:
✓ 200 OK
✓ Response includes "success": true
✓ New row appears in Google Sheet
```

### 3. Integration Testing

#### Test Case 3.1: Form Submission End-to-End
```
Setup:
- Ensure GOOGLE_SHEETS_CREDENTIALS and SHEET_ID env vars set
- Ensure Google Sheet is accessible

Steps:
1. Load form
2. Enter: date=2024-01-20, arabica=150.50, robusta=120.75, arecanut=80.25
3. Click "Add Price" button
4. Wait for response

Expected:
✓ Submit button shows "Adding..." state
✓ Success message appears: "Price added successfully!"
✓ Form resets automatically
✓ New row appears in Google Sheet within 2 seconds
✓ Price cards update with new data
```

#### Test Case 3.2: Error Handling
```
Steps:
1. Temporarily remove SHEET_ID env var
2. Try to submit form
3. Check error message

Expected:
✓ Error message displays
✓ Form doesn't reset
✓ User can retry
```

#### Test Case 3.3: Concurrent Submissions
```
Steps:
1. Fill form
2. Click submit
3. Immediately click submit again (before response)
4. Wait for responses

Expected:
✓ Only one submission goes through
✓ Button disabled during submission
✓ No duplicate rows in sheet
```

## Post-Deployment Testing (Vercel)

### 4. Production Environment Testing

#### Test Case 4.1: Live Form Test
```
Steps:
1. Visit production URL: https://your-domain.com
2. Scroll to Add Price form
3. Enter test data:
   - Date: today's date
   - Arabica: 150.50
   - Robusta: 120.75
   - Arecanut: 80.25
4. Click "Add Price"

Expected:
✓ Form submits successfully
✓ Success message appears
✓ Form resets
✓ Data appears in Google Sheet
✓ Price cards update (may take a few seconds)
```

#### Test Case 4.2: Error Scenarios
```
Test 4.2.1: Missing Arabica Price
- Fill form without arabica
- Try to submit
- Expected: Error message, form stays filled

Test 4.2.2: Invalid Date
- Enter invalid date (e.g., "not-a-date")
- Try to submit
- Expected: Browser validation or error message

Test 4.2.3: Network Failure
- Submit form while offline/slow network
- Expected: Timeout error, user can retry

Test 4.2.4: Negative Prices
- Enter negative prices
- Try to submit
- Expected: Either accepted (no validation) or rejected (if added)
```

#### Test Case 4.3: Responsive Design
```
Desktop (1920x1080):
✓ Form displays properly
✓ All fields accessible
✓ Button is clickable
✓ Messages visible

Tablet (768x1024):
✓ Form displays in single column
✓ Fields stack vertically
✓ All text readable

Mobile (375x812):
✓ Form displays full width
✓ No horizontal scroll
✓ Touch targets (buttons) are large enough
✓ Virtual keyboard doesn't obscure form
```

#### Test Case 4.4: Multiple Languages
```
Steps:
1. Switch to English
2. Submit test price
3. Verify success message in English
4. Switch to Kannada
5. Submit another price
6. Verify success message in Kannada

Expected:
✓ Both submissions successful
✓ Messages display in correct language
✓ Both rows appear in Google Sheet
```

### 5. Data Integrity Testing

#### Test Case 5.1: Data Format in Sheet
```
Steps:
1. Submit: arabica="150.50", robusta="120.75", arecanut="80.25"
2. Check Google Sheet

Expected:
✓ Column A: Date in YYYY-MM-DD format
✓ Column B: Arabica value = "150.50"
✓ Column C: Robusta value = "120.75"
✓ Column D: Arecanut value = "80.25"
✓ No extra quotes or formatting
```

#### Test Case 5.2: Optional Field Handling
```
Steps:
1. Submit form WITHOUT arecanut price
2. Check Google Sheet

Expected:
✓ Row still adds successfully
✓ Column D shows "—" (dash) for empty arecanut
```

#### Test Case 5.3: Large Numbers
```
Steps:
1. Submit: arabica="9999.99", robusta="9999.99"
2. Check Google Sheet

Expected:
✓ Values stored correctly
✓ No truncation or rounding
✓ Display correctly in charts/history
```

#### Test Case 5.4: Duplicate Dates
```
Steps:
1. Submit price for 2024-01-20
2. Submit another price for 2024-01-20

Expected:
✓ Both rows added to sheet
✓ Both appear in price history
✓ Latest price uses most recent submission
```

### 6. Security Testing

#### Test Case 6.1: Credentials Not Exposed
```
Steps:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Submit form
4. Click on /api/add-price request
5. Check Response and Request

Expected:
✓ GOOGLE_SHEETS_CREDENTIALS NOT visible
✓ SHEET_ID NOT visible
✓ Only public data in request/response
```

#### Test Case 6.2: Frontend Cannot Access API Keys
```
In browser console, run:
localStorage.getItem('GOOGLE_SHEETS_CREDENTIALS')
sessionStorage.getItem('SHEET_ID')

Expected:
✓ Both return null (no keys stored)
```

#### Test Case 6.3: Invalid Service Account
```
Steps:
1. Change GOOGLE_SHEETS_CREDENTIALS to invalid JSON in Vercel
2. Try to submit form

Expected:
✓ Error response (500)
✓ No security information leaked in error
✓ User sees generic error message
```

## Performance Testing

### 7. Load Testing

#### Test Case 7.1: Form Response Time
```
Steps:
1. Submit form with valid data
2. Measure time to response

Expected:
✓ Success within 2-3 seconds
✓ No timeout (>30 seconds)
```

#### Test Case 7.2: Concurrent Users
```
Steps:
1. Have multiple users submit simultaneously
2. Check all submissions go through
3. Verify all rows appear in sheet

Expected:
✓ All submissions successful
✓ No data loss
✓ No rate limiting errors
```

## Browser Compatibility

### Test on These Browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

Expected for all:
✓ Form displays correctly
✓ Submission works
✓ No console errors
✓ Messages display properly

## Checklist for Release

### Before Going Live:
- [ ] All 7 test categories completed
- [ ] No critical errors found
- [ ] Form displays on desktop
- [ ] Form displays on mobile
- [ ] English language works
- [ ] Kannada language works
- [ ] Data saves to Google Sheet
- [ ] Price cards update after submission
- [ ] Error messages are clear
- [ ] Loading states work properly

### Monitoring After Launch:
- [ ] Check for JavaScript errors in browser console
- [ ] Monitor API response times
- [ ] Watch Google Sheet for new data
- [ ] Collect user feedback
- [ ] Check Vercel logs for errors
- [ ] Monitor for security issues

## Troubleshooting During Testing

| Issue | Solution |
|-------|----------|
| Form not submitting | Check browser console, verify env vars |
| "Server configuration error" | Verify SHEET_ID and credentials format |
| Data not in sheet | Check service account has Editor access |
| Slow response | Check network, Vercel status |
| Language not changing | Check lang prop is updating |
| Validation not working | Check for console errors |

## Test Data Templates

### Minimal Valid Test
```json
{
  "date": "2024-01-20",
  "arabica": "150",
  "robusta": "120"
}
```

### Complete Test
```json
{
  "date": "2024-01-20",
  "arabica": "150.50",
  "robusta": "120.75",
  "arecanut": "80.25"
}
```

### Edge Case Tests
```json
{
  "date": "2024-12-31",
  "arabica": "0.01",
  "robusta": "0.01",
  "arecanut": ""
}
```

---

**Testing Status**: Ready for comprehensive validation  
**Last Updated**: 2024
