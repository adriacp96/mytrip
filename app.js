import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://upzbngnbkkbnpfcxguer.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwemJuZ25ia2tibnBmY3hndWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMTQxNjUsImV4cCI6MjA4NTU5MDE2NX0.yieZV7iL-lS361emD4tMHuXZyss_axulIalFPnFnltk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---- helpers
const $ = (id) => document.getElementById(id);
const show = (el) => el.classList.remove("hidden");
const hide = (el) => el.classList.add("hidden");
const setMsg = (el, text, kind = "") => {
  el.textContent = text || "";
  el.className = "msg" + (kind ? ` ${kind}` : "");
};
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const shortId = (id) => String(id ?? "").split("-")[0];
const qs = () => new URLSearchParams(window.location.search);
const cleanUrl = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete("join");
  url.searchParams.delete("trip");
  history.replaceState({}, "", url.toString());
};

function fmtDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function fmtRange(start, end) {
  if (!start && !end) return "No dates set";
  if (start && !end) return `From ${fmtDate(start)}`;
  if (!start && end) return `Until ${fmtDate(end)}`;
  return `${fmtDate(start)} → ${fmtDate(end)}`;
}

function fmtCurrency(amount, currency = "AED") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

function getCategoryIcon(category) {
  const icons = {
    activity: "🎭",
    accommodation: "🏨",
    transport: "🚗",
    food: "🍽️",
    shopping: "🛍️",
    entertainment: "🎬",
    sightseeing: "📸",
    nightlife: "🍷",
    sports: "⚽",
    wellness: "🧘",
    other: "📌",
    general: "💳"
  };
  return icons[category] || "📌";
}

// ---- elements
const authCard = $("authCard");
const appCard = $("appCard");
const tripCard = $("tripCard");

const loginBtn = $("loginBtn");
const logoutBtn = $("logoutBtn");
const userBtn = $("userBtn");
const a2hsOverlay = $("a2hsOverlay");
const a2hsClose = $("a2hsClose");

const authMsg = $("authMsg");
const tripsMsg = $("tripsMsg");
const itemsMsg = $("itemsMsg");
const tripMsg = $("tripMsg");

const tripsList = $("tripsList");
const tripTitle = $("tripTitle");
const createTripBtn = $("createTripBtn");
const toggleCreateBtn = $("toggleCreateBtn");
const createPanel = $("createPanel");

const joinTripId = $("joinTripId");
const joinTripBtn = $("joinTripBtn");
const toggleJoinBtn = $("toggleJoinBtn");
const joinPanel = $("joinPanel");

const toggleAddItemBtn = $("toggleAddItemBtn");
const addItemPanel = $("addItemPanel");
const toggleAddExpenseBtn = $("toggleAddExpenseBtn");
const addExpensePanel = $("addExpensePanel");
const togglePackingBtn = $("togglePackingBtn");
const addPackingPanel = $("addPackingPanel");

const tripHeading = $("tripHeading");
const tripRange = $("tripRange");
const tripIdBadge = $("tripIdBadge");
const tripRoleBadge = $("tripRoleBadge");
const copyTripIdBtn = $("copyTripIdBtn");
const copyJoinLinkBtn = $("copyJoinLinkBtn");
const closeTripBtn = $("closeTripBtn");

// tab buttons
const tabItinerary = $("tabItinerary");
const tabExpenses = $("tabExpenses");
const tabMembers = $("tabMembers");
const tabPacking = $("tabPacking");
const tabSettings = $("tabSettings");

const tabContentItinerary = $("tabContentItinerary");
const tabContentExpenses = $("tabContentExpenses");
const tabContentMembers = $("tabContentMembers");
const tabContentPacking = $("tabContentPacking");
const tabContentSettings = $("tabContentSettings");

// itinerary
const itemDate = $("itemDate");
const itemTitle = $("itemTitle");
const itemLocation = $("itemLocation");
const itemNotes = $("itemNotes");
const itemCategory = $("itemCategory");
const addItemBtn = $("addItemBtn");
const cancelItemBtn = $("cancelItemBtn");
const deleteItemBtn = $("deleteItemBtn");
const editItemId = $("editItemId");
const itemPanelTitle = $("itemPanelTitle");
const itemsList = $("itemsList");

// expenses
const expenseDate = $("expenseDate");
const expenseTitle = $("expenseTitle");
const expenseAmount = $("expenseAmount");
const expenseCategory = $("expenseCategory");
const expenseNotes = $("expenseNotes");
const expensePaidBy = $("expensePaidBy");
const expenseSplitAll = $("expenseSplitAll");
const expenseSplitList = $("expenseSplitList");
const addExpenseBtn = $("addExpenseBtn");
const cancelExpenseBtn = $("cancelExpenseBtn");
const deleteExpenseBtn = $("deleteExpenseBtn");
const editExpenseId = $("editExpenseId");
const expensePanelTitle = $("expensePanelTitle");
const expensesList = $("expensesList");
const budgetSummary = $("budgetSummary");
const expensesMsg = $("expensesMsg");

// members
const membersList = $("membersList");
const membersMsg = $("membersMsg");

// packing
const packingListTitle = $("packingListTitle");
const createPackingListBtn = $("createPackingListBtn");
const packingListsContainer = $("packingListsContainer");
const packingMsg = $("packingMsg");

// settings
const setTitle = $("setTitle");
const setCurrency = $("setCurrency");
const setStart = $("setStart");
const setEnd = $("setEnd");
const setDescription = $("setDescription");
const saveTripBtn = $("saveTripBtn");
const deleteTripBtn = $("deleteTripBtn");
const activityLog = $("activityLog");

// ---- state
let currentUser = null;
let currentTrip = null;      // full trip row
let currentRole = null;      // owner/editor/viewer
let realtimeChannel = null;
let userCache = {};          // cache for user info
let userNameCache = {};      // cache for display name + email
let draggedItem = null;      // for drag-and-drop reordering

// ---- auth
let authMode = "signin"; // "signin" or "signup"

// ---- add to home screen (iOS)
function shouldShowA2HS() {
  const ua = window.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isStandalone = window.navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches;
  const dismissed = localStorage.getItem("a2hsDismissed") === "1";
  return isIOS && !isStandalone && !dismissed;
}

function showA2HS() {
  if (a2hsOverlay && shouldShowA2HS()) {
    a2hsOverlay.classList.remove("hidden");
  }
}

async function sendMagicLink() {
  const email = ($("email").value || "").trim();
  const password = ($("password").value || "").trim();
  
  if (!email) return setMsg(authMsg, "Enter your email.", "warn");
  if (!password) return setMsg(authMsg, "Enter your password.", "warn");

  loginBtn.disabled = true;
  setMsg(authMsg, authMode === "signin" ? "Signing in…" : "Creating account…", "warn");

  let data, error;

  if (authMode === "signin") {
    // Sign in
    const result = await supabase.auth.signInWithPassword({ email, password });
    data = result.data;
    error = result.error;
  } else {
    // Sign up
    const result = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.href.split("#")[0] },
    });
    data = result.data;
    error = result.error;
  }

  loginBtn.disabled = false;

  if (error) return setMsg(authMsg, error.message, "bad");
  if (data?.user) {
    setMsg(authMsg, "Welcome!", "ok");
  }
}

async function logOut() {
  await supabase.auth.signOut();
}

function signedOutUI() {
  currentUser = null;
  currentTrip = null;
  currentRole = null;
  cleanupRealtime();

  show(authCard);
  hide(appCard);
  hide(tripCard);
  hide(logoutBtn);
  hide(refreshBtn);
  hide(userBtn);
  
  document.querySelector(".topbar").classList.add("hidden");

  setMsg(authMsg, "", "");
  setMsg(tripsMsg, "", "");
  setMsg(itemsMsg, "", "");
  setMsg(tripMsg, "", "");

  tripsList.innerHTML = "";
  itemsList.innerHTML = "";
}

function getStoredNickname(userId) {
  if (!userId) return "";
  return localStorage.getItem(`nickname:${userId}`) || "";
}

function setStoredNickname(userId, nickname) {
  if (!userId) return;
  if (!nickname) {
    localStorage.removeItem(`nickname:${userId}`);
  } else {
    localStorage.setItem(`nickname:${userId}`, nickname);
  }
}

function getCurrentDisplayName() {
  if (!currentUser) return "";
  const displayName = currentUser.user_metadata?.display_name || getStoredNickname(currentUser.id);
  return formatNameWithEmail(displayName, currentUser.email);
}

