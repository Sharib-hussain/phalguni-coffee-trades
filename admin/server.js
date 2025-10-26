import express from 'express';
import { google } from 'googleapis';
import cors from 'cors';
import config from './config.js';

const app = express();
app.use(cors());
app.use(express.json());

// Create JWT client
const auth = new google.auth.JWT(
    config.credentials.client_email,
    null,
    config.credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

// Create Google Sheets instance
const sheets = google.sheets({ version: 'v4', auth });

app.post('/update-prices', async (req, res) => {
    try {
        const { arabicaPrice, robustaPrice } = req.body;
        
        // Validate inputs
        if (!arabicaPrice || !robustaPrice) {
            return res.status(400).json({ error: 'Both prices are required' });
        }

        // Current date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Append new row to spreadsheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: config.spreadsheetId,
            range: config.range,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [[today, arabicaPrice, robustaPrice]]
            }
        });

        res.json({ success: true, message: 'Prices updated successfully' });
    } catch (error) {
        console.error('Error updating prices:', error);
        res.status(500).json({ error: 'Failed to update prices' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});