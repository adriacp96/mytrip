# 🚀 Quick Start Guide

## Step 1: Supabase Setup (5 minutes)

### Create Project
1. Go to https://supabase.com and sign up
2. Create a new project
3. Wait for it to initialize

### Create Tables
1. Go to SQL Editor
2. Copy the entire SQL script from `IMPLEMENTATION_NOTES.md`
3. Paste it into SQL Editor
4. Click "Run"
5. Wait for completion ✅

### Configure Auth
1. Go to Authentication → Providers
2. Make sure "Email" is enabled
3. Go to Settings → General
4. Set "Site URL" to your GitHub Pages URL (e.g., `https://yourusername.github.io/mytrip`)
5. Add same URL as "Redirect URL"

### Get Credentials
1. Go to Settings → API
2. Copy "Project URL"
3. Copy "Anon Key"

## Step 2: Update App Credentials (1 minute)

In `app.js` (line 3-4), replace:
```javascript
const SUPABASE_URL = "your-project-url-here";
const SUPABASE_ANON_KEY = "your-anon-key-here";
```

## Step 3: Deploy to GitHub (2 minutes)

```bash
git add .
git commit -m "MyTrip app ready"
git push origin main
```

Go to repo Settings → Pages → Select "main" branch → Save

## Step 4: Start Using! 🎉

1. Open your GitHub Pages URL
2. Sign in with email (magic link)
3. Create a trip
4. Invite friends (copy join link)
5. Start planning!

---

## Features at a Glance

### 📋 Itinerary Tab
- Add activities with dates & locations
- Categories: activity, accommodation, transport, food
- Edit or delete items
- Sort by date automatically

### 💰 Expenses Tab
- Log all trip expenses
- See budget summary by category
- Track who paid
- Multi-currency support

### 👥 Members Tab
- See all trip members
- View roles (owner, editor, viewer)
- Remove members (owner only)

### 🧳 Packing Tab
- Create multiple packing lists
- Check off items
- See progress percentage

### ⚙️ Settings Tab
- Edit trip name, dates, description
- Change currency
- View activity log
- See who did what and when

---

## Troubleshooting

### "Table doesn't exist" error
→ SQL script didn't run properly. Try again.

### "Auth token invalid" error
→ Check SUPABASE_URL and SUPABASE_ANON_KEY are correct

### Can't see other people's changes
→ Refresh the page (Ctrl+Shift+R to clear cache)

### Can't sign in
→ Check Email provider is enabled in Supabase Auth

### No email received
→ Check spam folder, or wait a few seconds

---

## API Endpoints Used

All handled by Supabase via JavaScript SDK:
- `supabase.from("trips").select()...`
- `supabase.auth.signInWithOtp()`
- Real-time subscriptions with `.channel()`

No backend server needed!

---

## Tech Stack

```
Frontend:     HTML + CSS + Vanilla JavaScript
Database:     PostgreSQL (via Supabase)
Auth:         Supabase Auth with magic links
Real-time:    Supabase Realtime
Hosting:      GitHub Pages (static)
```

---

## Next Steps (Optional)

- Add more currencies
- Custom category colors
- Export to PDF
- Share photos
- Advanced budget reports
- Mobile app version

---

## Need Help?

1. Check browser console (F12) for errors
2. Verify SQL script ran in Supabase
3. Check authentication is enabled
4. Ensure credentials are correct in app.js

Happy trip planning! ✈️🌍
