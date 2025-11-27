# Phalguni Coffee Trades - React Version

This is a complete React conversion of the coffee trading rates website.

## Project Structure

```
phalguni-coffee-trades/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Navigation and language toggle
│   │   ├── PriceCard.jsx           # Individual price display card
│   │   ├── PriceHistory.jsx        # Historical data table and chart
│   │   ├── ContactCard.jsx         # Contact information section
│   │   ├── Footer.jsx              # Footer section
│   │   ├── NotificationBanner.jsx  # Top notification banner
│   │   └── FloatingButtons.jsx     # Floating action buttons (copy, refresh)
│   ├── styles/
│   │   └── App.css                 # All styling (responsive design)
│   ├── utils/
│   │   ├── api.js                  # Google Sheets data fetching
│   │   ├── translations.js         # English & Kannada translations
│   │   └── helpers.js              # Utility functions
│   ├── App.jsx                     # Main App component (state management)
│   └── main.jsx                    # React entry point
├── index.html                      # HTML template
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite build configuration
└── README.md                       # This file
```

## Setup & Installation

### Prerequisites
- Node.js 16+ and npm installed

### Install Dependencies
```bash
npm install
```

### Development Server
Start the development server with hot reload:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Build for Production
Create an optimized production build:
```bash
npm run build
```

The output will be in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

## Features

✅ **Bilingual Support** - English & Kannada translations
✅ **Real-time Price Updates** - Fetches from Google Sheets
✅ **7-Day Price History** - Table and interactive Chart.js visualization
✅ **Copy to Clipboard** - Share prices as formatted messages
✅ **Responsive Design** - Mobile, tablet, and desktop optimized
✅ **Floating Action Buttons** - Quick access on mobile
✅ **Dark/Light Gradient UI** - Beautiful coffee-themed design

## Key Differences from Original

### Original (Static HTML/Vanilla JS)
- All logic in `<script>` tags
- Direct DOM manipulation
- No build step required

### React Version
- **Component-based** architecture for reusability
- **State management** with `useState` hook
- **Separation of concerns** - utilities, components, styles
- **Vite** for fast development and optimized builds
- **Hot Module Replacement (HMR)** for instant updates during development
- **Cleaner, maintainable code** for future enhancements

## Data Source

The app fetches coffee prices from a Google Sheet via CSV export. Update the `SHEET_CSV_URL` in `src/utils/api.js` to point to your data source.

### CSV Format Expected
```
Date,Arabica,Robusta,Arecanut
2024-01-01,250,180,150
2024-01-02,251,181,151
```

## Deployment

### Netlify / Vercel
1. Push your code to GitHub
2. Connect your repository to Netlify/Vercel
3. Configure build command: `npm run build`
4. Configure publish directory: `dist`

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "-s", "dist"]
```

## Customization

### Change Colors
Edit CSS variables in `src/styles/App.css`:
```css
:root {
  --bg: #f7f2ec;
  --accent: #6b4226;
  --accent-2: #a46b39;
  /* ... */
}
```

### Add New Translations
Update `src/utils/translations.js`:
```javascript
export const translations = {
  hi: { // Hindi example
    title: "फलगुनि कॉफी ट्रेड्स",
    // ... add all keys
  }
}
```

### Modify Data Fetch Logic
Edit `src/utils/api.js` to add retry logic, caching, or different data sources.

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Chart Not Displaying
Ensure Chart.js is installed: `npm install chart.js`

## Dependencies

- **React 18.2** - UI framework
- **Vite 5.0** - Build tool
- **Chart.js 4.4** - Data visualization

## License

Inherit from original project
