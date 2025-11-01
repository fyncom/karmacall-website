#!/usr/bin/env python3
"""
Google Search Console Indexing Monitor
Checks indexed pages daily and alerts if there's a significant drop
"""

import os
import json
import sys
from datetime import datetime, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build
import requests

# Configuration
SITE_URL = os.environ.get('SITE_URL', 'https://www.karmacall.com')
THRESHOLD_PERCENT = int(os.environ.get('THRESHOLD_PERCENT', 10))
ALERT_EMAIL = os.environ.get('ALERT_EMAIL')
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
SLACK_WEBHOOK_URL = os.environ.get('SLACK_WEBHOOK_URL')

# File to store historical data
HISTORY_FILE = '.github/data/indexing-history.json'

def get_gsc_service():
    """Initialize Google Search Console API service"""
    credentials_json = os.environ.get('GSC_CREDENTIALS')
    if not credentials_json:
        raise ValueError("GSC_CREDENTIALS environment variable not set")
    
    credentials_dict = json.loads(credentials_json)
    credentials = service_account.Credentials.from_service_account_info(
        credentials_dict,
        scopes=['https://www.googleapis.com/auth/webmasters.readonly']
    )
    
    return build('searchconsole', 'v1', credentials=credentials)

def get_indexed_pages_count(service):
    """Get the count of indexed pages from GSC"""
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=3)
    
    request = {
        'startDate': str(start_date),
        'endDate': str(end_date),
        'dimensions': ['page'],
        'rowLimit': 25000
    }
    
    response = service.searchanalytics().query(
        siteUrl=SITE_URL,
        body=request
    ).execute()
    
    pages = response.get('rows', [])
    return len(pages)

def load_history():
    """Load historical indexing data"""
    try:
        with open(HISTORY_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {'records': []}

def save_history(history):
    """Save historical indexing data"""
    os.makedirs(os.path.dirname(HISTORY_FILE), exist_ok=True)
    with open(HISTORY_FILE, 'w') as f:
        json.dump(history, f, indent=2)

def send_email_alert(subject, message):
    """Send email alert via SendGrid"""
    if not SENDGRID_API_KEY or not ALERT_EMAIL:
        print("email alert not configured, skipping email notification")
        return
    
    url = "https://api.sendgrid.com/v3/mail/send"
    headers = {
        "Authorization": f"Bearer {SENDGRID_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "personalizations": [{
            "to": [{"email": ALERT_EMAIL}],
            "subject": subject
        }],
        "from": {"email": ALERT_EMAIL},
        "content": [{
            "type": "text/plain",
            "value": message
        }]
    }
    
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 202:
        print(f"email sent successfully to {ALERT_EMAIL}")
    else:
        print(f"failed to send email: {response.status_code} - {response.text}")

def send_slack_alert(message):
    """Send alert to Slack"""
    if not SLACK_WEBHOOK_URL:
        print("slack webhook not configured, skipping slack notification")
        return
    
    data = {
        "text": f"🚨 *KarmaCall Indexing Alert*\n\n{message}",
        "username": "Indexing Monitor"
    }
    
    response = requests.post(SLACK_WEBHOOK_URL, json=data)
    if response.status_code == 200:
        print("slack notification sent successfully")
    else:
        print(f"failed to send slack notification: {response.status_code}")

def send_alert(subject, message):
    """Send alert via all configured channels"""
    print(f"\n{'='*60}")
    print(f"ALERT: {subject}")
    print(f"{'='*60}")
    print(message)
    print(f"{'='*60}\n")
    
    send_email_alert(subject, message)
    send_slack_alert(message)

def main():
    print(f"starting indexing monitor for {SITE_URL}")
    print(f"threshold: {THRESHOLD_PERCENT}% drop")
    
    try:
        # Get GSC service
        service = get_gsc_service()
        print("✓ connected to Google Search Console API")
        
        # Get current indexed pages count
        current_count = get_indexed_pages_count(service)
        print(f"✓ current indexed pages: {current_count}")
        
        # Load history
        history = load_history()
        records = history.get('records', [])
        
        # Add current record
        today = str(datetime.now().date())
        new_record = {
            'date': today,
            'count': current_count,
            'timestamp': datetime.now().isoformat()
        }
        records.append(new_record)
        
        # Keep only last 90 days
        records = records[-90:]
        
        # Check for significant drop
        if len(records) >= 2:
            previous_count = records[-2]['count']
            previous_date = records[-2]['date']
            
            if previous_count > 0:
                change_percent = ((current_count - previous_count) / previous_count) * 100
                
                print(f"✓ previous count ({previous_date}): {previous_count}")
                print(f"✓ change: {change_percent:+.1f}%")
                
                if change_percent < -THRESHOLD_PERCENT:
                    # Significant drop detected!
                    message = f"""
⚠️ SIGNIFICANT INDEXING DROP DETECTED

Site: {SITE_URL}
Previous indexed pages: {previous_count} ({previous_date})
Current indexed pages: {current_count} ({today})
Change: {change_percent:.1f}%

This is a {abs(change_percent):.1f}% drop, which exceeds the {THRESHOLD_PERCENT}% threshold.

Possible causes:
1. Cloudflare Bot Fight Mode enabled
2. robots.txt blocking crawlers
3. Server/hosting issues
4. Manual actions or penalties
5. Technical SEO issues

Action required:
1. Check Google Search Console for errors
2. Verify Cloudflare settings (Bot Fight Mode OFF)
3. Test robots.txt: {SITE_URL}/robots.txt
4. Check sitemap: {SITE_URL}/sitemap-index.xml
5. Review recent site changes

View full report: https://search.google.com/search-console?resource_id={SITE_URL}
"""
                    send_alert(
                        f"⚠️ KarmaCall: {abs(change_percent):.0f}% Indexing Drop Detected",
                        message
                    )
                elif change_percent < 0:
                    print(f"⚠️ minor drop detected ({change_percent:.1f}%), but below threshold")
                else:
                    print(f"✓ indexing is stable or improving ({change_percent:+.1f}%)")
        else:
            print("✓ first run or insufficient history, establishing baseline")
        
        # Save updated history
        history['records'] = records
        history['last_updated'] = datetime.now().isoformat()
        save_history(history)
        print(f"✓ history saved to {HISTORY_FILE}")
        
        print("\n✅ monitoring check complete")
        
    except Exception as e:
        error_message = f"""
❌ ERROR IN INDEXING MONITOR

Site: {SITE_URL}
Error: {str(e)}
Time: {datetime.now().isoformat()}

The monitoring script encountered an error and could not complete.
Please check the GitHub Actions logs for details.
"""
        send_alert("❌ KarmaCall: Indexing Monitor Error", error_message)
        print(f"\n❌ error: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()

