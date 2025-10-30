#!/usr/bin/env python3
"""
Send magic link to a user for lineup submission

Creates user if doesn't exist, generates magic link, sends email via Nylas
"""

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
SITE_URL = os.getenv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')

if not all([SUPABASE_URL, SUPABASE_KEY, NYLAS_API_KEY, NYLAS_GRANT_ID]):
    print("ERROR: Missing required environment variables")
    print(f"SUPABASE_URL: {'✓' if SUPABASE_URL else '✗'}")
    print(f"SUPABASE_KEY: {'✓' if SUPABASE_KEY else '✗'}")
    print(f"NYLAS_API_KEY: {'✓' if NYLAS_API_KEY else '✗'}")
    print(f"NYLAS_GRANT_ID: {'✓' if NYLAS_GRANT_ID else '✗'}")
    sys.exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_or_create_user(email: str, name: str, team_name: str):
    """Get existing user or create new one"""
    print(f"\n👤 Checking user: {email}")

    # Check if user exists
    response = supabase.table('users').select('*').eq('email', email).execute()

    if response.data and len(response.data) > 0:
        user = response.data[0]
        print(f"✅ User exists: {user['name']} - {user['team_name']}")
        return user

    # Create new user
    print(f"📝 Creating new user...")
    new_user = {
        'email': email,
        'name': name,
        'team_name': team_name
    }

    response = supabase.table('users').insert(new_user).execute()
    user = response.data[0]
    print(f"✅ User created: {user['name']} - {user['team_name']}")
    return user


def get_or_create_active_round():
    """Get active round or create a test round"""
    print(f"\n🏈 Checking for active round...")

    # Check for active round
    response = supabase.table('rounds').select('*').eq('is_active', True).execute()

    if response.data and len(response.data) > 0:
        round_data = response.data[0]
        print(f"✅ Found active round: Round {round_data['round_number']} (Weeks {round_data['start_week']}-{round_data['end_week']})")
        return round_data

    # Create test round
    print(f"📝 Creating test round...")
    today = datetime.now()

    new_round = {
        'round_number': 1,
        'start_week': 1,
        'end_week': 9,
        'start_date': '2025-09-04',
        'end_date': '2025-11-02',
        'is_active': True
    }

    response = supabase.table('rounds').insert(new_round).execute()
    round_data = response.data[0]
    print(f"✅ Round created: Round {round_data['round_number']} (Weeks {round_data['start_week']}-{round_data['end_week']})")
    return round_data


def generate_magic_link(user_id: str, round_id: str):
    """Generate magic link token and save to database"""
    print(f"\n🔗 Generating magic link...")

    # Generate secure token
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now() + timedelta(days=7)

    # Save to database
    magic_link = {
        'user_id': user_id,
        'round_id': round_id,
        'token': token,
        'expires_at': expires_at.isoformat()
    }

    response = supabase.table('magic_links').insert(magic_link).execute()

    url = f"{SITE_URL}/fantasy-football/submit?token={token}"

    print(f"✅ Magic link created")
    print(f"   Token: {token[:20]}...")
    print(f"   Expires: {expires_at.strftime('%Y-%m-%d %H:%M')}")
    print(f"   URL: {url}")

    return url, token


def send_email_nylas(email: str, name: str, team_name: str, magic_link_url: str):
    """Send magic link email via Nylas"""
    print(f"\n📧 Sending email to {email} via Nylas...")

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
                <h2>Submit Your Lineup - Round 1</h2>
            </div>
            <div class="content">
                <p>Hey <strong>{name}</strong>!</p>

                <p>Welcome to the XL Benefits Fantasy Football Challenge! It's time to set your lineup for Round 1 (Weeks 1-9).</p>

                <p><strong>Your Team:</strong> {team_name}</p>

                <p style="text-align: center;">
                    <a href="{magic_link_url}" class="button">
                        📋 Submit Your Lineup
                    </a>
                </p>

                <h3>What You Need to Do:</h3>
                <ul>
                    <li>Select 8 players: 1 QB, 2 RB, 2 WR, 1 TE, 1 K, 1 DEF</li>
                    <li>Maximum 2 elite players (shown in gold with ELITE badge)</li>
                    <li>Your lineup locks for the entire round</li>
                </ul>

                <h3>Scoring:</h3>
                <ul>
                    <li><strong>Weekly Prize:</strong> $25 for highest scorer each week</li>
                    <li><strong>Round Prizes:</strong> $150 / $100 / $50 for top 3</li>
                    <li><strong>Season Championship:</strong> $400 / $250 / $100</li>
                </ul>

                <p><strong>This link expires in 7 days.</strong></p>

                <p>Good luck!</p>

                <p>— The XL Benefits Team</p>
            </div>
            <div class="footer">
                <p>XL Benefits Fantasy Football Challenge 2025</p>
                <p>Questions? Reply to this email</p>
            </div>
        </div>
    </body>
    </html>
    """

    # Plain text version
    text_content = f"""
