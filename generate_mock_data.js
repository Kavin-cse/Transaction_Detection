const https = require('https');

// Using PRODUCTION URL (Requires workflow to be Active)
const WEBHOOK_URL = 'https://kavinm.app.n8n.cloud/webhook-test/transaction-webhook';

const VENDORS = ['Swiggy', 'Zomato', 'Uber', 'Netflix', 'Amazon', 'Starbucks', 'Reliance Jio'];
const TEMPLATES = [
    "Rs. {amount} debited from Ac/XX8932 to {vendor} via UPI. Ref: 12345678.",
    "Payment of INR {amount} to {vendor} successful.",
    "Spent Rs. {amount} at {vendor} using Credit Card ending 1234."
];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generatePayload() {
    const vendor = getRandomElement(VENDORS);
    const amount = (Math.random() * 2000 + 50).toFixed(2);
    const template = getRandomElement(TEMPLATES);

    const text = template.replace('{amount}', amount).replace('{vendor}', vendor);

    return {
        text: text,
        source: "mock_script",
        timestamp: new Date().toISOString(),
        app: "Simulated"
    };
}

function sendTransaction() {
    const payload = generatePayload();
    const data = JSON.stringify(payload);

    const url = new URL(WEBHOOK_URL);
    const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = (url.protocol === 'https:' ? https : require('http')).request(options, (res) => {
        console.log(`Sent: "${payload.text}" | Status: ${res.statusCode}`);
    });

    req.on('error', (error) => {
        console.error('Error sending transaction:', error.message);
    });

    req.write(data);
    req.end();
}

// Send 5 interactions
console.log(`Sending 5 mock transactions to ${WEBHOOK_URL}...\n`);
let count = 0;
const interval = setInterval(() => {
    sendTransaction();
    count++;
    if (count >= 5) clearInterval(interval);
}, 1000);
