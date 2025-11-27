const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9DnNnxDj2n3Fy9-JVnnouxDoZ_VZ9au3wRXNO_s0CYLED7mGHPfpolUAhNCpNyeAvMJYD7kGXBl_K/pub?gid=0&single=true&output=csv";

export async function fetchPrices() {
  try {
    if (!SHEET_CSV_URL || SHEET_CSV_URL.includes('REPLACE_WITH')) {
      throw new Error('Sheet URL not configured');
    }

    const resp = await fetch(SHEET_CSV_URL, { cache: 'no-store' });
    if (!resp.ok) throw new Error('Failed to fetch sheet');

    const csv = await resp.text();
    const rows = csv.trim().split('\n').map(r => r.split(','));
    const dataRows = rows.slice(-7); // last 7 rows for history

    // Convert rows to objects and sort by date
    const sortedData = dataRows.map(row => ({
      date: row[0],
      arabica: row[1],
      robusta: row[2],
      arecanut: row[3] ? row[3].replace('\r', '') : '—',
      timestamp: new Date(row[0]).getTime()
    }))
    .sort((a, b) => b.timestamp - a.timestamp); // Sort newest to oldest

    return {
      latest: sortedData[0],
      history: [...sortedData].reverse() // Reverse for chart (older to newer)
    };
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
}
