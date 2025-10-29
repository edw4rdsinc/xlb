interface DraftInviteParams {
  teamName: string;
  magicLinkUrl: string;
  roundNumber: number;
  startWeek: number;
  endWeek: number;
  deadline: string; // e.g., "October 17, 2025 at 5 PM"
}

export function generateDraftInviteEmail({
  teamName,
  magicLinkUrl,
  roundNumber,
  startWeek,
  endWeek,
  deadline,
}: DraftInviteParams): { subject: string; html: string; text: string } {
  const subject = `🏈 XL Benefits Fantasy Football - Round ${roundNumber} Draft is Open!`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 28px;">🏈 Fantasy Football</h1>
    <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Round ${roundNumber} Draft</p>
  </div>

  <div style="background: #f7fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">

    <h2 style="color: #2d3748; margin-top: 0;">Hey ${teamName}!</h2>

    <p style="font-size: 16px; color: #4a5568;">
      It's time to draft your lineup for <strong>Round ${roundNumber} (Weeks ${startWeek}-${endWeek})</strong>!
    </p>

    <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
      <p style="margin: 0 0 15px 0; font-size: 14px; color: #718096; text-transform: uppercase; letter-spacing: 1px;">
        Your Personal Draft Link
      </p>
      <a href="${magicLinkUrl}" style="display: inline-block; background: #667eea; color: white; text-decoration: none; padding: 15px 40px; border-radius: 6px; font-weight: 600; font-size: 16px;">
        Set Your Lineup →
      </a>
    </div>

    <div style="background: #fff5f5; border-left: 4px solid #f56565; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #742a2a;">
        <strong>⚠️ Draft Deadline:</strong> ${deadline}
      </p>
    </div>

    <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #2d3748; font-size: 18px;">📋 What's Next?</h3>
      <ol style="color: #4a5568; padding-left: 20px;">
        <li style="margin-bottom: 10px;">Click the button above to access your draft page</li>
        <li style="margin-bottom: 10px;">Select your QB, RBs, WRs, TE, K, and DEF</li>
        <li style="margin-bottom: 10px;">Submit your lineup before the deadline</li>
        <li style="margin-bottom: 10px;">Check the leaderboard weekly to see your scores!</li>
      </ol>
    </div>

    <p style="font-size: 14px; color: #718096; margin-top: 30px;">
      <strong>Note:</strong> This link is unique to you and expires in 7 days. If you need a new link, contact your league administrator.
    </p>

    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

    <p style="font-size: 14px; color: #718096; text-align: center; margin-bottom: 0;">
      Good luck! 🍀<br>
      <strong>XL Benefits Team</strong>
    </p>

  </div>

  <div style="text-align: center; padding: 20px; font-size: 12px; color: #a0aec0;">
    <p style="margin: 0;">
      XL Benefits Fantasy Football League<br>
      Questions? Reply to this email for support.
    </p>
  </div>

</body>
</html>
  `;

  const text = `
🏈 XL Benefits Fantasy Football - Round ${roundNumber} Draft

Hey ${teamName}!

It's time to draft your lineup for Round ${roundNumber} (Weeks ${startWeek}-${endWeek})!

👉 Set Your Lineup:
${magicLinkUrl}

⚠️ Draft Deadline: ${deadline}

This link is unique to you and expires in 7 days.

What's Next?
1. Click the link above to access your draft page
2. Select your QB, RBs, WRs, TE, K, and DEF
3. Submit your lineup before the deadline
4. Check the leaderboard weekly to see your scores!

Good luck! 🍀
- XL Benefits Team

---
Questions? Reply to this email for support.
  `;

  return { subject, html, text };
}
