# Email Setup Guide for FocusOS Friends

This guide will help you set up the email functionality for friend requests in FocusOS.

## Prerequisites

1. **Resend Account**: Sign up at [resend.com](https://resend.com) (free tier available)
2. **Domain Verification**: Verify your domain in Resend (or use their sandbox domain for testing)

## Setup Steps

### 1. Get Your Resend API Key

1. Log into your Resend dashboard
2. Go to API Keys section
3. Create a new API key
4. Copy the API key (starts with `re_`)

### 2. Environment Configuration

Create a `.env.local` file in the `apps/web` directory with:

```bash
# Email Configuration
RESEND_API_KEY=re_your_actual_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Update Email From Address

In the API routes, update the `from` field:

**File**: `src/app/api/friends/send-request/route.ts`
**File**: `src/app/api/friends/accept/route.ts`

Change this line:
```typescript
from: 'FocusOS <noreply@yourdomain.com>',
```

To your verified domain:
```typescript
from: 'FocusOS <noreply@yourdomain.com>',
```

### 4. Test the Setup

1. Start your development server: `pnpm dev`
2. Go to `/friends` page
3. Enter a friend's email address
4. Click "Send Request"
5. Check the friend's email for the invitation

## Email Templates

The system includes two email templates:

1. **Friend Request Email**: Sent when inviting someone
2. **Acceptance Confirmation**: Sent when a request is accepted

Both emails are HTML-formatted with:
- Professional styling
- Clear call-to-action buttons
- Responsive design
- FocusOS branding

## Troubleshooting

### Common Issues

1. **"Failed to send email" error**
   - Check your RESEND_API_KEY is correct
   - Verify your domain is verified in Resend
   - Check the Resend dashboard for any errors

2. **Emails not received**
   - Check spam/junk folders
   - Verify the recipient email is correct
   - Check Resend dashboard for delivery status

3. **API route errors**
   - Check browser console for errors
   - Verify environment variables are loaded
   - Check Next.js server logs

### Testing

For development, you can:
1. Use your own email address for testing
2. Check the Resend dashboard for email logs
3. Use the sandbox domain for initial testing

## Production Deployment

When deploying to production:

1. Update `NEXT_PUBLIC_APP_URL` to your production domain
2. Ensure your domain is verified in Resend
3. Set environment variables in your hosting platform
4. Test with real email addresses

## Security Notes

- Never commit your `.env.local` file
- Use environment variables for all sensitive data
- Consider rate limiting for the email API routes
- Validate email addresses on both client and server side
