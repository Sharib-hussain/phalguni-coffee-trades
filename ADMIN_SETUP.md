# 🔐 Admin Panel Setup - Quick Start

## What Was Created

I've set up a complete password-protected admin panel for updating coffee prices with Google Sheets integration. Here's what's included:

### Frontend Components
1. **AdminPanel.jsx** - Main component with:
   - Password login screen
   - Price update form
   - Real-time success/error feedback
   - Logout functionality

2. **AdminPanel.css** - Beautiful, responsive styling

### Backend API
3. **api/updateSheet.js** - Serverless function that:
   - Validates incoming data
   - Authenticates with Google Sheets API
   - Appends price data to your Google Sheet
   - Returns success/error responses

### Updated Files
4. **src/App.jsx** - Added admin routing via `#/admin` hash

## Quick Setup (5 minutes)

### Step 1: Update Environment Variables
Open `.env.local` and add/update:
```env
VITE_ADMIN_PASSWORD=your_secure_password_here
GOOGLE_TYPE=service_account
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_PRIVATE_KEY=your_private_key_with_\n
GOOGLE_CLIENT_EMAIL=your_service_account_email
SHEET_ID=your_google_sheet_id
```

### Step 2: Access Admin Panel
Local Development:
```
http://localhost:5173/#/admin
```

Production:
```
https://yourdomain.com/#/admin
```

### Step 3: Login
- Enter your admin password (from `VITE_ADMIN_PASSWORD`)
- Click Login

### Step 4: Update Prices
- Select or confirm the date
- Enter Arabica, Robusta, and Arecanut prices
- Click "Update Prices"
- See instant confirmation

## Deployment Options

### Option A: Vercel (Easiest)
```powershell
npm install -g vercel
vercel
# Add environment variables in Vercel Dashboard
```

### Option B: Netlify
- Connect your GitHub repo
- Add environment variables in Settings
- Auto-deploys on push

### Option C: Self-Hosted
- Deploy Node.js server with included `server.js` example
- See `DEPLOYMENT_GUIDE.md` for details

## File Structure

```
phalguni-coffee-trades/
├── src/
│   ├── components/
│   │   └── AdminPanel.jsx         ✨ NEW
│   ├── styles/
│   │   └── AdminPanel.css         ✨ NEW
│   └── App.jsx                    ✏️ UPDATED
├── api/
│   └── updateSheet.js             ✨ NEW
├── ADMIN_PANEL_README.md          ✨ NEW
└── DEPLOYMENT_GUIDE.md            ✨ NEW
```

## Features

✅ **Password Protected** - Only authorized users can update prices
✅ **Real-time Updates** - Instantly syncs with Google Sheets
✅ **Mobile Responsive** - Works on all devices
✅ **Error Handling** - Clear error messages for troubleshooting
✅ **Secure** - No sensitive data exposed in frontend
✅ **Easy to Use** - Intuitive UI for non-technical users

## How It Works

1. User navigates to `#/admin`
2. Enters admin password
3. Fills in price information
4. Clicks "Update Prices"
5. Frontend sends data to backend API
6. Backend authenticates with Google Sheets API
7. Data appended to Google Sheet
8. Success message displayed to user

## Next Steps

1. ✅ Set all environment variables in `.env.local`
2. ✅ Get Google Sheets API credentials (see DEPLOYMENT_GUIDE.md)
3. ✅ Share your Google Sheet with the service account email
4. ✅ Test locally: `npm run dev`
5. ✅ Deploy to your hosting platform
6. ✅ Access admin panel at `yourdomain.com/#/admin`

## Google Sheets Setup

1. Create a service account in Google Cloud Console
2. Download the JSON credentials
3. Extract these values:
   - `GOOGLE_TYPE`
   - `GOOGLE_PROJECT_ID`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_CLIENT_EMAIL`
   - `SHEET_ID`
4. Share your Google Sheet with the service account email

See `DEPLOYMENT_GUIDE.md` for detailed Google Sheets setup.

## Security Tips

⚠️ **Important:**
- Use a strong, unique password
- Never commit `.env.local` to git
- Always use HTTPS in production
- The service account should have Editor access only to the specific sheet
- Rotate your password periodically

## API Details

**Endpoint:** `POST /api/updateSheet`

**Request:**
```json
{
  "date": "2024-01-15",
  "arabica": "1250",
  "robusta": "950",
  "arecanut": "1100"
}
```

**Response:**
```json
{
  "message": "Price updated successfully!",
  "data": { ... }
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid password" | Check `VITE_ADMIN_PASSWORD` in `.env.local` |
| "Failed to update price" | Verify all Google credentials are correct |
| Data not in Sheet | Check service account has editor access |
| CORS errors | Verify API is deployed correctly |
| Private key error | Ensure `\n` characters are in the private key |

## Documentation

For more details, see:
- `ADMIN_PANEL_README.md` - Complete admin panel documentation
- `DEPLOYMENT_GUIDE.md` - Step-by-step deployment instructions

## Support

If you need help:
1. Check browser console (F12) for error messages
2. Review the documentation files
3. Verify all environment variables
4. Check Google Cloud Console for API status

---

**Ready to use!** 🚀 Just set your environment variables and deploy.
