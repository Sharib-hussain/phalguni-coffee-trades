# Deployment Guide for Admin Panel API

## Overview
This guide covers deploying the price update API to various platforms.

## Option 1: Vercel (Recommended)

### Setup Steps

1. **Install Vercel CLI**
   ```powershell
   npm install -g vercel
   ```

2. **Configure Project**
   - Ensure `api/updateSheet.js` exists in your project root
   - This will be automatically deployed as a serverless function

3. **Deploy**
   ```powershell
   vercel
   ```

4. **Add Environment Variables**
   - Go to Vercel Dashboard > Settings > Environment Variables
   - Add all required variables:
     ```
     GOOGLE_TYPE
     GOOGLE_PROJECT_ID
     GOOGLE_PRIVATE_KEY
     GOOGLE_CLIENT_EMAIL
     SHEET_ID
     ```

5. **Update API URL in Code** (if different from production domain)
   - The API will be available at: `https://your-vercel-domain.vercel.app/api/updateSheet`

### Important: Private Key Format
In Vercel environment variables, the private key should be set as a single line with `\n` literals:
```
-----BEGIN PRIVATE KEY-----\nMIIEvgIBA...\n-----END PRIVATE KEY-----\n
```

## Option 2: Netlify Functions

### Setup Steps

1. **Update netlify.toml**
   Create/update `netlify.toml` in project root:
   ```toml
   [build]
     command = "npm run build"
     functions = "api"
     publish = "docs"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

2. **Adjust API Folder Structure**
   - Rename `api/updateSheet.js` to `api/updateSheet.mjs`
   - Update exports for Netlify compatibility

3. **Deploy**
   ```powershell
   npm run build
   netlify deploy --prod
   ```

4. **Add Environment Variables**
   - Netlify Dashboard > Site settings > Build & deploy > Environment
   - Add all required variables

## Option 3: Azure Functions

### Setup Steps

1. **Install Azure Functions Core Tools**
   ```powershell
   npm install -g azure-functions-core-tools@4 --unsafe-perm true
   ```

2. **Create Function App**
   ```powershell
   func new --name updateSheet --template "HTTP trigger" --authlevel "anonymous"
   ```

3. **Replace Generated Files**
   - Use your `updateSheet.js` code in the generated function folder
   - Update dependencies if needed

4. **Add Environment Variables**
   - Create `local.settings.json` for local development:
     ```json
     {
       "IsEncrypted": false,
       "Values": {
         "AzureWebJobsStorage": "",
         "FUNCTIONS_WORKER_RUNTIME": "node",
         "GOOGLE_TYPE": "service_account",
         "GOOGLE_PROJECT_ID": "...",
         "GOOGLE_PRIVATE_KEY": "...",
         "GOOGLE_CLIENT_EMAIL": "...",
         "SHEET_ID": "..."
       }
     }
     ```

5. **Deploy**
   ```powershell
   func azure functionapp publish <FunctionAppName>
   ```

## Option 4: Self-Hosted (Node.js Server)

### Setup Steps

1. **Create Express Server**
   Create `server.js`:
   ```javascript
   import express from 'express';
   import cors from 'cors';
   import updateSheetHandler from './api/updateSheet.js';

   const app = express();
   app.use(cors());
   app.use(express.json());

   app.post('/api/updateSheet', updateSheetHandler);

   const PORT = process.env.PORT || 3001;
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview",
       "start": "node server.js"
     },
     "dependencies": {
       "express": "^4.18.0",
       "cors": "^2.8.5",
       "googleapis": "^118.0.0"
     }
   }
   ```

3. **Install Dependencies**
   ```powershell
   npm install
   ```

4. **Set Environment Variables**
   - Create `.env` file with all required variables
   - Or set system environment variables

5. **Run Server**
   ```powershell
   npm start
   ```

## Option 5: Firebase Functions

### Setup Steps

1. **Install Firebase Tools**
   ```powershell
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**
   ```powershell
   firebase init functions
   ```

3. **Update functions/index.js**
   ```javascript
   const functions = require("firebase-functions");
   const updateSheetHandler = require("./updateSheet.js");

   exports.updateSheet = functions.https.onRequest(updateSheetHandler);
   ```

4. **Deploy**
   ```powershell
   firebase deploy --only functions
   ```

## Updating the Frontend

After deploying your API, update the fetch URL in `AdminPanel.jsx`:

```javascript
// For Vercel
const API_URL = 'https://your-vercel-domain.vercel.app';

// For Netlify
const API_URL = 'https://your-netlify-domain.netlify.app';

// For self-hosted
const API_URL = 'https://your-server.com';

const res = await fetch(`${API_URL}/api/updateSheet`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form)
});
```

Or if deployed on the same domain:
```javascript
const res = await fetch('/api/updateSheet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form)
});
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_TYPE` | Service account type | `service_account` |
| `GOOGLE_PROJECT_ID` | Google Cloud project ID | `my-project-123456` |
| `GOOGLE_PRIVATE_KEY` | Private key from service account | `-----BEGIN PRIVATE KEY-----...` |
| `GOOGLE_CLIENT_EMAIL` | Service account email | `sa@my-project.iam.gserviceaccount.com` |
| `SHEET_ID` | Google Sheet ID | `1A_2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p` |

## Testing the API

### Local Testing
```powershell
$body = @{
    date = "2024-01-15"
    arabica = "1250"
    robusta = "950"
    arecanut = "1100"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5173/api/updateSheet" `
  -Method Post `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

### Using curl
```bash
curl -X POST http://localhost:5173/api/updateSheet \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "arabica": "1250",
    "robusta": "950",
    "arecanut": "1100"
  }'
```

## Troubleshooting Deployment

### "Module not found" errors
- Ensure `package.json` includes all dependencies
- Run `npm install` before deploying
- Check that `googleapis` package is installed

### "CORS" errors
- Ensure CORS headers are set in API handler
- Verify the request origin is allowed

### "Authentication failed" errors
- Verify all Google environment variables are set correctly
- Check that private key format includes literal `\n` characters
- Confirm service account has access to the Google Sheet

### "Private key error"
- Ensure newlines in private key are properly formatted
- In most platforms, use: `\n` (escaped newline)
- Some platforms may require actual newlines

## Monitoring & Debugging

### Vercel
- View logs: Vercel Dashboard > Deployments > Select deployment > Function logs
- Check environment variables in Settings

### Netlify
- View logs: Netlify Dashboard > Functions > Select function > Logs
- Real-time logs during deployment

### Self-hosted
- Enable logging in your server
- Use process monitoring tools (PM2, Forever)

## Security Considerations

1. **Never commit `.env` files** to version control
2. **Use HTTPS only** in production
3. **Validate input** on both frontend and backend
4. **Rate limiting**: Consider adding rate limiting to prevent abuse
5. **Authentication**: The current implementation uses password only; consider upgrading to OAuth2 for production
6. **CORS**: Restrict CORS to your domain only in production

## Next Steps

1. Choose your deployment platform
2. Follow the setup steps for that platform
3. Configure all environment variables
4. Test the API endpoint
5. Update the frontend with the correct API URL
6. Deploy both frontend and backend
