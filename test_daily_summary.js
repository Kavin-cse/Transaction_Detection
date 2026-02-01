const https = require('https');

// --- CONFIGURATION ---
// Replace these with your actual Telegram Bot Token and Chat ID
// OR set them as environment variables: set TELEGRAM_BOT_TOKEN=your_token
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID_HERE';

// --- MOCK DATA (Simulating data fetched from Google Sheets for "Today") ---
const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const MOCK_DB_DATA = [
    { timestamp: `${TODAY}T09:30:00`, vendor: 'Starbucks', amount: 250.00, category: 'Food & Drink' },
    { timestamp: `${TODAY}T13:15:00`, vendor: 'Zomato', amount: 450.50, category: 'Food & Drink' },
    { timestamp: `${TODAY}T18:45:00`, vendor: 'Uber', amount: 120.00, category: 'Transport' },
    { timestamp: `${TODAY}T20:00:00`, vendor: 'Amazon', amount: 1299.00, category: 'Shopping' },
    // A transaction from yesterday (should be ignored)
    { timestamp: '2026-01-29T20:00:00', vendor: 'Netflix', amount: 199.00, category: 'Entertainment' },
];

function calculateDailySummary(data) {
    console.log("Processing mock data...");

    // 1. Filter for Today
    const todayTransactions = data.filter(t => t.timestamp.startsWith(TODAY));

    // 2. Calculate Total directly
    let grandTotal = 0;
    todayTransactions.forEach(t => {
        grandTotal += t.amount;
    });

    // 3. Format Message
    let message = `📊 *Daily Expense Summary* (${TODAY})\n\n`;
    message += `💰 *Total Spent Today: ₹${grandTotal.toFixed(2)}*`;

    return message;
}

function sendTelegramMessage(text) {
    if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' || CHAT_ID === 'YOUR_CHAT_ID_HERE') {
        console.warn("⚠️  WARNING: Telegram Bot Token or Chat ID not set.");
        console.log("---------------------------------------------------");
        console.log("PREVIEW OF MESSAGE TO BE SENT:");
        console.log(text);
        console.log("---------------------------------------------------");
        return;
    }

    const payload = JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'Markdown'
    });

    const options = {
        hostname: 'api.telegram.org',
        path: `/bot${BOT_TOKEN}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': payload.length
        }
    };

    const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => responseData += chunk);
        res.on('end', () => {
            const result = JSON.parse(responseData);
            if (result.ok) {
                console.log("✅ Message sent to Telegram successfully!");
            } else {
                console.error("❌ Telegram Error:", result.description);
            }
        });
    });

    req.on('error', (e) => {
        console.error("❌ Network Error:", e.message);
    });

    req.write(payload);
    req.end();
}

// --- EXECUTE ---
const summaryText = calculateDailySummary(MOCK_DB_DATA);
sendTelegramMessage(summaryText);
