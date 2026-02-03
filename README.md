# MyTrip - Collaborative Trip Planning App

A real-time, collaborative trip planning application built with Supabase and vanilla JavaScript. Plan trips with friends, track expenses, manage itineraries, and organize packing lists all in one place.

## Features

✈️ **Trip Management**
- Create and join trips with unique IDs
- Share trip links with friends via deep linking
- Edit trip details (title, dates, currency, description)
- Real-time sync across all connected devices
- Move trip header to minimized app card for better mobile UX

📋 **Itinerary Planning**
- Add, edit, and delete activities with modal panels
- Categorize items (activity, accommodation, transport, food, etc.)
- Add dates, locations, and notes
- Drag-and-drop reordering or use arrow buttons to move items
- Swipe left to delete items (mobile-friendly)
- Visual category icons
- Edit mode to update existing items

💰 **Expense Tracking**
- Log expenses with amounts and categories
- Choose who paid for what
- Automatically split expenses equally or select specific members
- Budget summary by category and total trip budget
- Multi-currency support
- Real-time expense updates
- Shows "Paid by X for Y, Z" with split member names
- Visual indicators: Green (money owed to you), Red (you owe money)
- Edit mode to update existing expenses
- Swipe left to delete expenses

👥 **Member Management**
- Invite friends with trip join links
- Manage member roles (owner, editor, viewer)
- Remove members from trips
- See each member's balance at a glance
- Display names with nickname priority (nickname → email)
- Calculate who owes what with detailed per-member balances

🧳 **Packing Lists**
- Create multiple packing lists
- Add items to check off
- Track progress with visual progress bar
- Collaborative checklists
- Assign items to specific people

📝 **Activity Log**
- See all changes made to the trip
- Track who did what and when
- Understand trip history
- Log includes: trip creation, updates, item additions, expense tracking, member joins

⚙️ **Settings**
- Customize trip details
- Change currency
- Add trip description and notes
- Owner-only changes (protected by Supabase RLS)
- Set your display name (visible to all trip members)

## Core Functions

### Authentication & User Management
- `sendMagicLink()` - Sign in with email/password
- `signedInUI()` - Initialize UI for authenticated users with display name prompt
- `signedOutUI()` - Clean up UI for logged-out users
- `getHeaderDisplayName()` - Get user's display name for header
- `getStoredNickname()` / `setStoredNickname()` - Manage local nickname cache
- `getUserDisplayName()` - Fetch user's display name (nickname priority)
- `getUserNameWithEmail()` - Get display name or email
- `getUserEmail()` - Fetch user's email from Supabase

### Trip Management
- `loadTrips()` - Load all trips user is part of
- `createTrip()` - Create new trip with user as owner
- `openTripById()` - Open trip and show trip header in minimized appCard
- `closeTrip()` - Close trip and restore trip header to tripCard
- `fetchTrip()` - Get trip details by ID
- `fetchMyRole()` - Get current user's role in a trip
- `saveTrip Settings()` - Update trip details (owner only)
- `deleteTrip()` - Delete trip (owner only)

### Itinerary Functions
- `addItem()` - Add or save itinerary item (create/edit mode)
- `enterItemCreateMode()` - Reset form to create new item
- `enterItemEditMode()` - Load item data for editing
- `loadItems()` - Load all items for current trip
- `deleteItem()` - Delete itinerary item with confirmation
- `moveItemUp()` / `moveItemDown()` - Reorder items
- `renderItemTile()` - Create item UI with edit/swipe features
- Swipe-to-delete functionality for items

