# FocusOS Setup Guide

## Quick Start (Demo Mode)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in development mode:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

The app will run in demo mode with sample data. All features work but data is not persisted.

## Full Setup (Production Mode)

### 1. Supabase Setup

1. **Create a Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for setup to complete

2. **Run database migrations:**
   - Copy the SQL from `../../supabase/migrations/0001_init.sql`
   - Paste it in your Supabase SQL Editor
   - Run the migration

3. **Get your credentials:**
   - Go to Project Settings → API
   - Copy your Project URL and anon public key

4. **Create environment file:**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your actual values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
   RESEND_API_KEY=your_resend_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 2. Email Setup (Optional)

1. **Resend Setup:**
   - Go to [resend.com](https://resend.com)
   - Create an account and get your API key
   - Add it to `.env.local`

2. **Domain Verification:**
   - Verify your domain in Resend
   - Update the `from` email in API routes

### 3. Build and Deploy

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repo to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy!

## Features Status

✅ **Working in Demo Mode:**
- Task management (create, edit, delete)
- Focus timer (Pomodoro)
- Mood tracking
- Friend management UI
- Learning resources
- Dashboard with sample data

✅ **Working in Production Mode:**
- All demo features + data persistence
- Real-time updates
- User authentication
- Friend requests with email notifications
- Progress tracking across sessions

## Troubleshooting

### Build Errors
- Ensure all environment variables are set
- Check that Supabase project is active
- Verify API keys are correct

### Runtime Errors
- Check browser console for errors
- Verify Supabase connection
- Check environment variable format

### Email Issues
- Verify Resend API key
- Check domain verification
- Review email templates

## Next Steps

1. **Customize the UI** - Update colors, branding, and layout
2. **Add more features** - Implement XP system, streaks, achievements
3. **Mobile app** - Complete the Flutter mobile app
4. **Analytics** - Add user behavior tracking
5. **Notifications** - Push notifications for reminders
