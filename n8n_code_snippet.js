// 1. Get all items from the previous node (Google Sheets)
const items = $input.all();

// 2. Get Today's Date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];
// If your sheet dates are in a different format, you might need to adjust this! 
// e.g. if sheet has "30/01/2026", you'll need to parse that matching format.

let grandTotal = 0;

// 3. Loop through all rows
for (const item of items) {
    const row = item.json; // Access the JSON data of the row

    // ADJUST THESE FIELD NAMES to match your Google Sheet headers exactly
    const dateStr = row['timestamp'] || row['Date'];
    const amount = parseFloat(row['amount'] || row['Amount']);

    // Check if the transaction is from Today
    // (Simple string match, assumes the date in sheet starts with YYYY-MM-DD or matches exactly)
    if (dateStr && dateStr.startsWith(today)) {
        if (!isNaN(amount)) {
            grandTotal += amount;
        }
    }
}

// 4. Construct the formatted message
const message = `📊 *Daily Expense Summary* (${today})\n\n💰 *Total Spent Today: ₹${grandTotal.toFixed(2)}*`;

// 5. Return the message so the next node (Telegram) can use it
return [
    {
        json: {
            summary_message: message,
            total_amount: grandTotal,
            date: today
        }
    }
];