function getHeaderDisplayName() {
  if (!currentUser) return "";
  const displayName = currentUser.user_metadata?.display_name || getStoredNickname(currentUser.id);
  return displayName || currentUser.email || "";
}

function formatNameWithEmail(displayName, email) {
  if (displayName && email && displayName !== email) return `${displayName} (${email})`;
  return displayName || email || "";
}

async function signedInUI(user) {
  currentUser = user;

  hide(authCard);
  show(appCard);
  show(logoutBtn);
  show(refreshBtn);
  show(userBtn);
  document.querySelector(".topbar").classList.remove("hidden");
  
  // Sync user_metadata.display_name to localStorage as nickname
  const metaDisplayName = currentUser.user_metadata?.display_name || "";
  if (metaDisplayName) {
    setStoredNickname(currentUser.id, metaDisplayName);
  }
  
  userBtn.textContent = getHeaderDisplayName();
  userBtn.style.cursor = "pointer";
  userBtn.title = "Click to set display name";

  // If new user (no display name yet), prompt them to set one
  if (!metaDisplayName && !getStoredNickname(currentUser.id)) {
    setTimeout(() => {
      const nickname = prompt("Welcome! Set your display name (or leave blank to use email):", currentUser.email || "");
      if (nickname !== null && nickname.trim()) {
        const trimmed = nickname.trim();
        supabase.auth.updateUser({
          data: { display_name: trimmed },
        }).then(({ data, error }) => {
          if (!error && data?.user) {
            currentUser = data.user;
            setStoredNickname(currentUser.id, trimmed);
            userBtn.textContent = getHeaderDisplayName();
          }
        });
      }
    }, 500);
  }

  await handleDeepLinks();
  await loadTrips();
}

// ---- deep links: ?join=TRIP_ID or ?trip=TRIP_ID
async function handleDeepLinks() {
  const params = qs();
  const join = params.get("join");
  const trip = params.get("trip");

  if (join) {
    setMsg(tripsMsg, "Joining from link…", "warn");
    const { error } = await insertTripMember({
      trip_id: join,
      user_id: currentUser.id,
      role: "editor",
      email: currentUser.email,
      display_name: currentUser.user_metadata?.display_name || getStoredNickname(currentUser.id) || null,
    });
    if (!error) {
      const t = await fetchTrip(join);
      if (t) await openTripById(t.id);
    }
    cleanUrl();
    return;
  }

  if (trip) {
    const t = await fetchTrip(trip);
    if (t) await openTripById(t.id);
    cleanUrl();
  }
}

async function fetchTrip(tripId) {
  const { data, error } = await supabase
    .from("trips")
    .select("id,title,start_date,end_date,description,currency,created_at,owner_id")
    .eq("id", tripId)
    .limit(1);

  if (error) return null;
  return data?.[0] || null;
}

async function fetchMyRole(tripId) {
  const { data, error } = await supabase
    .from("trip_members")
    .select("role")
    .eq("trip_id", tripId)
    .eq("user_id", currentUser.id)
    .limit(1);

  if (error) return null;
  return data?.[0]?.role || null;
}

async function getUserEmail(userId) {
  if (userCache[userId]) return userCache[userId];
  // Try to fetch from admin API, but don't fail if unavailable
  try {
    const { data } = await supabase.auth.admin?.getUserById?.(userId);
    const email = data?.user?.email || "";
    userCache[userId] = email;
    return email;
  } catch (e) {
    return "";
  }
}

async function getUserDisplayName(userId) {
  // First check localStorage nickname
  const storedNickname = getStoredNickname(userId);
  if (storedNickname) return storedNickname;
  
  // Try to fetch from admin API
  try {
    const { data } = await supabase.auth.admin?.getUserById?.(userId);
    const displayName = data?.user?.user_metadata?.display_name;
    if (displayName) return displayName;
    const email = data?.user?.email;
    if (email) return email;
  } catch (e) {
    // Silent fail
  }
  return "";
}

async function getUserNameWithEmail(userId) {
  if (userNameCache[userId]) return userNameCache[userId];
  
  // First check localStorage nickname
  const storedNickname = getStoredNickname(userId);
  if (storedNickname) {
    userNameCache[userId] = storedNickname;
    return storedNickname;
  }
  
  // Try to fetch from admin API
  let email = "";
  let displayName = "";
  try {
    const { data } = await supabase.auth.admin?.getUserById?.(userId);
    email = data?.user?.email || "";
    displayName = data?.user?.user_metadata?.display_name || "";
  } catch (e) {
    // Silent fail
  }
  
  const result = displayName || email || "";
  userNameCache[userId] = result;
  return result;
}

// Helper to insert trip member, excluding display_name to avoid recursion
async function insertTripMember(memberData) {
  // Remove display_name to avoid RLS recursion issues
  const { display_name, ...memberDataWithoutDisplayName } = memberData;
  return await supabase.from("trip_members").insert(memberDataWithoutDisplayName);
}

// ---- trips
async function loadTrips() {
  setMsg(tripsMsg, "Loading trips…", "warn");
  tripsList.innerHTML = "";

  // First, get trip memberships (avoids RLS recursion with joins)
  const { data: memberships, error: membersError } = await supabase
    .from("trip_members")
    .select("trip_id, role")
    .eq("user_id", currentUser.id);

  if (membersError) return setMsg(tripsMsg, membersError.message, "bad");
  
  if (!memberships || memberships.length === 0) {
    setMsg(tripsMsg, "No trips yet. Create one or join with a Trip ID.", "warn");
    return;
  }

  // Get trip IDs and create role map
  const tripIds = memberships.map(m => m.trip_id);
  const roleMap = {};
  memberships.forEach(m => roleMap[m.trip_id] = m.role);

  // Now fetch trip details separately (bypasses RLS recursion)
  const { data: tripData, error: tripsError } = await supabase
    .from("trips")
    .select("id,title,start_date,end_date,description,currency,created_at,owner_id")
    .in("id", tripIds);

  if (tripsError) return setMsg(tripsMsg, tripsError.message, "bad");

  const trips = (tripData || [])
    .map((trip) => ({ ...trip, my_role: roleMap[trip.id] }))
    .filter(Boolean);

  if (!trips.length) {
    setMsg(tripsMsg, "No trips yet. Create one or join with a Trip ID.", "warn");
    return;
  }
  
  setMsg(tripsMsg, "", "");

  // Sort chronologically: upcoming trips first, then past trips
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = trips.filter((t) => t.start_date && new Date(t.start_date) >= today);
  const past = trips.filter((t) => !t.start_date || new Date(t.start_date) < today);

  // Sort upcoming by start_date ascending, past by start_date descending
  upcoming.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  past.sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0));

  // Render upcoming first, then past
  for (const t of [...upcoming, ...past]) {
    tripsList.appendChild(renderTripTile(t));
  }
}

function getCountdown(startDate) {
  if (!startDate) return "No date";
  const now = new Date();
  const start = new Date(startDate);
  const diffTime = start - now;
  
  if (diffTime <= 0) return "Started";
  
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return `In ${days} day${days !== 1 ? 's' : ''}`;
}

function renderTripTile(t) {
  const el = document.createElement("div");
  el.className = "tile";
  
  // Fetch total expenses for this trip
  supabase
    .from("expenses")
    .select("amount")
    .eq("trip_id", t.id)
    .then(({ data, error }) => {
      const total = data?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0;
      const totalDisplay = total > 0 ? `${fmtCurrency(total, t.currency)}` : "No expenses";
      const currencyPill = el.querySelector(".currency-pill");
      if (currencyPill) {
        currencyPill.textContent = totalDisplay;
      }
    });
  
  el.innerHTML = `
    <div class="tileTop">
      <div>
        <div class="tileTitle">${esc(t.title)}</div>
        <div class="tileMeta">${esc(fmtRange(t.start_date, t.end_date))}</div>
        <div class="tileMeta">Trip ID: ${esc(t.id)}</div>
      </div>
    </div>
    <div class="pills">
      <span class="pill countdown-pill">${getCountdown(t.start_date)}</span>
      <span class="pill currency-pill">Loading…</span>
      ${t.description ? `<span class="pill">Has notes</span>` : `<span class="pill">No notes</span>`}
    </div>
  `;
  
  // Update countdown every second
  const countdownInterval = setInterval(() => {
    const countdownPill = el.querySelector(".countdown-pill");
    if (countdownPill && el.parentElement) {
      countdownPill.textContent = getCountdown(t.start_date);
    } else {
      clearInterval(countdownInterval);
    }
  }, 1000);
  
  el.addEventListener("click", () => openTripById(t.id));
  return el;
}

