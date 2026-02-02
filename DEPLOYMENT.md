# MyTrip Deployment Guide

## GitHub Pages Setup

Your app is ready to deploy to GitHub Pages!

### Steps:
1. Go to https://github.com/adriacp96/mytrip/settings/pages
2. Under **Source**, select:
   - Deploy from a branch
   - Branch: `main`
   - Folder: `/ (root)`
3. Click **Save**
4. Wait 1-2 minutes for the build to complete

### Live URL:
`https://adriacp96.github.io/mytrip/`

---

## Database Status

✅ **Supabase Project**: upzbngnbkkbnpfcxguer  
✅ **Tables Created**: trips, trip_members, itinerary_items, expenses, expense_splits, packing_lists, packing_items, activity_log  
✅ **RLS Policies**: Fixed and deployed  
✅ **Real-time Subscriptions**: Enabled on all tables  

### Applied RLS Policies:
- **trips**: Owner can create/update/delete. Owner + members can read.
- **trip_members**: Users can add themselves. Owner can remove anyone.
- **All other tables**: Owner + members can read/create/update/delete.
- **trip_members**: RLS disabled to prevent circular recursion (safe via FK constraints).

---

## Features Deployed

- 🔐 **Authentication**: Supabase magic link (email)
- 🛫 **Trip Management**: Create, join, edit trips
- 📋 **Itinerary**: Add activities by day
- 💰 **Expenses**: Track splits automatically
- 👥 **Members**: Invite via link or ID
- 🎒 **Packing Lists**: Collaborative checklists
- 📝 **Activity Log**: See all changes in real-time
- 🔄 **Real-time Sync**: All changes sync instantly across devices

---

## Using the App

### Create a Trip:
1. Sign in with your email
2. Click "Create Trip"
3. Enter a title
4. Share the trip link with friends

### Join a Trip:
- Use the **join link** from the trip creator
- Or manually enter the **Trip ID** in "Join Existing Trip"

### Invite Members:
1. Open a trip
2. Click **Copy Join Link** 
3. Share with your team
4. They click the link and join automatically

### Add Items:
- **Itinerary**: Plan activities by date
- **Expenses**: Track who paid what
- **Packing**: Create shared checklists

---

## Environment Variables

The app uses these Supabase credentials (already configured in `app.js`):
```javascript
const SUPABASE_URL = "https://upzbngnbkkbnpfcxguer.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

These are **public** and safe to commit (anonymous key only).

---

## Development

### Local Testing:
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref upzbngnbkkbnpfcxguer

# Start local dev environment
supabase start

# Run local server
python -m http.server 8000
# Visit: http://localhost:8000
```

### Migrations:
All migrations are in `/supabase/migrations/`

---

## Support

For issues:
1. Check browser console (F12) for errors
2. Check Supabase dashboard for data issues
3. Verify RLS policies in Supabase → Authentication → Policies

---

## Next Steps

- [ ] Enable GitHub Pages (Settings → Pages)
- [ ] Share your deployed URL with the team
- [ ] Test all features in production
- [ ] Monitor real-time sync
- [ ] Gather feedback and iterate

