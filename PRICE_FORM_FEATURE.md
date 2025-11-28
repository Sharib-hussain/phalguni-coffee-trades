# Price Form Feature Documentation

## Overview

The Price Form feature allows users to submit new commodity prices directly from the website. These prices are automatically saved to your Google Sheets database.

## Components & Files

### Frontend Components

#### `PriceForm.jsx`
Located in: `src/components/PriceForm.jsx`

A React form component that:
- Collects date, arabica price, robusta price, and arecanut price
- Validates required fields
- Sends data to the backend API
- Shows success/error messages
- Supports both English and Kannada (kn) languages
- Auto-resets after successful submission

**Props:**
- `lang` (string): Current language ('en' or 'kn')
- `onSuccess` (function): Callback when price is added successfully
- `onError` (function): Callback when an error occurs

**Usage:**
```jsx
<PriceForm 
  lang={lang}
  onSuccess={handleFetchPrices}
  onError={(err) => setError(err.message)}
/>
```

### Backend API

#### `/api/add-price.js`
Located in: `backend/api/add-price.js`

A Vercel serverless function that:
- Accepts POST requests with price data
- Authenticates with Google Sheets API using service account
- Appends new rows to your Google Sheet
- Validates all required fields
- Returns success/error responses

**Environment Variables Required:**
- `GOOGLE_SHEETS_CREDENTIALS`: JSON service account key
- `SHEET_ID`: Your Google Sheet ID

**Request Format:**
```javascript
{
  "date": "2024-01-20",      // YYYY-MM-DD format
  "arabica": "150.50",        // Number or string
  "robusta": "120.75",        // Number or string
  "arecanut": "80.25"         // Optional
}
```

**Response Format:**
```javascript
// Success (200)
{
  "success": true,
  "message": "Price added successfully",
  "updates": { ... }
}

// Error (400/500)
{
  "error": "Error message"
}
```

## Integration with App

The PriceForm is integrated into `App.jsx` between the PriceHistory and ContactCard components. When a price is successfully added, it automatically refreshes the price data displayed on the page.

```jsx
<PriceForm 
  lang={lang}
  onSuccess={handleFetchPrices}  // Refreshes prices after submission
  onError={(err) => setError(err.message)}
/>
```

## Styling

Form styles are defined in `src/styles/App.css` under the "Price Form Styles" section:

- `.price-form-container`: Main form wrapper
- `.form-group`: Individual form field container
- `.submit-button`: Styled submit button
- `.success-message`: Green success notification
- `.error-message`: Red error notification

The form is responsive and adapts to mobile devices.

## Google Sheets Setup

### Prerequisites
1. Google Cloud Project with Sheets API enabled
2. Service account with JSON key
3. Google Sheet shared with the service account email

### Configuration Steps

See [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) for detailed setup instructions.

### Quick Summary
1. Create Google Cloud Project
2. Enable Google Sheets API
3. Create service account and download JSON key
4. Share your Google Sheet with the service account email
5. Add environment variables to Vercel:
   - `GOOGLE_SHEETS_CREDENTIALS`: The JSON key content
   - `SHEET_ID`: Your sheet ID

## Sheet Format

Your Google Sheet should have these columns:
- **Column A**: Date (YYYY-MM-DD)
- **Column B**: Arabica Price
- **Column C**: Robusta Price
- **Column D**: Arecanut Price

## Language Support

The form supports:
- **English (en)**: Default language
- **Kannada (kn)**: For Kannada speakers

All labels and messages are automatically translated based on the `lang` prop.

## Error Handling

The form handles various error scenarios:
- Missing required fields (date, arabica, robusta)
- Network errors
- Server errors
- Invalid credentials
- API failures

Users see clear error messages for each scenario.

## Security

- ✅ API credentials stored in Vercel environment variables
- ✅ Private key never exposed to frontend
- ✅ Only POST requests allowed
- ✅ Data validated on backend
- ⚠️ Consider adding rate limiting for production
- ⚠️ Consider adding authentication to prevent unauthorized submissions

## Troubleshooting

### Form doesn't submit
- Check browser console for error messages
- Verify Vercel environment variables are set
- Check network tab in developer tools

### Prices not appearing in Google Sheet
- Verify service account email has Editor access
- Check that SHEET_ID environment variable is correct
- Verify Google Sheet column order matches requirements

### CORS errors
- The API is hosted on the same domain (Vercel)
- No CORS configuration needed for same-origin requests

## Future Enhancements

Potential improvements:
1. Add form validation for price ranges
2. Add datetime picker with timezone support
3. Add batch upload functionality
4. Add authentication to restrict submissions
5. Add rate limiting to prevent abuse
6. Add email notifications when prices are submitted
7. Add edit/delete functionality for existing prices
8. Add price history chart with new data