async function createTrip() {
  const title = (tripTitle.value || "").trim();
  if (!title) return setMsg(tripsMsg, "Trip title required.", "warn");

  createTripBtn.disabled = true;
  setMsg(tripsMsg, "Creating…", "warn");

  const { data: tripRows, error: tripErr } = await supabase
    .from("trips")
    .insert({ owner_id: currentUser.id, title, currency: "AED" })
    .select("id")
    .limit(1);

  if (tripErr) {
    createTripBtn.disabled = false;
    return setMsg(tripsMsg, tripErr.message, "bad");
  }

  const tripId = tripRows?.[0]?.id;

  const { error: memErr } = await insertTripMember({
    trip_id: tripId,
    user_id: currentUser.id,
    role: "owner",
    email: currentUser.email,
    display_name: currentUser.user_metadata?.display_name || getStoredNickname(currentUser.id) || null,
  });

  createTripBtn.disabled = false;

  if (memErr) return setMsg(tripsMsg, memErr.message, "bad");

  tripTitle.value = "";
  setMsg(tripsMsg, "Trip created. Opening…", "ok");
  
  await logActivity(tripId, "created_trip", { title });
  await loadTrips();
  await openTripById(tripId);
}

async function joinTrip() {
  const tripId = (joinTripId.value || "").trim();
  if (!tripId) return setMsg(tripsMsg, "Enter a Trip ID.", "warn");

  joinTripBtn.disabled = true;
  setMsg(tripsMsg, "Joining…", "warn");

  const { error } = await insertTripMember({
    trip_id: tripId,
    user_id: currentUser.id,
    role: "editor",
    email: currentUser.email,
    display_name: currentUser.user_metadata?.display_name || getStoredNickname(currentUser.id) || null,
  });

  joinTripBtn.disabled = false;

  if (error) return setMsg(tripsMsg, error.message, "bad");

  joinTripId.value = "";
  setMsg(tripsMsg, "Joined. Opening…", "ok");
  
  await logActivity(tripId, "joined_trip", {});
  await loadTrips();
  await openTripById(tripId);
}

// ---- trip open + settings load
async function openTripById(tripId) {
  const t = await fetchTrip(tripId);
  if (!t) return setMsg(tripsMsg, "Trip not found or you don't have access.", "bad");

  currentTrip = t;
  currentRole = await fetchMyRole(tripId);

  tripHeading.textContent = currentTrip.title || "Trip";
  tripRange.textContent = fmtRange(currentTrip.start_date, currentTrip.end_date);
  document.getElementById("tripIdText").textContent = `Trip ID: ${currentTrip.id}`;

  // fill settings
  setTitle.value = currentTrip.title || "";
  setCurrency.value = currentTrip.currency || "AED";
  setStart.value = currentTrip.start_date || "";
  setEnd.value = currentTrip.end_date || "";
  setDescription.value = currentTrip.description || "";

  // owner-only save
  const isOwner = currentRole === "owner";
  saveTripBtn.disabled = !isOwner;
  if (!isOwner) setMsg(tripMsg, "Only the owner can edit trip settings.", "warn");
  else setMsg(tripMsg, "", "");

  // Move tripHeader to appCard header when minimizing
  const tripHeader = document.querySelector('.tripHeader');
  const appCardHeader = document.getElementById('appCardHeader');
  if (tripHeader && appCardHeader) {
    appCardHeader.innerHTML = '';
    appCardHeader.appendChild(tripHeader);
  }

  show(tripCard);
  appCard.classList.add("minimized");
  // switch to itinerary tab by default
  switchTab("itinerary");

  await loadItems();
  await loadExpenses();
  await loadMembers();
  await loadPackingLists();
  await loadActivityLog();
  await loadPaidByOptions();
  setupRealtime();
}

function closeTrip() {
  currentTrip = null;
  currentRole = null;
  cleanupRealtime();

  // Move tripHeader back to tripCard
  const tripHeader = document.querySelector('.tripHeader');
  const appCardHeader = document.getElementById('appCardHeader');
  if (tripHeader && appCardHeader) {
    // Restore default appCard header
    appCardHeader.innerHTML = `
      <div>
        <h2>Your trips</h2>
        <p class="muted">Create a trip or join with a Trip ID.</p>
      </div>
    `;
    // Move tripHeader back to the top of tripCard
    tripCard.insertBefore(tripHeader, tripCard.firstChild);
  }

  hide(tripCard);
  appCard.classList.remove("minimized");
  itemsList.innerHTML = "";
  setMsg(itemsMsg, "", "");
  setMsg(tripMsg, "", "");
}

// ---- tab navigation
function switchTab(tabName) {
  const tabs = [
    { btn: tabItinerary, content: tabContentItinerary, name: "itinerary" },
    { btn: tabExpenses, content: tabContentExpenses, name: "expenses" },
    { btn: tabMembers, content: tabContentMembers, name: "members" },
    { btn: tabPacking, content: tabContentPacking, name: "packing" },
    { btn: tabSettings, content: tabContentSettings, name: "settings" },
  ];

  tabs.forEach((tab) => {
    if (tab.name === tabName) {
      tab.btn.classList.add("tabActive");
      show(tab.content);
    } else {
      tab.btn.classList.remove("tabActive");
      hide(tab.content);
    }
  });
}

// ---- trip settings
async function saveTripSettings() {
  if (!currentTrip?.id) return;
  if (currentRole !== "owner") return setMsg(tripMsg, "Only owner can save.", "warn");

  const title = (setTitle.value || "").trim();
  const currency = (setCurrency.value || "AED").trim();
  const start_date = setStart.value || null;
  const end_date = setEnd.value || null;
  const description = (setDescription.value || "").trim() || null;

  if (!title) return setMsg(tripMsg, "Title required.", "warn");

  saveTripBtn.disabled = true;
  setMsg(tripMsg, "Saving…", "warn");

  const { error } = await supabase
    .from("trips")
    .update({ title, currency, start_date, end_date, description })
    .eq("id", currentTrip.id);

  saveTripBtn.disabled = false;

  if (error) return setMsg(tripMsg, error.message, "bad");

  setMsg(tripMsg, "Saved.", "ok");
  await logActivity(currentTrip.id, "updated_trip", { title });
  await loadTrips();
  await openTripById(currentTrip.id);
}

async function deleteTrip() {
  if (!currentTrip?.id) return;
  if (currentRole !== "owner") return setMsg(tripMsg, "Only owner can delete trips.", "warn");

  const ok = confirm("Delete this trip and all its data? This cannot be undone.");
  if (!ok) return;

  deleteTripBtn.disabled = true;
  setMsg(tripMsg, "Deleting…", "warn");

  const { error } = await supabase
    .from("trips")
    .delete()
    .eq("id", currentTrip.id)
    .eq("owner_id", currentUser.id);

  deleteTripBtn.disabled = false;

  if (error) return setMsg(tripMsg, error.message, "bad");

  setMsg(tripMsg, "Trip deleted.", "ok");
  closeTrip();
  await loadTrips();
}

async function copyTripId() {
  if (!currentTrip?.id) return;
  await navigator.clipboard.writeText(currentTrip.id);
  setMsg(itemsMsg, "Trip ID copied.", "ok");
}

async function copyJoinLink() {
  if (!currentTrip?.id) return;
  const url = new URL(window.location.href);
  url.searchParams.set("join", currentTrip.id);
  await navigator.clipboard.writeText(url.toString());
  setMsg(itemsMsg, "Join link copied. Send it to your friends.", "ok");
}

// ---- itinerary
function enterItemCreateMode() {
  editItemId.value = "";
  itemPanelTitle.textContent = "Add itinerary item";
  addItemBtn.textContent = "Add item";
  addItemBtn.classList.remove("hidden");
  cancelItemBtn.classList.add("hidden");
  deleteItemBtn.classList.add("hidden");
  
  itemDate.value = "";
  itemTitle.value = "";
  itemLocation.value = "";
  itemNotes.value = "";
  itemCategory.value = "activity";
  
  addItemPanel.classList.toggle("hidden");
}

