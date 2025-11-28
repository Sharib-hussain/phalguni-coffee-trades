# Google Sheets Integration Setup Guide

This guide explains how to set up Google Sheets API authentication for the price submission feature.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter a project name (e.g., "Phalguni Coffee Trades")
5. Click "CREATE"

## Step 2: Enable Google Sheets API

1. In the Cloud Console, go to APIs & Services > Library
2. Search for "Google Sheets API"
3. Click on it and then click "ENABLE"

## Step 3: Create a Service Account

1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Service account name: e.g., "coffee-prices-api"
   - Click "CREATE AND CONTINUE"
4. Skip the optional steps and click "DONE"

## Step 4: Create and Download Key

1. In the Credentials page, click on the service account you created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" format
5. Click "CREATE" - this will download a JSON file
6. **Keep this file safe** - it contains sensitive credentials

## Step 5: Share Your Google Sheet with Service Account

1. Open your Google Sheet
2. In the JSON file you downloaded, find the `client_email` field (looks like: `xxx@xxx.iam.gserviceaccount.com`)
3. Share your Google Sheet with this email (as Editor)

## Step 6: Get Your Sheet ID

1. Open your Google Sheet
2. In the URL, find the Sheet ID - it's the long string between `/spreadsheets/d/` and `/edit`
   - Example: `https://docs.google.com/spreadsheets/d/ABC123XYZ/edit` → ID is `ABC123XYZ`

## Step 7: Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Go to Settings > Environment Variables
3. Add two new environment variables:

### GOOGLE_SHEETS_CREDENTIALS
- **Value**: Paste the entire contents of your JSON key file (the one you downloaded in Step 4)
- The JSON should look like:
```json
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "...",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

### SHEET_ID
- **Value**: Your Google Sheet ID from Step 6
- Example: `ABC123XYZ`

4. Click "Save"

## Step 8: Deploy to Vercel

1. Push your code changes to your GitHub repository
2. Vercel will automatically redeploy with the new environment variables
3. Test the form by adding a price - it should appear in your Google Sheet

## Step 9: Verify Google Sheet Format

Your Google Sheet should have columns in this order:
1. **Column A**: Date (format: YYYY-MM-DD)
2. **Column B**: Arabica Price
3. **Column C**: Robusta Price
4. **Column D**: Arecanut Price

Example:
```
Date        | Arabica | Robusta | Arecanut
2024-01-15  | 150     | 120     | 80
2024-01-16  | 152     | 118     | 82
```

## Troubleshooting

### Error: "Server configuration error"
- Check that both `GOOGLE_SHEETS_CREDENTIALS` and `SHEET_ID` environment variables are set
- Verify the JSON is valid (no extra quotes or formatting issues)

### Error: "Method not allowed"
- Make sure you're sending a POST request, not GET

### Error: "Permission denied"
- Verify the service account email has Editor access to your Google Sheet
- Check that the SHEET_ID is correct

### Private key issues
- In the JSON, the `private_key` has literal `\n` characters
- The code automatically converts them to actual newlines with `.replace(/\\n/g, '\n')`
- Make sure to paste the entire JSON as-is from the downloaded file

## Testing Locally (Optional)

If you want to test locally before deploying to Vercel:

1. Create a `.env.local` file in your project root
2. Add the same environment variables
3. Run `npm run dev` and test the form
4. The function will use the local environment variables

Note: You may need to set up Node.js to run the backend locally.

## API Endpoint Documentation

### POST `/api/add-price`

**Request:**
```json
{
  "date": "2024-01-20",
  "arabica": "150.50",
  "robusta": "120.75",
  "arecanut": "80.25"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Price added successfully",
  "updates": { ... }
}
```

**Error Response (400/500):**
```json
{
  "error": "Error message describing the issue"
}
```

## Security Notes

- ✅ The service account key is stored securely in Vercel's environment variables
- ✅ The key is never exposed in your frontend code
- ✅ Only the backend API has access to Google Sheets
- ✅ The API only accepts POST requests with valid data
- ⚠️ Consider adding rate limiting for production use
- ⚠️ Consider adding authentication to prevent unauthorized submissions
