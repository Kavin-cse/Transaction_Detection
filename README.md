# Transaction Detection & Automated Expense Tracker 💰

An automated, real-time expense tracking system that captures mobile transaction notifications and logs them into Google Sheets without manual entry.

## 🚀 Overview

This project automates the process of tracking personal finances by intercepting mobile transaction alerts. It uses an event-driven architecture to parse transaction data from notifications/SMS, store it in a structured database (Google Sheets), and generate daily spending summaries via Telegram.

## ✨ Key Features

*   **Real-time Capture**: Listens for transaction notifications via Webhooks.
*   **Zero Manual Entry**: Automatically parses vendor, amount, and category from raw text.
*   **Cloud Storage**: Persists all financial data securely in Google Sheets.
*   **Daily Insights**: Sends a scheduled Telegram message every night with a summary of the day's expenses.

## 🛠️ Tech Stack

*   **Workflow Engine**: [n8n](https://n8n.io/)
*   **Scripting**: JavaScript (Node.js for logic)
*   **Database**: Google Sheets API
*   **Notifications**: Telegram Bot API
*   **Triggers**: REST Webhooks

## 🔄 How It Works

1.  **Trigger**: A mobile automation tool (like MacroDroid/Tasker) detects a transaction notification and sends the payload to an **n8n Webhook**.
2.  **Process**: n8n workflows run custom **JavaScript** to clean and extract data (Amount, Vendor, Date).
3.  **Store**: The cleaned data is appended to a **Google Sheet**.
4.  **Report**: A scheduled job calculates the daily total and utilizes the **Telegram Bot** to send a summary to the user.