async function enterItemEditMode(itemId) {
  if (!itemId || !currentTrip) return;
  
  const { data, error } = await supabase
    .from("itinerary_items")
    .select("*")
    .eq("id", itemId)
    .single();
  
  if (error || !data) return setMsg(itemsMsg, "Could not load item.", "bad");
  
  editItemId.value = itemId;
  itemPanelTitle.textContent = "Edit itinerary item";
  addItemBtn.textContent = "Save";
  addItemBtn.classList.remove("hidden");
  cancelItemBtn.classList.remove("hidden");
  deleteItemBtn.classList.remove("hidden");
  
  itemDate.value = data.day_date || "";
  itemTitle.value = data.title || "";
  itemLocation.value = data.location || "";
  itemNotes.value = data.notes || "";
  itemCategory.value = data.category || "activity";
  
  addItemPanel.classList.remove("hidden");
  addItemPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function addItem() {
  if (!currentTrip) return setMsg(itemsMsg, "No trip selected.", "warn");

  const day_date = itemDate.value || null;
  const title = (itemTitle.value || "").trim();
  const location = (itemLocation.value || "").trim() || null;
  const notes = (itemNotes.value || "").trim() || null;
  const category = (itemCategory.value || "activity").trim();

  if (!title) return setMsg(itemsMsg, "Title required.", "warn");

  addItemBtn.disabled = true;
  
  const isEditMode = !!editItemId.value;
  
  if (isEditMode) {
    // UPDATE existing item
    setMsg(itemsMsg, "Updating…", "warn");
    
    const { error } = await supabase
      .from("itinerary_items")
      .update({
        day_date,
        title,
        location,
        notes,
        category,
        updated_by: currentUser.id,
      })
      .eq("id", editItemId.value);
    
    addItemBtn.disabled = false;
    
    if (error) return setMsg(itemsMsg, error.message, "bad");
    
    setMsg(itemsMsg, "Updated.", "ok");
    await logActivity(currentTrip.id, "updated_item", { title, category });
    addItemPanel.classList.add("hidden");
    enterItemCreateMode();
  } else {
    // INSERT new item
    setMsg(itemsMsg, "Adding…", "warn");

    // Get the next order_seq for this date
    const { data: existingItems } = await supabase
      .from("itinerary_items")
      .select("order_seq")
      .eq("trip_id", currentTrip.id)
      .eq("day_date", day_date);

    const nextOrder = (existingItems?.length || 0);

    const { error } = await supabase.from("itinerary_items").insert({
      trip_id: currentTrip.id,
      day_date,
      title,
      location,
      notes,
      category,
      order_seq: nextOrder,
      updated_by: currentUser.id,
    });

    addItemBtn.disabled = false;

    if (error) return setMsg(itemsMsg, error.message, "bad");

    setMsg(itemsMsg, "Added.", "ok");
    await logActivity(currentTrip.id, "added_item", { title, category });
    addItemPanel.classList.add("hidden");
    enterItemCreateMode();
  }
  
  await loadItems();
}

async function loadItems() {
  if (!currentTrip) return;

  setMsg(itemsMsg, "Loading itinerary…", "warn");
  itemsList.innerHTML = "";

  const { data, error } = await supabase
    .from("itinerary_items")
    .select("id,day_date,title,location,notes,category,order_seq,updated_at")
    .eq("trip_id", currentTrip.id)
    .order("day_date", { ascending: true })
    .order("order_seq", { ascending: true });

  if (error) return setMsg(itemsMsg, error.message, "bad");

  if (!data?.length) setMsg(itemsMsg, "No items yet. Add one.", "warn");
  else setMsg(itemsMsg, "", "");

  for (let i = 0; i < data.length; i++) {
    itemsList.appendChild(renderItemTile(data[i], i, data.length));
  }
}

function renderItemTile(it, index, total) {
  const el = document.createElement("div");
  el.className = "tile swipeable";
  el.dataset.itemId = it.id;
  el.draggable = true;
  el.style.position = "relative";

  const date = it.day_date ? esc(it.day_date) : "No date";
  const loc = it.location ? esc(it.location) : "No location";
  const updated = it.updated_at ? new Date(it.updated_at).toLocaleString() : "";
  const icon = getCategoryIcon(it.category);
  
  const canMoveUp = index > 0;
  const canMoveDown = index < total - 1;

  el.innerHTML = `
    <button class="btn ghost small" data-action="edit" data-item-id="${esc(it.id)}" type="button" style="position: absolute; top: 8px; right: 8px; padding: 4px 8px; font-size: 14px; line-height: 1;">Edit</button>
    <div class="tileTop">
      <div>
        <div class="tileTitle">${icon} ${esc(it.title)}</div>
        <div class="tileMeta">${date} · ${loc}</div>
      </div>
    </div>
    ${it.notes ? `<div class="tileMeta" style="margin-top:10px;">${esc(it.notes)}</div>` : ""}
    ${(canMoveUp || canMoveDown) ? `<div class="pills">
      ${canMoveUp ? `<button class="btn ghost small" data-action="moveup" data-item-id="${esc(it.id)}" type="button">↑ Up</button>` : ""}
      ${canMoveDown ? `<button class="btn ghost small" data-action="movedown" data-item-id="${esc(it.id)}" type="button">Down ↓</button>` : ""}
    </div>` : ""}
  `;

  // Drag and drop handlers
  el.addEventListener("dragstart", (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", el.innerHTML);
    el.style.opacity = "0.5";
    draggedItem = it.id;
  });

  el.addEventListener("dragend", (e) => {
    el.style.opacity = "1";
  });

  el.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (e.target.closest(".tile") && e.target.closest(".tile") !== el) {
      el.style.borderTop = "2px solid #68b3d7";
    }
  });

  el.addEventListener("dragleave", (e) => {
    el.style.borderTop = "none";
  });

  el.addEventListener("drop", async (e) => {
    e.preventDefault();
    el.style.borderTop = "none";
    if (draggedItem && draggedItem !== it.id) {
      await reorderItems(draggedItem, it.id);
    }
  });

  return el;
}

async function reorderItems(draggedId, targetId) {
  if (!currentTrip) return;

  // Fetch all items for the trip
  const { data: allItems, error: fetchError } = await supabase
    .from("itinerary_items")
    .select("id,order_seq,day_date")
    .eq("trip_id", currentTrip.id)
    .order("day_date", { ascending: true })
    .order("order_seq", { ascending: true });

  if (fetchError) {
    setMsg(itemsMsg, fetchError.message, "bad");
    return;
  }

  // Find indices
  const draggedIdx = allItems.findIndex((x) => x.id === draggedId);
  const targetIdx = allItems.findIndex((x) => x.id === targetId);

  if (draggedIdx === -1 || targetIdx === -1) return;

  // Swap in the array
  [allItems[draggedIdx], allItems[targetIdx]] = [allItems[targetIdx], allItems[draggedIdx]];

  // Update all items with new order_seq
  const updates = allItems.map((item, idx) => ({
    id: item.id,
    order_seq: idx,
  }));

  // Batch update
  for (const update of updates) {
    const { error } = await supabase
      .from("itinerary_items")
      .update({ order_seq: update.order_seq })
      .eq("id", update.id);

    if (error) {
      setMsg(itemsMsg, error.message, "bad");
      return;
    }
  }

  // Reload the list
  await loadItems();
}

async function moveItemUp(itemId) {
  if (!currentTrip) return;

  // Fetch all items for the trip
  const { data: allItems, error: fetchError } = await supabase
    .from("itinerary_items")
    .select("id,order_seq,day_date")
    .eq("trip_id", currentTrip.id)
    .order("day_date", { ascending: true })
    .order("order_seq", { ascending: true });

  if (fetchError || !allItems) return;

  const idx = allItems.findIndex((x) => x.id === itemId);
  if (idx <= 0) return; // Already first

  const currentItem = allItems[idx];
  const prevItem = allItems[idx - 1];

  // Only swap if they have the same date
  if (currentItem.day_date !== prevItem.day_date) return;

  // Swap order_seq values
  const tempSeq = currentItem.order_seq;
  await supabase
    .from("itinerary_items")
    .update({ order_seq: prevItem.order_seq })
    .eq("id", currentItem.id);

  await supabase
    .from("itinerary_items")
    .update({ order_seq: tempSeq })
    .eq("id", prevItem.id);

  await loadItems();
}

