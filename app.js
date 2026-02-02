import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ✅ TODO: paste from Supabase project settings
const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_PUBLIC_KEY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- UI helpers ----------
const $ = (id) => document.getElementById(id);
const show = (el) => el.classList.remove("hidden");
const hide = (el) => el.classList.add("hidden");
const msg = (el, text, kind = "") => {
  el.textContent = text || "";
  el.className = "msg" + (kind ? ` ${kind}` : "");
};

const authCard = $("authCard");
const appCard = $("appCard");
const tripCard = $("tripCard");

const loginBtn = $("loginBtn");
const logoutBtn = $("logoutBtn");
const authMsg = $("authMsg");
const tripsMsg = $("tripsMsg");
const itemsMsg = $("itemsMsg");

const userBadge = $("userBadge");

const tripsList = $("tripsList");
const createTripBtn = $("createTripBtn");
const tripTitle = $("tripTitle");

const closeTripBtn = $("closeTripBtn");
const tripHeading = $("tripHeading");
const tripSub = $("tripSub");
const itemsList = $("itemsList");

const addItemBtn = $("addItemBtn");
const itemDate = $("itemDate");
const itemTitle = $("itemTitle");
const itemLocation = $("itemLocation");
const itemNotes = $("itemNotes");

// ---------- state ----------
let currentUser = null;
let currentTrip = null;
let realtimeChannel = null;

// ---------- auth ----------
async function sendMagicLink() {
  const email = $("email").value.trim();
  if (!email) return msg(authMsg, "Enter an email.", "warn");

  loginBtn.disabled = true;
  msg(authMsg, "Sending magic link…", "warn");

  // GitHub Pages redirect: uses current origin + path
  const redirectTo = window.location.href.split("#")[0];

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });

  loginBtn.disabled = false;

  if (error) return msg(authMsg, error.message, "bad");
  msg(authMsg, "Check your email for the sign-in link.", "ok");
}

async function logOut() {
  await supabase.auth.signOut();
}

function setSignedOutUI() {
  currentUser = null;
  currentTrip = null;
  cleanupRealtime();

  show(authCard);
  hide(appCard);
  hide(tripCard);
  hide(logoutBtn);
  hide(userBadge);

  msg(authMsg, "", "");
  msg(tripsMsg, "", "");
  msg(itemsMsg, "", "");

  tripsList.innerHTML = "";
  itemsList.innerHTML = "";
}

async function setSignedInUI(user) {
  currentUser = user;

  hide(authCard);
  show(appCard);
  show(logoutBtn);
  show(userBadge);

  userBadge.textContent = user.email || user.id;

  await loadTrips();
}

