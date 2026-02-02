# ✅ MyTrip - Setup Checklist

## Phase 1: Supabase Setup

### Project Creation
- [ ] Go to supabase.com
- [ ] Create new project
- [ ] Wait for initialization (5-10 min)
- [ ] Note your Project URL
- [ ] Note your Anon Key

### Database Tables
- [ ] Go to SQL Editor in Supabase
- [ ] Copy entire SQL script from `IMPLEMENTATION_NOTES.md`
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Verify no errors
- [ ] Verify all 8 tables created:
  - [ ] trips
  - [ ] trip_members
  - [ ] itinerary_items
  - [ ] expenses
  - [ ] expense_splits
  - [ ] packing_lists
  - [ ] packing_items
  - [ ] activity_log

### Row Level Security
- [ ] All RLS policies created in SQL script
- [ ] Verify policies applied to all tables

### Authentication
- [ ] Go to Authentication → Providers
- [ ] Ensure "Email" is enabled
- [ ] Go to Settings → General
- [ ] Copy your GitHub Pages URL (e.g., https://yourusername.github.io/mytrip)
- [ ] Set as "Site URL"
- [ ] Add same URL as "Redirect URL"
- [ ] Save changes

---

## Phase 2: Application Setup

### Update Credentials
- [ ] Open `app.js` in editor
- [ ] Go to line 3: `const SUPABASE_URL = ...`
- [ ] Replace with your Project URL
- [ ] Go to line 4: `const SUPABASE_ANON_KEY = ...`
- [ ] Replace with your Anon Key
- [ ] Save file

### Verify Files
- [ ] `index.html` - 350+ lines ✓
- [ ] `app.js` - 900+ lines ✓
- [ ] `styles.css` - 450+ lines ✓
- [ ] `README.md` - Complete ✓
- [ ] `QUICKSTART.md` - Complete ✓
- [ ] `IMPLEMENTATION_NOTES.md` - Complete ✓
- [ ] `FEATURES.md` - Complete ✓

### Check for Errors
- [ ] Open browser console (F12)
- [ ] No errors showing
- [ ] No warnings about missing credentials

---

## Phase 3: GitHub Deployment

### Git Commit
```bash
git add .
git commit -m "MyTrip - Complete collaborative trip planner"
git push origin main
```

- [ ] Run commands above
- [ ] Files pushed to GitHub
- [ ] Verify with `git log`

### Enable GitHub Pages
- [ ] Go to repository Settings
- [ ] Find "Pages" section on left sidebar
- [ ] Under "Build and deployment"
- [ ] Select "Deploy from a branch"
- [ ] Select "main" branch
- [ ] Select "/ (root)" folder
- [ ] Click Save
- [ ] Wait 1-2 minutes for deployment
- [ ] Copy your GitHub Pages URL
- [ ] Visit the URL in browser

---

## Phase 4: Testing

### Sign In
- [ ] Visit your GitHub Pages URL
- [ ] Enter your email
- [ ] Click "Send link"
- [ ] Check email for magic link
- [ ] Click link in email
- [ ] Verify you're logged in
- [ ] See your email in top right

### Create Trip
- [ ] Enter trip name (e.g., "Japan 2026")
- [ ] Click "Create"
- [ ] Verify trip appears in list
- [ ] Click on trip to open

### Itinerary Tab
- [ ] Select a date
- [ ] Select a category
- [ ] Enter title, location, notes
- [ ] Click "Add item"
- [ ] Verify item appears
- [ ] Click "Edit" button
- [ ] Verify modal opens
- [ ] Make changes and save
- [ ] Verify changes appear
- [ ] Delete item and confirm

### Expenses Tab
- [ ] Click "Expenses" tab
- [ ] Enter date, category, description, amount
- [ ] Click "Add expense"
- [ ] Verify expense appears
- [ ] Verify budget summary updates
- [ ] See total and per-category breakdown

### Members Tab
- [ ] Click "Members" tab
- [ ] Verify you appear as "owner"
- [ ] See join date

### Packing Tab
- [ ] Click "Packing" tab
- [ ] Enter packing list name
- [ ] Click "Create"
- [ ] Add items
- [ ] Check items off
- [ ] Verify progress bar updates

### Settings Tab
- [ ] Click "Settings" tab
- [ ] Edit trip title
- [ ] Change currency
- [ ] Set dates
- [ ] Add description
- [ ] Click "Save settings"
- [ ] Verify "Saved" message
- [ ] Scroll down to Activity log
- [ ] Verify your actions appear

### Sharing with Friends
- [ ] Copy Trip ID (button in header)
- [ ] Copy Join Link (button in header)
- [ ] Send to friend via email
- [ ] Friend joins using link/ID
- [ ] Verify friend appears in Members tab
- [ ] Add item/expense
- [ ] Verify friend sees it in real-time

---

## Phase 5: Advanced Testing

### Real-Time Sync
- [ ] Open app in two browser tabs
- [ ] Add item in tab 1
- [ ] Verify it appears in tab 2 automatically
- [ ] Add expense in tab 2
- [ ] Verify it appears in tab 1 automatically

### Deep Linking
- [ ] Copy join link
- [ ] Open in incognito window
- [ ] Verify it auto-joins and opens trip
- [ ] Go back to trip list

### Mobile Testing
- [ ] Open on phone/tablet
- [ ] Verify responsive layout
- [ ] Bottom navigation works
- [ ] All tabs accessible
- [ ] Add/edit items works

### Multi-User Scenario
- [ ] Invite 2-3 friends
- [ ] Each add different items/expenses
- [ ] Verify all changes sync
- [ ] Verify activity log shows all actions

---

## Phase 6: Final Verification

### All Features Working
- [ ] Authentication (sign in/out)
- [ ] Trip creation
- [ ] Trip joining
- [ ] Itinerary (add/edit/delete)
- [ ] Expenses (add, summary)
- [ ] Members (view, remove)
- [ ] Packing lists (create, check off)
- [ ] Activity log (display)
- [ ] Real-time sync
- [ ] Responsive design
- [ ] Mobile navigation

### No Errors
- [ ] Browser console clean
- [ ] No 404 errors
- [ ] No authentication errors
- [ ] No database errors

### Performance
- [ ] Page loads in < 2 seconds
- [ ] Real-time updates < 1 second
- [ ] Smooth animations
- [ ] No lag when typing

---

## 🎉 You're Done!

Once all checkboxes are marked, your app is fully functional and ready to share!

### Next Steps
1. Invite friends to your trips
2. Start planning together
3. Consider enhancements from FEATURES.md
4. Share your GitHub Pages link

---

## 🆘 Troubleshooting

### Issue: "Table doesn't exist"
- [ ] SQL script didn't run properly
- [ ] Try again, copy entire script
- [ ] Check for errors at top of SQL Editor

### Issue: "Auth token invalid"
- [ ] Check SUPABASE_URL in app.js
- [ ] Check SUPABASE_ANON_KEY in app.js
- [ ] Verify copy-paste had no extra spaces

### Issue: Email not received
- [ ] Check spam folder
- [ ] Wait 1-2 minutes
- [ ] Try with different email
- [ ] Check Email provider is enabled

### Issue: Can't see real-time updates
- [ ] Refresh page (Ctrl+Shift+R for full refresh)
- [ ] Check browser console for errors
- [ ] Verify internet connection

### Issue: Members can't join with link
- [ ] Verify link includes ?join=tripId parameter
- [ ] Check trip ID is correct
- [ ] Ensure they're signed in first

---

## 📞 Support Resources

1. **Supabase Docs**: https://supabase.com/docs
2. **GitHub Pages Help**: https://docs.github.com/en/pages
3. **Browser Console**: F12 → Console for error messages

---

## 🎯 Success Criteria

✅ App loads without errors
✅ Can sign in with email
✅ Can create and join trips
✅ Can add items, expenses, packing lists
✅ Real-time sync works
✅ All tabs functional
✅ Mobile responsive
✅ Friends can collaborate

If all of these work → You're done! 🎉