async function moveItemDown(itemId) {
  if (!currentTrip) return;

  // Fetch all items for the trip
  const { data: allItems, error: fetchError } = await supabase
    .from("itinerary_items")
    .select("id,order_seq,day_date")
    .eq("trip_id", currentTrip.id)
    .order("day_date", { ascending: true })
    .order("order_seq", { ascending: true });

  if (fetchError || !allItems) return;

  const idx = allItems.findIndex((x) => x.id === itemId);
  if (idx >= allItems.length - 1) return; // Already last

  const currentItem = allItems[idx];
  const nextItem = allItems[idx + 1];

  // Only swap if they have the same date
  if (currentItem.day_date !== nextItem.day_date) return;

  // Swap order_seq values
  const tempSeq = currentItem.order_seq;
  await supabase
    .from("itinerary_items")
    .update({ order_seq: nextItem.order_seq })
    .eq("id", currentItem.id);

  await supabase
    .from("itinerary_items")
    .update({ order_seq: tempSeq })
    .eq("id", nextItem.id);

  await loadItems();
}

async function deleteItem(itemId) {
  if (!itemId) return;

  const ok = confirm("Delete this item? This cannot be undone.");
  if (!ok) return;

  deleteItemBtn.disabled = true;
  setMsg(itemsMsg, "Deleting…", "warn");

  const { error } = await supabase.from("itinerary_items").delete().eq("id", itemId);

  deleteItemBtn.disabled = false;

  if (error) {
    setMsg(itemsMsg, error.message, "bad");
    return;
  }

  setMsg(itemsMsg, "Item deleted.", "ok");
  await logActivity(currentTrip.id, "deleted_item", { id: itemId });
  addItemPanel.classList.add("hidden");
  enterItemCreateMode();
  await loadItems();
}

// ---- expenses
function enterExpenseCreateMode() {
  editExpenseId.value = "";
  expensePanelTitle.textContent = "Add expense";
  addExpenseBtn.textContent = "Add expense";
  addExpenseBtn.classList.remove("hidden");
  cancelExpenseBtn.classList.add("hidden");
  deleteExpenseBtn.classList.add("hidden");
  
  expenseDate.value = "";
  expenseTitle.value = "";
  expenseAmount.value = "";
  expenseNotes.value = "";
  expenseCategory.value = "general";
  expensePaidBy.value = currentUser.id;
  if (expenseSplitAll) expenseSplitAll.checked = true;
  
  addExpensePanel.classList.toggle("hidden");
}

