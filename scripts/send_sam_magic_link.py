#!/usr/bin/env python3
"""Quick script to send Sam a magic link"""

import os
import sys
import secrets
from datetime import datetime, timedelta
from supabase import create_client
from dotenv import load_dotenv
import requests

load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
NYLAS_API_KEY = os.getenv('NYLAS_API_KEY')
NYLAS_GRANT_ID = os.getenv('NYLAS_GRANT_ID')
SITE_URL = "https://xlb.vercel.app"  # Production URL

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Get active round
response = supabase.table('rounds').select('*').eq('is_active', True).execute()
round_data = response.data[0]

# Check if Sam exists
response = supabase.table('users').select('*').eq('email', 'sam@edw4rds.com').execute()

if response.data:
    user = response.data[0]
    print(f"✅ User exists: {user['name']}")
else:
    # Create Sam
    print("Creating Sam...")
    new_user = {
        'email': 'sam@edw4rds.com',
        'name': 'Sam Edwards',
        'team_name': "Sam's Team"
    }
    response = supabase.table('users').insert(new_user).execute()
    user = response.data[0]
    print(f"✅ User created: {user['name']}")

# Generate magic link
token = secrets.token_urlsafe(32)
expires_at = datetime.now() + timedelta(days=7)

magic_link = {
    'user_id': user['id'],
    'round_id': round_data['id'],
    'token': token,
    'expires_at': expires_at.isoformat()
}

supabase.table('magic_links').insert(magic_link).execute()

url = f"{SITE_URL}/fantasy-football/submit?token={token}"
print(f"\n✅ Magic link created: {url}")

# Send email
html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
        .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
        .button {{ display: inline-block; background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }}
        .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏈 XL Benefits Fantasy Football</h1>
            <h2>Submit Your Lineup - Round {round_data['round_number']}</h2>
        </div>
        <div class="content">
            <p>Hey <strong>Sam</strong>!</p>

            <p>Here's your magic link for the XL Benefits Fantasy Football Challenge.</p>

            <p><strong>Your Team:</strong> Sam's Team</p>

            <p style="text-align: center;">
                <a href="{url}" class="button">
                    📋 Submit Your Lineup
                </a>
            </p>

            <h3>What You Need to Do:</h3>
            <ul>
                <li>Select 8 players: 1 QB, 2 RB, 2 WR, 1 TE, 1 K, 1 DEF</li>
                <li>Maximum 2 elite players (shown in gold with ELITE badge)</li>
                <li>Your lineup locks for the entire round</li>
            </ul>

            <p><strong>This link expires in 7 days.</strong></p>

            <p>— The XL Benefits Team</p>
        </div>
        <div class="footer">
            <p>XL Benefits Fantasy Football Challenge 2025</p>
        </div>
    </div>
</body>
</html>
"""

headers = {
    'Authorization': f'Bearer {NYLAS_API_KEY}',
    'Content-Type': 'application/json'
}

payload = {
    'subject': f'🏈 Submit Your Lineup - Sam\'s Team',
    'body': html_content,
    'to': [{'email': 'sam@edw4rds.com', 'name': 'Sam Edwards'}],
    'from': [{'email': 'sam@edw4rds.com', 'name': 'XL Benefits Fantasy Football'}],
    'reply_to': [{'email': 'sam@edw4rds.com', 'name': 'Sam Edwards'}]
}

api_url = f'https://api.us.nylas.com/v3/grants/{NYLAS_GRANT_ID}/messages/send'
response = requests.post(api_url, json=payload, headers=headers)

if response.status_code in [200, 201]:
    print(f"✅ Email sent successfully!")
else:
    print(f"❌ Email failed: {response.status_code}")
    print(f"   Error: {response.text}")