### Expense Functions
- `addExpense()` - Add or save expense (create/edit mode)
- `enterExpenseCreateMode()` - Reset form to create new expense
- `enterExpenseEditMode()` - Load expense data and splits for editing
- `loadExpenses()` - Load all expenses with splits and member names
- `deleteExpense()` - Delete expense with confirmation
- `loadPaidByOptions()` - Populate paid-by dropdown with trip members
- `renderExpenseTile()` - Create expense UI with split info and edit/swipe features
- `calculateMemberBalances()` - Calculate who owes whom with details
- `renderBudgetSummary()` - Display total and personal expense summaries
- Swipe-to-delete functionality for expenses
- Expense split tracking with equal distribution

### Member Functions
- `loadMembers()` - Load trip members with balance information
- `renderMemberTile()` - Create member UI with balance indicators
- Color coding: Green for money owed, Red for owing money

### Packing Functions
- `createPackingList()` - Create new packing list
- `loadPackingLists()` - Load all packing lists for trip
- `renderPackingList()` - Create packing list UI

### Activity Log
- `loadActivityLog()` - Load activity log for current trip
- `logActivity()` - Log actions (trip changes, expenses, items, members)

### UI Utilities
- `switchTab()` - Navigate between tabs (itinerary, expenses, members, packing, settings)
- `setMsg()` / `show()` / `hide()` - DOM manipulation helpers
- `esc()` - HTML escape for security
- `fmtCurrency()` / `fmtRange()` - Format display values
- `getCategoryIcon()` - Get emoji for category type
- `handleDeepLinks()` - Process ?join and ?trip URL parameters
- `copyTripId()` / `copyJoinLink()` - Copy share information
- `setupRealtime()` / `cleanupRealtime()` - Manage Supabase realtime subscriptions

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Realtime**: Supabase Realtime for live updates
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Deployment**: GitHub Pages (static hosting)
- **PWA Features**: Installable on mobile home screen

## UI Features

- **Responsive Design**: 150px margins on desktop, full-width on mobile
- **Dark/Light Theme**: Glassmorphic cards with backdrop blur
- **Modal Panels**: Create/Edit forms for items and expenses
- **Tab Navigation**: Organized sections for different trip aspects
- **Swipe Gestures**: Left-swipe to delete items and expenses
- **Real-time Updates**: All users see changes instantly
- **Activity Tracking**: Complete history of trip changes

## Architecture

- Single-page application (SPA) with vanilla JavaScript
- Component-based UI with DOM manipulation
- Supabase for authentication and real-time database
- Row Level Security for data privacy
- Responsive design for mobile and desktop
- Modal/panel-based editing (no separate pages)
- Create and Edit modes unified in same forms

## Usage

1. **Sign In**: Use email and password authentication
2. **Set Display Name**: New users are prompted on first login
3. **Create a Trip**: Enter trip name, dates, and currency
4. **Share**: Copy the join link or Trip ID to invite friends
5. **Plan**: Add itinerary items, expenses, and packing lists
6. **Collaborate**: See real-time updates as friends make changes
7. **Track**: View budgets, balances, and activity logs
8. **Edit**: Click "Edit" or swipe to modify any item
9. **Delete**: Swipe left or use Delete button in edit mode

## Data Management

- **Display Names**: Stored in Supabase `user_metadata.display_name`
- **Nicknames**: Cached in browser localStorage for performance
- **Email Cache**: Stored in `trip_members.email` for client-side access
- **Expense Splits**: Tracked in `expense_splits` table with share amounts
- **Real-time Sync**: All data changes broadcast to connected clients

## Performance Notes

- Real-time subscriptions update all sections automatically
- Efficient database queries with proper indexes
- Lazy loading of user data with caching
- Responsive UI with minimal re-renders
- Swipe gestures work on touch devices

## Mobile Optimization

- Add to Home Screen (iOS) with A2HS prompt
- Touch-friendly buttons and swipe controls
- Optimized spacing for small screens
- Responsive typography and layouts
- Works offline for viewing (editing requires internet)

## Known Limitations

- Trip members cannot be removed by non-owners
- Display name changes sync after logout/login
- Admin API used as fallback (may have rate limits)
- Swipe-to-delete only on touch devices