async function enterExpenseEditMode(expenseId) {
  if (!expenseId || !currentTrip) return;
  
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("id", expenseId)
    .single();
  
  if (error || !data) return setMsg(expensesMsg, "Could not load expense.", "bad");
  
  editExpenseId.value = expenseId;
  expensePanelTitle.textContent = "Edit expense";
  addExpenseBtn.textContent = "Save";
  addExpenseBtn.classList.remove("hidden");
  cancelExpenseBtn.classList.remove("hidden");
  deleteExpenseBtn.classList.remove("hidden");
  
  expenseDate.value = data.expense_date || "";
  expenseTitle.value = data.title || "";
  expenseAmount.value = data.amount || "";
  expenseNotes.value = data.notes || "";
  expenseCategory.value = data.category || "general";
  expensePaidBy.value = data.paid_by || currentUser.id;
  
  // Load split info
  const { data: splits } = await supabase
    .from("expense_splits")
    .select("user_id")
    .eq("expense_id", expenseId);
  
  if (splits && expenseSplitList) {
    const splitUserIds = splits.map(s => s.user_id);
    const checkboxes = expenseSplitList.querySelectorAll("input[data-user-id]");
    const allChecked = checkboxes.length === splitUserIds.length;
    
    if (expenseSplitAll) expenseSplitAll.checked = allChecked;
    if (!allChecked && expenseSplitList) expenseSplitList.classList.remove("disabled");
    
    checkboxes.forEach(cb => {
      cb.checked = splitUserIds.includes(cb.dataset.userId);
    });
  }
  
  addExpensePanel.classList.remove("hidden");
  addExpensePanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function addExpense() {
  if (!currentTrip) return setMsg(expensesMsg, "No trip selected.", "warn");

  const title = (expenseTitle.value || "").trim();
  const amount = parseFloat(expenseAmount.value) || 0;
  const expense_date = expenseDate.value || null;
  const category = (expenseCategory.value || "general").trim();
  const notes = (expenseNotes.value || "").trim() || null;
  const paid_by = expensePaidBy.value || currentUser.id;

  if (!title) return setMsg(expensesMsg, "Description required.", "warn");
  if (amount <= 0) return setMsg(expensesMsg, "Amount must be greater than 0.", "warn");

  addExpenseBtn.disabled = true;
  
  const isEditMode = !!editExpenseId.value;
  let expenseIdToUse = isEditMode ? editExpenseId.value : null;

  if (isEditMode) {
    // UPDATE existing expense
    setMsg(expensesMsg, "Updating…", "warn");
    
    // First, delete existing splits to avoid constraint violations
    const { error: deleteError } = await supabase
      .from("expense_splits")
      .delete()
      .eq("expense_id", expenseIdToUse);
    
    if (deleteError) {
      addExpenseBtn.disabled = false;
      return setMsg(expensesMsg, "Failed to update splits: " + deleteError.message, "bad");
    }
    
    // Then update the expense
    const { error } = await supabase
      .from("expenses")
      .update({
        title,
        amount,
        expense_date,
        category,
        notes,
        currency: currentTrip.currency || "AED",
        paid_by,
      })
      .eq("id", expenseIdToUse);
    
    if (error) {
      addExpenseBtn.disabled = false;
      return setMsg(expensesMsg, error.message, "bad");
    }
  } else {
    // INSERT new expense
    setMsg(expensesMsg, "Adding…", "warn");
    
    const { data: newExpense, error } = await supabase
      .from("expenses")
      .insert({
        trip_id: currentTrip.id,
        title,
        amount,
        expense_date,
        category,
        notes,
        currency: currentTrip.currency || "AED",
        paid_by,
      })
      .select("id")
      .single();
    
    if (error) {
      addExpenseBtn.disabled = false;
      return setMsg(expensesMsg, error.message, "bad");
    }
    
    expenseIdToUse = newExpense.id;
  }

  // Split equally among selected members
  let selectedUsers = [];
  if (expenseSplitAll?.checked) {
    selectedUsers = Array.from(expenseSplitList?.querySelectorAll("input[data-user-id]") || []).map(
      (cb) => cb.dataset.userId
    );
  } else {
    selectedUsers = Array.from(expenseSplitList?.querySelectorAll("input[data-user-id]") || [])
      .filter((cb) => cb.checked)
      .map((cb) => cb.dataset.userId);
  }

  if (!selectedUsers.length) {
    addExpenseBtn.disabled = false;
    setMsg(expensesMsg, "Select at least one member to split.", "warn");
    return;
  }

  const share = parseFloat((amount / selectedUsers.length).toFixed(2));
  const splits = selectedUsers.map((userId) => ({
    expense_id: expenseIdToUse,
    user_id: userId,
    share_amount: share,
  }));

  const { error: splitError } = await supabase.from("expense_splits").insert(splits);
  
  addExpenseBtn.disabled = false;
  
  if (splitError) return setMsg(expensesMsg, splitError.message, "bad");

  setMsg(expensesMsg, isEditMode ? "Updated." : "Expense added.", "ok");
  await logActivity(currentTrip.id, isEditMode ? "updated_expense" : "added_expense", { title, amount });
  addExpensePanel.classList.add("hidden");
  enterExpenseCreateMode();
  await loadExpenses();
}

async function loadPaidByOptions() {
  if (!currentTrip) return;

  const { data, error } = await supabase
    .from("trip_members")
    .select("user_id,email")
    .eq("trip_id", currentTrip.id);

  if (error || !data) {
    expensePaidBy.innerHTML = '<option value="">Error loading members</option>';
    console.error('Error loading members:', error);
    return;
  }

  expensePaidBy.innerHTML = "";
  if (expenseSplitList) expenseSplitList.innerHTML = "";
  
  for (const member of data) {
    const option = document.createElement("option");
    option.value = member.user_id;
    
    // Get display name for this member
    if (member.user_id === currentUser.id) {
      const displayName = getHeaderDisplayName();
      option.textContent = displayName + " (You)";
    } else {
      const displayName = getStoredNickname(member.user_id) || member.email;
      option.textContent = displayName || "";
    }
    
    expensePaidBy.appendChild(option);

    if (expenseSplitList) {
      const label = document.createElement("label");
      label.className = "splitOption";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = true;
      cb.dataset.userId = member.user_id;

      const nameSpan = document.createElement("span");
      nameSpan.textContent = option.textContent;

      label.appendChild(cb);
      label.appendChild(nameSpan);
      expenseSplitList.appendChild(label);
    }
  }

  // Set current user as default
  expensePaidBy.value = currentUser.id;

  if (expenseSplitAll && expenseSplitList) {
    expenseSplitAll.checked = true;
    expenseSplitList.classList.add("disabled");
  }
}

async function loadExpenses() {
  if (!currentTrip) return;

  setMsg(expensesMsg, "Loading expenses…", "warn");
  expensesList.innerHTML = "";
  budgetSummary.innerHTML = "";

  const { data, error } = await supabase
    .from("expenses")
    .select("id,title,amount,expense_date,category,paid_by,currency")
    .eq("trip_id", currentTrip.id)
    .order("expense_date", { ascending: false });

  if (error) return setMsg(expensesMsg, error.message, "bad");

  if (!data?.length) {
    setMsg(expensesMsg, "No expenses yet.", "warn");
    budgetSummary.innerHTML = renderBudgetSummary([], currentTrip.currency);
    return;
  }

  setMsg(expensesMsg, "", "");

  // Load current user's share per expense (if split data exists)
  const { data: mySplits } = await supabase
    .from("expense_splits")
    .select("expense_id, share_amount, expenses!inner(trip_id)")
    .eq("user_id", currentUser.id)
    .eq("expenses.trip_id", currentTrip.id);

  const myShareMap = {};
  (mySplits || []).forEach((s) => {
    if (!myShareMap[s.expense_id]) myShareMap[s.expense_id] = 0;
    myShareMap[s.expense_id] += s.share_amount || 0;
  });

  // Load all splits to show who each expense is split between
  const { data: allSplits } = await supabase
    .from("expense_splits")
    .select("expense_id, user_id")
    .in("expense_id", data.map(e => e.id));

  const splitMap = {};
  (allSplits || []).forEach((s) => {
    if (!splitMap[s.expense_id]) splitMap[s.expense_id] = [];
    splitMap[s.expense_id].push(s.user_id);
  });

  // Render budget summary
  budgetSummary.innerHTML = renderBudgetSummary(data, currentTrip.currency, myShareMap);

  // Render expense tiles with display names and split info
  const { data: allMembers } = await supabase
    .from("trip_members")
    .select("user_id, email")
    .eq("trip_id", currentTrip.id);

  const memberMap = {};
  (allMembers || []).forEach((m) => {
    memberMap[m.user_id] = getStoredNickname(m.user_id) || m.email || "";
  });

  for (const exp of data) {
    const paidByName = await getUserNameWithEmail(exp.paid_by);
    const myShare = myShareMap[exp.id];
    const splitUserIds = splitMap[exp.id] || [];
    expensesList.appendChild(renderExpenseTile(exp, paidByName, myShare, splitUserIds, memberMap));
  }
}

function renderBudgetSummary(expenses, currency, myShareMap = {}) {
  const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const myTotal = expenses.reduce((sum, e) => {
    if (myShareMap[e.id] !== undefined) return sum + (myShareMap[e.id] || 0);
    if (e.paid_by === currentUser.id) return sum + (e.amount || 0);
    return sum;
  }, 0);

  let html = `<div class="budgetGrid">`;
  html += `<div class="budgetCard"><div class="budgetLabel">Trip budget</div><div class="budgetAmount">${fmtCurrency(total, currency)}</div></div>`;
  html += `<div class="budgetCard"><div class="budgetLabel">Spent by me</div><div class="budgetAmount">${fmtCurrency(myTotal, currency)}</div></div>`;
  html += `</div>`;
  return html;
}

function renderExpenseTile(exp, paidByName, myShare, splitUserIds = [], memberMap = {}) {
  const el = document.createElement("div");
  el.className = "tile swipeable";
  el.dataset.expenseId = exp.id;
  el.style.position = "relative";
  const icon = getCategoryIcon(exp.category);
  const amount = fmtCurrency(exp.amount, exp.currency);
  
  // Get names of people this is split among
  const splitNames = splitUserIds.map(uid => memberMap[uid] || "").filter(Boolean);
  const forText = splitNames.length > 0 ? splitNames.join(", ") : "Unknown";

  el.innerHTML = `
    <button class="btn ghost small" data-action="edit-expense" data-expense-id="${esc(exp.id)}" type="button" style="position: absolute; top: 8px; right: 8px; padding: 4px 8px; font-size: 14px; line-height: 1;">Edit</button>
    <div class="tileTop">
      <div>
        <div class="tileTitle">${icon} ${esc(exp.title)}</div>
        <div class="tileMeta">${exp.expense_date || "No date"} · Paid by ${esc(paidByName || "")} for ${esc(forText)}</div>
      </div>
    </div>
    <div class="expenseAmount">${amount}</div>
  `;

  return el;
}

async function deleteExpense(expenseId) {
  if (!expenseId || !currentTrip) return;

  const ok = confirm("Delete this expense? This cannot be undone.");
  if (!ok) return;

  deleteExpenseBtn.disabled = true;
  setMsg(expensesMsg, "Deleting…", "warn");

  const { error } = await supabase.from("expenses").delete().eq("id", expenseId);
  
  deleteExpenseBtn.disabled = false;

  if (error) return setMsg(expensesMsg, error.message, "bad");

  setMsg(expensesMsg, "Expense deleted.", "ok");
  await logActivity(currentTrip.id, "deleted_expense", { id: expenseId });
  addExpensePanel.classList.add("hidden");
  enterExpenseCreateMode();
  await loadExpenses();
}

// ---- members
async function calculateMemberBalances(userId) {
  if (!currentTrip) return { total: 0, details: {} };

  // Get all expenses for this trip
  const { data: allExpenses } = await supabase
    .from("expenses")
    .select("id, amount, paid_by")
    .eq("trip_id", currentTrip.id);

  if (!allExpenses?.length) return { total: 0, details: {} };

  // Get all splits for this trip
  const { data: allSplits } = await supabase
    .from("expense_splits")
    .select("expense_id, user_id, share_amount")
    .in("expense_id", allExpenses.map(e => e.id));

  // Calculate balance with each other member
  const details = {};

  for (const expense of allExpenses) {
    const splits = (allSplits || []).filter(s => s.expense_id === expense.id);
    
    // If this user paid this expense
    if (expense.paid_by === userId) {
      // Everyone who owes a split owes this user
      for (const split of splits) {
        if (split.user_id !== userId) {
          details[split.user_id] = (details[split.user_id] || 0) + split.share_amount;
        }
      }
    }
    
    // If this user has a split in this expense
    const userSplit = splits.find(s => s.user_id === userId);
    if (userSplit && expense.paid_by !== userId) {
      // This user owes the payer
      details[expense.paid_by] = (details[expense.paid_by] || 0) - userSplit.share_amount;
    }
  }

  // Calculate total
  const total = Object.values(details).reduce((sum, amt) => sum + amt, 0);

  return { total, details };
}

async function loadMembers() {
  if (!currentTrip) return;

  setMsg(membersMsg, "Loading members…", "warn");
  membersList.innerHTML = "";

  const { data, error } = await supabase
    .from("trip_members")
    .select("user_id,role,joined_at,email")
    .eq("trip_id", currentTrip.id);

  if (error) return setMsg(membersMsg, error.message, "bad");

  if (!data?.length) return setMsg(membersMsg, "No members yet.", "warn");

  setMsg(membersMsg, "", "");

  // Pre-fetch display names for all members
  const memberNames = {};
  for (const m of data) {
    memberNames[m.user_id] = getStoredNickname(m.user_id) || m.email || "";
  }

  for (const member of data) {
    const balanceInfo = await calculateMemberBalances(member.user_id);
    membersList.appendChild(renderMemberTile(member, member.email, balanceInfo, memberNames));
  }
}

function renderMemberTile(member, email, balanceInfo = { total: 0, details: {} }, memberNames = {}) {
  const el = document.createElement("div");
  el.className = "tile";
  const isCurrentUser = member.user_id === currentUser.id;
  const isOwner = currentRole === "owner";
  const displayName = memberNames[member.user_id] || email;
  
  const balance = balanceInfo.total;
  let balanceText = "";
  
  if (balance !== 0) {
    // Find the largest debt/credit
    const entries = Object.entries(balanceInfo.details).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
    
    if (entries.length > 0) {
      const [otherUserId, amount] = entries[0];
      const otherName = memberNames[otherUserId] || "";
      
      if (amount > 0) {
        el.classList.add("owed");
        balanceText = `<span style="color: #4ade80;">Is owed ${fmtCurrency(amount, currentTrip.currency)} by ${esc(otherName)}</span>`;
      } else if (amount < 0) {
        el.classList.add("owes");
        balanceText = `<span style="color: #f87171;">Owes ${fmtCurrency(Math.abs(amount), currentTrip.currency)} to ${esc(otherName)}</span>`;
      }
    }
  } else {
    balanceText = `<span style="color: #94a3b8;">Settled up</span>`;
  }

  el.innerHTML = `
    <div class="tileTop">
      <div>
        <div class="tileTitle">${esc(displayName)}</div>
        <div class="tileMeta">Joined ${new Date(member.joined_at).toLocaleDateString()} · ${balanceText}</div>
      </div>
      <div class="pills">
        <span class="pill">${esc(member.role)}</span>
        ${!isCurrentUser && isOwner ? `<button class="pill danger" data-action="remove-member" data-user="${esc(member.user_id)}" type="button">Remove</button>` : ""}
      </div>
    </div>
  `;

  return el;
}

// ---- packing lists
async function createPackingList() {
  if (!currentTrip) return;

  const title = (packingListTitle.value || "").trim();
  if (!title) return setMsg(packingMsg, "List name required.", "warn");

  createPackingListBtn.disabled = true;
  setMsg(packingMsg, "Creating…", "warn");

  const { error } = await supabase.from("packing_lists").insert({
    trip_id: currentTrip.id,
    title,
    created_by: currentUser.id,
  });

  createPackingListBtn.disabled = false;

  if (error) return setMsg(packingMsg, error.message, "bad");

  packingListTitle.value = "";
  setMsg(packingMsg, "Packing list created.", "ok");
  await loadPackingLists();
}

async function loadPackingLists() {
  if (!currentTrip) return;

  packingListsContainer.innerHTML = "";

  const { data, error } = await supabase
    .from("packing_lists")
    .select("id,title,created_by")
    .eq("trip_id", currentTrip.id);

  if (error) {
    packingListsContainer.innerHTML = `<div class="msg bad">${esc(error.message)}</div>`;
    return;
  }

  if (!data?.length) {
    packingListsContainer.innerHTML = `<div class="msg warn">No packing lists yet. Create one above.</div>`;
    return;
  }

  for (const list of data) {
    packingListsContainer.appendChild(await renderPackingList(list));
  }
}

async function renderPackingList(list) {
  const { data: items } = await supabase
    .from("packing_items")
    .select("id,item,packed,assigned_to")
    .eq("list_id", list.id);

  const container = document.createElement("div");
  container.className = "panel";

  const packed = (items || []).filter((i) => i.packed).length;
  const total = items?.length || 0;
  const progress = total > 0 ? Math.round((packed / total) * 100) : 0;

  // Create header with delete button
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";

  const titleDiv = document.createElement("div");
  titleDiv.className = "panelTitle";
  titleDiv.textContent = `${list.title} (${packed}/${total})`;

  const deleteListBtn = document.createElement("button");
  deleteListBtn.className = "btn ghost small";
  deleteListBtn.textContent = "Delete List";
  deleteListBtn.type = "button";
  deleteListBtn.onclick = () => deletePackingList(list.id);

  header.appendChild(titleDiv);
  header.appendChild(deleteListBtn);
  container.appendChild(header);

  // Progress bar
  const progressBar = document.createElement("div");
  progressBar.className = "progressBar";
  const progressFill = document.createElement("div");
  progressFill.className = "progressFill";
  progressFill.style.width = `${progress}%`;
  progressBar.appendChild(progressFill);
  container.appendChild(progressBar);

  // Items
  (items || []).forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "packingItem";
    itemDiv.style.display = "flex";
    itemDiv.style.alignItems = "center";
    itemDiv.style.gap = "8px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.packed;
    checkbox.className = "packingCheckbox";
    checkbox.dataset.itemId = item.id;

    const span = document.createElement("span");
    span.style.flex = "1";
    span.textContent = item.item;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn ghost small";
    deleteBtn.textContent = "×";
    deleteBtn.type = "button";
    deleteBtn.style.padding = "2px 6px";
    deleteBtn.style.fontSize = "11px";
    deleteBtn.onclick = () => deletePackingItem(item.id);

    itemDiv.appendChild(checkbox);
    itemDiv.appendChild(span);
    itemDiv.appendChild(deleteBtn);
    container.appendChild(itemDiv);
  });

  // Add item input
  const newItemInput = document.createElement("input");
  newItemInput.className = "input";
  newItemInput.placeholder = "Add item…";
  newItemInput.style.marginTop = "8px";

  const addBtn = document.createElement("button");
  addBtn.className = "btn primary";
  addBtn.textContent = "Add to list";
  addBtn.style.marginTop = "8px";
  addBtn.onclick = () => addPackingItem(list.id, newItemInput.value);

  container.appendChild(newItemInput);
  container.appendChild(addBtn);

  return container;
}

