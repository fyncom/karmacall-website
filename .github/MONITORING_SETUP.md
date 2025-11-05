# Google Search Console Indexing Monitor Setup

This monitoring system checks your indexed pages daily and alerts you if there's a significant drop (default: 10% or more).

## Features

- ✅ Runs automatically every day at 9 AM UTC
- ✅ Tracks indexed page count over time
- ✅ Alerts via email and/or Slack when pages drop significantly
- ✅ Stores 90 days of historical data
- ✅ Can be triggered manually anytime
- ✅ Completely free (runs on GitHub Actions)

## Setup Instructions

### Step 1: Create Google Search Console Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable the **Google Search Console API**:

   - Go to "APIs & Services" → "Library"
   - Search for "Google Search Console API"
   - Click "Enable"

4. Create a Service Account:

   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Name it: `gsc-indexing-monitor`
   - Click "Create and Continue"
   - Skip optional steps, click "Done"

5. Create a JSON key:

   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON"
   - Download the JSON file (keep it safe!)

6. Add service account to Google Search Console:
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Select your property (karmacall.com)
   - Go to "Settings" → "Users and permissions"
   - Click "Add user"
   - Enter the service account email (looks like: `gsc-indexing-monitor@your-project.iam.gserviceaccount.com`)
   - Set permission to "Full" or "Owner"
   - Click "Add"

### Step 2: Set Up GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

1. **GSC_CREDENTIALS** (Required)

   - Open the JSON file you downloaded
   - Copy the entire contents
   - Paste it as the secret value

2. **SMTP_EMAIL** (Optional - for email alerts)

   - Your MX Route email: `support@karmacall.com`
   - This is the account that will send and receive alerts

3. **SMTP_PASSWORD** (Optional - for email alerts)

   - Your MX Route email password
   - See "Setting Up MX Route SMTP" section below

4. **SLACK_WEBHOOK_URL** (Optional - for Slack alerts)

   - Go to your Slack workspace
   - Create an Incoming Webhook: https://api.slack.com/messaging/webhooks
   - Paste the webhook URL here

5. **THRESHOLD_PERCENT** (Optional)
   - Default: `10` (alerts if pages drop by 10% or more)
   - Adjust as needed (e.g., `5` for more sensitive, `20` for less sensitive)

### Setting Up MX Route SMTP (for email alerts)

To send alerts from `support@karmacall.com`:

1. **Get Your MX Route Credentials**:
   - SMTP Server: `echo.mxrouting.net`
   - Port: `465` (SSL) or `587` (TLS)
   - Username: `support@karmacall.com` (your full email address)
   - Password: Your MX Route email password

2. **Add GitHub Secrets**:
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `SMTP_EMAIL`: `support@karmacall.com`
     - `SMTP_PASSWORD`: Your MX Route email password

**Note**: 
- Alerts are sent to `support@karmacall.com` (hardcoded). To change this, edit `.github/scripts/monitor-indexing.py` line 21.
- Default SMTP server is `echo.mxrouting.net` on port `465` (SSL). To use a different server or port, set `SMTP_SERVER` and `SMTP_PORT` environment variables in the workflow file.

### Step 3: Enable GitHub Actions

1. Go to your repository → Actions tab
2. If prompted, enable GitHub Actions
3. The workflow will run automatically daily at 9 AM UTC
4. You can also trigger it manually:
   - Go to Actions → "Monitor Google Indexing"
   - Click "Run workflow"

### Step 4: Test the Setup

Trigger the workflow manually to test:

1. Go to Actions → "Monitor Google Indexing"
2. Click "Run workflow" → "Run workflow"
3. Wait ~1 minute for it to complete
4. Check the logs to verify it's working

You should see output like:

```
✓ connected to Google Search Console API
✓ current indexed pages: 45
✓ first run or insufficient history, establishing baseline
✓ history saved
✅ monitoring check complete
```

## How It Works

1. **Daily Check**: Every day at 9 AM UTC, the script runs
2. **Fetch Data**: Gets indexed page count from Google Search Console
3. **Compare**: Compares to previous day's count
4. **Alert**: If drop exceeds threshold (default 10%), sends alerts via:
   - Email (if configured)
   - Slack (if configured)
   - GitHub Actions logs (always)
5. **Store**: Saves data to track trends over time

## What Gets Monitored

- Total number of pages appearing in Google Search (indexed pages)
- Percentage change from previous day
- Historical trend over 90 days

## When You'll Get Alerted

You'll receive an alert if:

- **CRITICAL (daily alerts)**: Indexed pages are 5 or fewer - you'll get an alert EVERY DAY until fixed
- **WARNING**: Indexed pages drop by 10% or more (configurable)
- **ERROR**: The monitoring script encounters an error

The alert includes:

- Current vs. previous indexed page count
- Percentage change (if applicable)
- Possible causes (Cloudflare, robots.txt, etc.)
- Action items to investigate
- Direct link to Google Search Console

**Important**: If your site is completely deindexed (0 pages) or critically low (≤5 pages), you'll receive a CRITICAL alert every single day until the issue is resolved. This ensures you never miss a catastrophic indexing failure.

## Troubleshooting

### "Permission denied" error

- Make sure you added the service account email to Google Search Console
- Verify it has "Full" or "Owner" permissions

### "Invalid credentials" error

- Check that GSC_CREDENTIALS secret is set correctly
- Make sure you copied the entire JSON file contents

### "No data returned" error

- Your site needs at least 3 days of data in Google Search Console
- Wait a few days and try again

### Email not sending

- Verify SMTP_EMAIL and SMTP_PASSWORD are set correctly
- Make sure you're using your MX Route email password
- Verify the SMTP server is correct: `echo.mxrouting.net`
- Try port `587` instead of `465` if you get SSL errors (add `SMTP_PORT: 587` to workflow env)
- Check MX Route webmail to ensure the account is active
- Test by triggering the workflow manually and checking GitHub Actions logs

### Slack not working

- Verify SLACK_WEBHOOK_URL is set correctly
- Test the webhook URL manually with curl

## Customization

### Change alert threshold

Set `THRESHOLD_PERCENT` secret to a different value (e.g., `5` or `20`)

### Change schedule

Edit `.github/workflows/monitor-indexing.yml`:

```yaml
schedule:
  - cron: "0 9 * * *" # Daily at 9 AM UTC
```

Use [crontab.guru](https://crontab.guru/) to generate different schedules.

### Add more notification channels

Edit `.github/scripts/monitor-indexing.py` to add:

- Discord webhooks
- Telegram bots
- SMS via Twilio
- PagerDuty
- etc.

## Viewing Historical Data

The script stores data in `.github/data/indexing-history.json`

You can view this file to see your indexing trends over time.

## Cost

- **GitHub Actions**: Free (2,000 minutes/month on free plan)
- **Google Search Console API**: Free (unlimited)
- **MX Route SMTP**: Included with your MX Route hosting
- **Slack**: Free

**Total cost: $0/month** 🎉

## Support

If you encounter issues:

1. Check GitHub Actions logs for error messages
2. Verify all secrets are set correctly
3. Test manually by triggering the workflow
4. Check Google Search Console for API access

## What This Prevents

This monitoring system would have caught:

- ✅ Cloudflare Bot Fight Mode blocking Google
- ✅ robots.txt misconfiguration
- ✅ Accidental noindex tags
- ✅ Server/hosting issues
- ✅ Manual actions or penalties
- ✅ Any significant drop in indexed pages

You'll know within 24 hours if something goes wrong, instead of weeks later! 🚀
