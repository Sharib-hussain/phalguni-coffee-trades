# Admin Panel - Price Update Guide

## Overview
The Admin Panel is a password-protected page that allows authorized users to update coffee prices directly to the Google Sheet. The interface is user-friendly and includes real-time validation.

## Features
- 🔐 **Password Protection**: Only accessible with correct admin password
- 📝 **Price Management**: Update Arabica, Robusta, and Arecanut prices
- 📅 **Date Selection**: Set the price update date
- 📊 **Google Sheets Integration**: Automatically syncs with Google Sheet
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ✅ **Real-time Feedback**: Success/error messages for all operations

## Accessing the Admin Panel

### URL
Navigate to: `https://yourdomain.com/#/admin`

For local development:
```
http://localhost:5173/#/admin
```

### Login
1. Click on the password field
2. Enter the admin password
3. Click "Login"

**Default Password**: Check your `.env.local` file for `VITE_ADMIN_PASSWORD`

## How to Use

### Step 1: Login
Enter the admin password and click "Login"

### Step 2: Fill Price Information
- **Date**: Select or confirm the date (defaults to today)
- **Arabica**: Enter the Arabica coffee price in ₹
- **Robusta**: Enter the Robusta coffee price in ₹
- **Arecanut** (Optional): Enter the Arecanut price in ₹

### Step 3: Submit
Click "Update Prices" to submit the data to Google Sheet

### Step 4: Confirmation
- You'll see a success message if the update was successful
- The form will clear automatically after successful submission
- Click "Logout" to exit the admin panel

## Environment Variables Required

Make sure these variables are set in your `.env.local`:

```env
# Admin Authentication
VITE_ADMIN_PASSWORD=your_secure_password

# Google Sheets API
GOOGLE_TYPE=service_account
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_PRIVATE_KEY=your_private_key
GOOGLE_CLIENT_EMAIL=your_service_account_email
SHEET_ID=your_spreadsheet_id
```

## Setting Up Google Sheets API

### 1. Create a Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Sheets API
4. Create a Service Account key (JSON format)
5. Download the JSON file

### 2. Add Permissions
1. Open your Google Sheet
2. Share it with the service account email from the JSON file
3. Grant Editor access

### 3. Configure Environment Variables
Extract these from your JSON file:
- `GOOGLE_TYPE`: "service_account"
- `GOOGLE_PROJECT_ID`: The project ID
- `GOOGLE_PRIVATE_KEY`: The private key (replace `\n` with actual newlines)
- `GOOGLE_CLIENT_EMAIL`: The client email
- `SHEET_ID`: Your spreadsheet ID (from the URL)

## API Endpoint

### POST `/api/updateSheet`

**Request Body:**
```json
{
  "date": "2024-01-15",
  "arabica": "1250",
  "robusta": "950",
  "arecanut": "1100"
}
```

**Success Response (200):**
```json
{
  "message": "Price updated successfully!",
  "data": {
    "date": "2024-01-15",
    "arabica": "1250",
    "robusta": "950",
    "arecanut": "1100"
  }
}
```

**Error Response (400/500):**
```json
{
  "error": "Error message here"
}
```

## Security Best Practices

1. **Strong Password**: Use a strong, unique password for `VITE_ADMIN_PASSWORD`
2. **Environment Variables**: Never commit `.env.local` to version control
3. **HTTPS Only**: Always access the admin panel over HTTPS in production
4. **Regular Updates**: Keep the password updated periodically
5. **Audit Trail**: Monitor Google Sheet edit history for updates

## Troubleshooting

### "Invalid password"
- Ensure you're typing the correct password
- Check that `VITE_ADMIN_PASSWORD` is set in `.env.local`

### "Failed to update price"
- Verify all required environment variables are set
- Check Google Sheets API credentials
- Ensure the service account has editor access to the sheet
- Check the browser console for detailed error messages

### Data not appearing in Google Sheet
- Verify the `SHEET_ID` is correct
- Confirm the range "Sheet1!A:D" exists in your sheet
- Check that the service account email has proper permissions

## File Structure

```
src/
├── components/
│   └── AdminPanel.jsx          # Main admin panel component
├── styles/
│   └── AdminPanel.css          # Admin panel styling
└── App.jsx                      # Updated with admin routing

api/
└── updateSheet.js              # Backend API handler
```

## React Component: AdminPanel

The AdminPanel component handles:
- Authentication with password
- Form state management
- API communication
- Error/success feedback
- Logout functionality

### Usage
The component is automatically integrated into `App.jsx` and accessible via the `#/admin` route.

## Future Enhancements

- [ ] Multiple admin accounts with username/password
- [ ] Two-factor authentication
- [ ] Edit/delete previous entries
- [ ] Batch import from CSV
- [ ] Email notifications on price updates
- [ ] Price history in admin panel
- [ ] Data validation and sanitization
- [ ] Audit logs with user tracking

## Support

If you encounter any issues:
1. Check the browser console (F12) for error messages
2. Verify all environment variables are set correctly
3. Check the network tab to see API responses
4. Ensure Google Sheets API is enabled in Google Cloud Console