async function addPackingItem(listId, item) {
  const itemText = (item || "").trim();
  if (!itemText) return;

  await supabase.from("packing_items").insert({
    list_id: listId,
    item: itemText,
  });

  await loadPackingLists();
}

async function deletePackingList(listId) {
  console.log("deletePackingList called with:", listId);
  if (!listId) return;
  if (!confirm("Delete this packing list and all its items?")) return;

  const { error } = await supabase.from("packing_lists").delete().eq("id", listId);

  if (error) {
    console.error("Error deleting packing list:", error);
    setMsg(packingMsg, error.message, "bad");
    return;
  }

  setMsg(packingMsg, "Packing list deleted.", "ok");
  await loadPackingLists();
}

async function deletePackingItem(itemId) {
  console.log("deletePackingItem called with:", itemId);
  if (!itemId) return;

  const { error } = await supabase.from("packing_items").delete().eq("id", itemId);

  if (error) {
    console.error("Error deleting packing item:", error);
    setMsg(packingMsg, error.message, "bad");
    return;
  }

  await loadPackingLists();
}

// ---- activity log
async function logActivity(tripId, action, details = {}) {
  if (!currentTrip) return;

  await supabase.from("activity_log").insert({
    trip_id: tripId,
    user_id: currentUser.id,
    action,
    details,
  });
}

async function loadActivityLog() {
  if (!currentTrip) return;

  activityLog.innerHTML = "";

  const { data, error } = await supabase
    .from("activity_log")
    .select("user_id,action,details,created_at")
    .eq("trip_id", currentTrip.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data?.length) {
    activityLog.innerHTML = `<div class="msg">No activity yet.</div>`;
    return;
  }

  for (const log of data) {
    const email = await getUserEmail(log.user_id);
    activityLog.appendChild(renderActivityItem(log, email));
  }
}

function renderActivityItem(log, email) {
  const el = document.createElement("div");
  el.className = "tile";
  const time = new Date(log.created_at).toLocaleString();
  const actionText = log.action.replace(/_/g, " ");

  el.innerHTML = `
    <div>
      <div class="tileTitle">${esc(actionText)}</div>
      <div class="tileMeta">${esc(email)} · ${time}</div>
    </div>
  `;

  return el;
}

