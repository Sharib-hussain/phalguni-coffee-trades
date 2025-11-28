# Quick Reference: Price Submission Feature

## 📋 Files at a Glance

| File | Type | Status | Purpose |
|------|------|--------|---------|
| `src/components/PriceForm.jsx` | React Component | ✨ NEW | Price input form |
| `backend/api/add-price.js` | API Handler | ✨ NEW | Google Sheets integration |
| `src/App.jsx` | React Component | 🔄 MODIFIED | Integrated form component |
| `src/styles/App.css` | Styles | 🔄 MODIFIED | Form styling |
| `package.json` | Config | 🔄 MODIFIED | Added googleapis |
| `vercel.json` | Config | ✨ NEW | Vercel deployment config |

## 🚀 Deployment Checklist

- [ ] Create Google Cloud Project
- [ ] Enable Google Sheets API
- [ ] Create service account & download JSON key
- [ ] Share Google Sheet with service account email
- [ ] Add `GOOGLE_SHEETS_CREDENTIALS` env var to Vercel
- [ ] Add `SHEET_ID` env var to Vercel
- [ ] Verify Google Sheet has correct column format
- [ ] Push code to GitHub (Vercel auto-deploys)
- [ ] Test form on live site
- [ ] Verify data appears in Google Sheet

## 🔧 Environment Variables

```
GOOGLE_SHEETS_CREDENTIALS = {entire JSON key file}
SHEET_ID = your_sheet_id_here
```

## 📝 Component Props

### PriceForm
```jsx
<PriceForm 
  lang="en"                    // "en" or "kn"
  onSuccess={handleFetchPrices}    // Callback on success
  onError={(err) => {}}       // Callback on error
/>
```

## 📡 API Endpoint

```
POST /api/add-price

Body:
{
  "date": "2024-01-20",
  "arabica": "150.50",
  "robusta": "120.75",
  "arecanut": "80.25"          // Optional
}

Response:
{
  "success": true,
  "message": "Price added successfully",
  "updates": { ... }
}
```

## 🎨 CSS Classes

```css
.price-form-container      /* Main form wrapper */
.price-form                /* Form element */
.form-group                /* Individual field group */
.form-group label          /* Form labels */
.form-group input          /* Input fields */
.submit-button             /* Submit button */
.success-message           /* Success notification */
.error-message             /* Error notification */
```

## 🌍 Language Support

```javascript
// English (default)
lang: "en"

// Kannada
lang: "kn"

// All text automatically translates based on lang prop
```

## 📊 Google Sheet Format

Your sheet must have columns in this order:
```
A: Date        (YYYY-MM-DD format)
B: Arabica     (Price number)
C: Robusta     (Price number)
D: Arecanut    (Price number or dash)
```

## 🐛 Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Method not allowed" | Sent GET instead of POST | Use POST request |
| "Missing required fields" | Missing date/arabica/robusta | Fill all required fields |
| "Server configuration error" | Env vars not set | Add env vars to Vercel |
| "Permission denied" | Service account not shared | Share sheet with service account email |
| Private key errors | Invalid JSON format | Paste entire JSON file as-is |

## 📚 Related Documentation

- **GOOGLE_SHEETS_SETUP.md** → Step-by-step setup guide
- **PRICE_FORM_FEATURE.md** → Complete feature documentation
- **IMPLEMENTATION_SUMMARY.md** → Full implementation details
- **.env.example** → Environment variable template

## 🔐 Security Checklist

- ✅ Credentials in environment variables only
- ✅ No sensitive data in frontend code
- ✅ POST-only endpoint
- ✅ Input validation
- ⚠️ TODO: Add authentication if public form
- ⚠️ TODO: Add rate limiting
- ⚠️ TODO: Add CAPTCHA if spam issues

## 🧪 Testing Steps

1. Fill form with: date, arabica (150), robusta (120), arecanut (80)
2. Click "Add Price"
3. Should see success message
4. Form should reset
5. Check Google Sheet for new row
6. Price cards should update

## 📞 Testing Failed?

```
1. Check browser console for errors (F12)
2. Verify Vercel env vars are set
3. Verify service account has Editor access
4. Check Google Sheet column format
5. Review GOOGLE_SHEETS_SETUP.md
```

## 🚀 Performance Notes

- Form uses React hooks (minimal re-renders)
- API calls are debounced (handled by browser)
- Vercel serverless = automatic scaling
- Google Sheets API is fast and reliable
- No caching - always fresh data

---

**Last Updated**: 2024  
**Status**: Ready for Production