XL Benefits Fantasy Football - Submit Your Lineup

Hey {name}!

Welcome to the XL Benefits Fantasy Football Challenge! It's time to set your lineup for Round 1 (Weeks 1-9).

Your Team: {team_name}

Submit Your Lineup: {magic_link_url}

What You Need to Do:
- Select 8 players: 1 QB, 2 RB, 2 WR, 1 TE, 1 K, 1 DEF
- Maximum 2 elite players (shown in gold with ELITE badge)
- Your lineup locks for the entire round

Scoring:
- Weekly Prize: $25 for highest scorer each week
- Round Prizes: $150 / $100 / $50 for top 3
- Season Championship: $400 / $250 / $100

This link expires in 7 days.

Good luck!

— The XL Benefits Team

XL Benefits Fantasy Football Challenge 2025
Questions? Reply to this email
    """

    # Send via Nylas API
    headers = {
        'Authorization': f'Bearer {NYLAS_API_KEY}',
        'Content-Type': 'application/json'
    }

    payload = {
        'subject': f'🏈 Submit Your Lineup - {team_name}',
        'body': html_content,
        'to': [{'email': email, 'name': name}],
        'from': [{'email': 'sam@edw4rds.com', 'name': 'XL Benefits Fantasy Football'}],
        'reply_to': [{'email': 'sam@edw4rds.com', 'name': 'Sam Edwards'}]
    }

    # Nylas v3 API endpoint
    url = f'https://api.us.nylas.com/v3/grants/{NYLAS_GRANT_ID}/messages/send'

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code in [200, 201]:
        print(f"✅ Email sent successfully via Nylas!")
        print(f"   Response: {response.json()}")
        return True
    else:
        print(f"❌ Email failed: {response.status_code}")
        print(f"   Error: {response.text}")
        return False


def main():
    print("=" * 70)
    print("XL BENEFITS FANTASY FOOTBALL - SEND MAGIC LINK (NYLAS)")
    print("=" * 70)

    # List of users to send magic links to
    users = [
        {
            'email': 'jlandziak@xlbenefits.com',
            'name': 'Joe Landziak',
            'team_name': 'Joe\'s Team'
        },
        {
            'email': 'dpitts@xlbenefits.com',
            'name': 'Daron Pitts',
            'team_name': 'Daron\'s Team'
        }
    ]

    # Get or create active round (only need to do this once)
    round_data = get_or_create_active_round()

    # Send magic link to each user
    for user_info in users:
        print("\n" + "=" * 70)
        print(f"Processing: {user_info['name']} ({user_info['email']})")
        print("=" * 70)

        # Step 1: Get or create user
        user = get_or_create_user(user_info['email'], user_info['name'], user_info['team_name'])

        # Step 2: Generate magic link
        magic_link_url, token = generate_magic_link(user['id'], round_data['id'])

        # Step 3: Send email via Nylas
        send_email_nylas(user_info['email'], user_info['name'], user_info['team_name'], magic_link_url)

        print(f"\n✅ Magic link sent to: {user_info['email']}")
        print(f"🔗 Direct link: {magic_link_url}")

    print("\n" + "=" * 70)
    print("✅ ALL MAGIC LINKS SENT")
    print("=" * 70)
    print(f"\n📧 Sent magic links to {len(users)} users via Nylas (from sam@edw4rds.com)")
    print("=" * 70)


if __name__ == '__main__':
    main()