// ---- realtime
function setupRealtime() {
  cleanupRealtime();
  if (!currentTrip) return;

  realtimeChannel = supabase
    .channel(`trip:${currentTrip.id}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "itinerary_items",
        filter: `trip_id=eq.${currentTrip.id}`,
      },
      () => loadItems()
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "expenses",
        filter: `trip_id=eq.${currentTrip.id}`,
      },
      () => loadExpenses()
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "trip_members",
        filter: `trip_id=eq.${currentTrip.id}`,
      },
      () => loadMembers()
    )
    .subscribe();
}

function cleanupRealtime() {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
}

// ---- wiring
loginBtn.addEventListener("click", sendMagicLink);
logoutBtn.addEventListener("click", logOut);
refreshBtn.addEventListener("click", () => {
  window.location.reload();
});

if (toggleCreateBtn && createPanel) {
  toggleCreateBtn.addEventListener("click", () => {
    createPanel.classList.toggle("hidden");
    joinPanel?.classList.add("hidden");
  });
}

if (toggleJoinBtn && joinPanel) {
  toggleJoinBtn.addEventListener("click", () => {
    joinPanel.classList.toggle("hidden");
    createPanel?.classList.add("hidden");
  });
}

toggleAddItemBtn.addEventListener("click", () => {
  enterItemCreateMode();
});

toggleAddExpenseBtn.addEventListener("click", () => {
  enterExpenseCreateMode();
});

togglePackingBtn.addEventListener("click", () => {
  addPackingPanel.classList.toggle("hidden");
});

if (expenseSplitAll && expenseSplitList) {
  expenseSplitAll.addEventListener("change", () => {
    const checked = expenseSplitAll.checked;
    expenseSplitList.classList.toggle("disabled", checked);
    const boxes = expenseSplitList.querySelectorAll("input[data-user-id]");
    boxes.forEach((cb) => {
      cb.checked = true;
    });
  });
}

userBtn.addEventListener("click", () => {
  if (!currentUser) return;
  const currentDisplayName = currentUser.user_metadata?.display_name || getStoredNickname(currentUser.id);
  const next = prompt("Set your display name", currentDisplayName || "");
  if (next === null) return;
  const trimmed = next.trim();
  supabase.auth.updateUser({
    data: { display_name: trimmed || null },
  }).then(({ data, error }) => {
    if (error) return setMsg(tripsMsg, error.message, "bad");
    if (data?.user) currentUser = data.user;
    setStoredNickname(currentUser.id, trimmed);
    userNameCache[currentUser.id] = formatNameWithEmail(trimmed, currentUser.email);
    userBtn.textContent = getHeaderDisplayName();
    loadMembers();
  });
});

a2hsClose?.addEventListener("click", () => {
  localStorage.setItem("a2hsDismissed", "1");
  a2hsOverlay.classList.add("hidden");
});

showA2HS();

// Toggle between sign in and sign up
$("toggleAuthMode").addEventListener("click", () => {
  authMode = authMode === "signin" ? "signup" : "signin";
  if (authMode === "signin") {
    loginBtn.textContent = "Sign in";
    $("toggleAuthMode").textContent = "Create account";
    $("toggleAuthMode").previousElementSibling.textContent = "Don't have an account? ";
  } else {
    loginBtn.textContent = "Create account";
    $("toggleAuthMode").textContent = "Sign in";
    $("toggleAuthMode").previousElementSibling.textContent = "Already have an account? ";
  }
  setMsg(authMsg, "", "");
});

createTripBtn.addEventListener("click", createTrip);
joinTripBtn.addEventListener("click", joinTrip);

closeTripBtn.addEventListener("click", closeTrip);
copyTripIdBtn.addEventListener("click", copyTripId);
copyJoinLinkBtn.addEventListener("click", copyJoinLink);

saveTripBtn.addEventListener("click", (e) => {
  e.preventDefault();
  saveTripSettings();
});
deleteTripBtn.addEventListener("click", deleteTrip);

addItemBtn.addEventListener("click", addItem);
addExpenseBtn.addEventListener("click", addExpense);
cancelItemBtn.addEventListener("click", () => {
  addItemPanel.classList.add("hidden");
  enterItemCreateMode();
});
cancelExpenseBtn.addEventListener("click", () => {
  addExpensePanel.classList.add("hidden");
  enterExpenseCreateMode();
});
deleteItemBtn.addEventListener("click", async () => {
  const itemId = editItemId.value;
  if (itemId) await deleteItem(itemId);
});
deleteExpenseBtn.addEventListener("click", async () => {
  const expenseId = editExpenseId.value;
  if (expenseId) await deleteExpense(expenseId);
});
createPackingListBtn.addEventListener("click", createPackingList);

// Tab navigation
document.querySelectorAll(".tabBtn").forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

itemsList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  if (action === "edit") {
    const itemId = btn.dataset.itemId;
    if (itemId) enterItemEditMode(itemId);
  } else if (action === "moveup") {
    const itemId = btn.dataset.itemId;
    if (itemId) moveItemUp(itemId);
  } else if (action === "movedown") {
    const itemId = btn.dataset.itemId;
    if (itemId) moveItemDown(itemId);
  }
});

expensesList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  if (btn.dataset.action === "edit-expense") {
    enterExpenseEditMode(btn.dataset.expenseId);
  }
});

let swipeStartX = 0;
let swipeActiveTile = null;

expensesList.addEventListener("touchstart", (e) => {
  const tile = e.target.closest(".tile.swipeable");
  if (!tile) return;
  swipeActiveTile = tile;
  swipeStartX = e.touches[0].clientX;
  tile.classList.remove("swipeHint");
}, { passive: true });

expensesList.addEventListener("touchmove", (e) => {
  if (!swipeActiveTile) return;
  const currentX = e.touches[0].clientX;
  const deltaX = Math.min(0, currentX - swipeStartX);
  swipeActiveTile.style.transform = `translateX(${deltaX}px)`;
  if (deltaX < -80) swipeActiveTile.classList.add("swipeHint");
  else swipeActiveTile.classList.remove("swipeHint");
}, { passive: true });

expensesList.addEventListener("touchend", async () => {
  if (!swipeActiveTile) return;
  const computed = getComputedStyle(swipeActiveTile);
  const matrix = new DOMMatrixReadOnly(computed.transform);
  const translateX = matrix.m41 || 0;
  const expenseId = swipeActiveTile.dataset.expenseId;
  swipeActiveTile.style.transform = "";
  swipeActiveTile.classList.remove("swipeHint");
  swipeActiveTile = null;

  if (translateX <= -80 && expenseId) {
    await deleteExpense(expenseId);
  }
});

// Swipe to delete for itinerary items
let swipeStartXItem = 0;
let swipeActiveTileItem = null;

itemsList.addEventListener("touchstart", (e) => {
  const tile = e.target.closest(".tile.swipeable");
  if (!tile) return;
  swipeActiveTileItem = tile;
  swipeStartXItem = e.touches[0].clientX;
  tile.classList.remove("swipeHint");
}, { passive: true });

itemsList.addEventListener("touchmove", (e) => {
  if (!swipeActiveTileItem) return;
  const currentX = e.touches[0].clientX;
  const deltaX = Math.min(0, currentX - swipeStartXItem);
  swipeActiveTileItem.style.transform = `translateX(${deltaX}px)`;
  if (deltaX < -80) swipeActiveTileItem.classList.add("swipeHint");
  else swipeActiveTileItem.classList.remove("swipeHint");
}, { passive: true });

itemsList.addEventListener("touchend", async () => {
  if (!swipeActiveTileItem) return;
  const computed = getComputedStyle(swipeActiveTileItem);
  const matrix = new DOMMatrixReadOnly(computed.transform);
  const translateX = matrix.m41 || 0;
  const itemId = swipeActiveTileItem.dataset.itemId;
  swipeActiveTileItem.style.transform = "";
  swipeActiveTileItem.classList.remove("swipeHint");
  swipeActiveTileItem = null;

  if (translateX <= -80 && itemId) {
    await deleteItem(itemId);
  }
});

membersList.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  if (btn.dataset.action === "remove-member") {
    const userId = btn.dataset.user;
    const ok = confirm("Remove this member from the trip?");
    if (ok) {
      await supabase.from("trip_members").delete().eq("trip_id", currentTrip.id).eq("user_id", userId);
      await loadMembers();
    }
  }
});

packingListsContainer.addEventListener("change", async (e) => {
  if (e.target.classList.contains("packingCheckbox")) {
    const itemId = e.target.dataset.itemId;
    const packed = e.target.checked;
    await supabase.from("packing_items").update({ packed }).eq("id", itemId);
    await loadPackingLists();
  }
});

packingListsContainer.addEventListener("click", (e) => {
  console.log("Packing list click event:", e.target);
  const btn = e.target.closest("[data-action]");
  console.log("Button found:", btn);
  if (!btn) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  const action = btn.dataset.action;
  console.log("Action:", action);
  
  if (action === "delete-list") {
    const listId = btn.dataset.listId;
    console.log("Delete list ID:", listId);
    if (listId) deletePackingList(listId);
  } else if (action === "delete-packing-item") {
    const itemId = btn.dataset.itemId;
    console.log("Delete item ID:", itemId);
    if (itemId) deletePackingItem(itemId);
  }
});

// ---- init
(async function init() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) await signedInUI(session.user);
  else signedOutUI();

  supabase.auth.onAuthStateChange(async (_event, newSession) => {
    const u = newSession?.user || null;
    if (u) await signedInUI(u);
    else signedOutUI();
  });
})();
