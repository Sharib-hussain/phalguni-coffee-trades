import { google } from 'googleapis';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse request body
    const { date, arabica, robusta, arecanut } = req.body;

    // Validate required fields
    if (!date || !arabica || !robusta) {
      return res.status(400).json({ 
        error: 'Missing required fields: date, arabica, robusta' 
      });
    }

    // Get credentials from environment variables
    const credentials = JSON.parse(
      process.env.GOOGLE_SHEETS_CREDENTIALS || '{}'
    );
    const sheetId = process.env.SHEET_ID;

    if (!credentials.client_email || !credentials.private_key || !sheetId) {
      console.error('Missing environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error' 
      });
    }

    // Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key.replace(/\\n/g, '\n'),
        client_id: credentials.client_id,
        type: credentials.type
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Append row to sheet
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:D', // Adjust range based on your sheet structure
      valueInputOption: 'RAW',
      resource: {
        values: [[date, arabica, robusta, arecanut || '—']]
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Price added successfully',
      updates: appendResponse.data.updates
    });
  } catch (error) {
    console.error('Error adding price:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}