// ---------- data ----------
async function loadTrips() {
  msg(tripsMsg, "Loading trips…", "warn");
  tripsList.innerHTML = "";

  // Simple version: trips are owned by you (no sharing yet).
  // We'll add collaboration via trip_members next.
  const { data, error } = await supabase
    .from("trips")
    .select("id,title,start_date,end_date,created_at")
    .eq("owner_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (error) return msg(tripsMsg, error.message, "bad");
  msg(tripsMsg, data.length ? "" : "No trips yet. Create one.", "warn");

  for (const t of data) {
    tripsList.appendChild(renderTripRow(t));
  }
}

function renderTripRow(t) {
  const el = document.createElement("div");
  el.className = "item";
  el.innerHTML = `
    <div class="title">${escapeHtml(t.title)}</div>
    <div class="sub">${formatDateRange(t.start_date, t.end_date)}</div>
    <div class="meta">
      <span class="pill">Open</span>
      <span class="pill">${shortId(t.id)}</span>
    </div>
  `;
  el.style.cursor = "pointer";
  el.addEventListener("click", () => openTrip(t));
  return el;
}

async function createTrip() {
  const title = tripTitle.value.trim();
  if (!title) return msg(tripsMsg, "Trip title required.", "warn");

  createTripBtn.disabled = true;
  msg(tripsMsg, "Creating…", "warn");

  const { error } = await supabase.from("trips").insert({
    owner_id: currentUser.id,
    title,
  });

  createTripBtn.disabled = false;

  if (error) return msg(tripsMsg, error.message, "bad");

  tripTitle.value = "";
  msg(tripsMsg, "Trip created.", "ok");
  await loadTrips();
}

async function openTrip(t) {
  currentTrip = t;

  tripHeading.textContent = t.title;
  tripSub.textContent = "Realtime itinerary (everyone in this trip will sync once sharing is enabled).";

  show(tripCard);

  await loadItems();
  setupRealtime();
}

async function closeTrip() {
  currentTrip = null;
  cleanupRealtime();
  hide(tripCard);
  itemsList.innerHTML = "";
  msg(itemsMsg, "", "");
}

async function loadItems() {
  if (!currentTrip) return;

  msg(itemsMsg, "Loading itinerary…", "warn");
  itemsList.innerHTML = "";

  const { data, error } = await supabase
    .from("itinerary_items")
    .select("id,day_date,title,location,notes,updated_at")
    .eq("trip_id", currentTrip.id)
    .order("day_date", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) return msg(itemsMsg, error.message, "bad");

  msg(itemsMsg, data.length ? "" : "No items yet. Add one.", "warn");
  for (const it of data) {
    itemsList.appendChild(renderItemRow(it));
  }
}

function renderItemRow(it) {
  const el = document.createElement("div");
  el.className = "item";
  el.innerHTML = `
    <div class="title">${escapeHtml(it.title)}</div>
    <div class="sub">
      ${it.day_date ? escapeHtml(it.day_date) : "No date"} •
      ${it.location ? escapeHtml(it.location) : "No location"}
    </div>
    ${it.notes ? `<div class="sub">${escapeHtml(it.notes)}</div>` : ""}
    <div class="meta">
      <span class="pill">${new Date(it.updated_at).toLocaleString()}</span>
      <span class="pill">${shortId(it.id)}</span>
    </div>
  `;
  return el;
}

async function addItem() {
  if (!currentTrip) return;

  const day_date = itemDate.value || null;
  const title = itemTitle.value.trim();
  const location = itemLocation.value.trim() || null;
  const notes = itemNotes.value.trim() || null;

  if (!title) return msg(itemsMsg, "Item title required.", "warn");

  addItemBtn.disabled = true;
  msg(itemsMsg, "Adding…", "warn");

  const { error } = await supabase.from("itinerary_items").insert({
    trip_id: currentTrip.id,
    day_date,
    title,
    location,
    notes,
    updated_by: currentUser.id,
  });

  addItemBtn.disabled = false;

  if (error) return msg(itemsMsg, error.message, "bad");

  itemTitle.value = "";
  itemLocation.value = "";
  itemNotes.value = "";

  msg(itemsMsg, "Added. Syncing…", "ok");
  await loadItems();
}

// ---------- realtime ----------
function setupRealtime() {
  cleanupRealtime();
  if (!currentTrip) return;

  realtimeChannel = supabase
    .channel(`itinerary:${currentTrip.id}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "itinerary_items",
        filter: `trip_id=eq.${currentTrip.id}`,
      },
      async () => {
        // Somebody changed something -> refresh list
        await loadItems();
      }
    )
    .subscribe();
}

function cleanupRealtime() {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
}

// ---------- utils ----------
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}
function shortId(id) {
  return String(id).split("-")[0];
}
function formatDateRange(a, b) {
  if (!a && !b) return "No dates set";
  if (a && !b) return `From ${a}`;
  if (!a && b) return `Until ${b}`;
  return `${a} → ${b}`;
}

// ---------- wiring ----------
loginBtn.addEventListener("click", sendMagicLink);
logoutBtn.addEventListener("click", logOut);

createTripBtn.addEventListener("click", createTrip);
closeTripBtn.addEventListener("click", closeTrip);
addItemBtn.addEventListener("click", addItem);

// Restore session + listen for changes
(async function init() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    await setSignedInUI(session.user);
  } else {
    setSignedOutUI();
  }

  supabase.auth.onAuthStateChange(async (_event, sessionNow) => {
    const user = sessionNow?.user || null;
    if (user) await setSignedInUI(user);
    else setSignedOutUI();
  });
})();
