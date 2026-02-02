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

// ---- elements
const authCard = $("authCard");
const appCard = $("appCard");
const tripCard = $("tripCard");

const loginBtn = $("loginBtn");
const logoutBtn = $("logoutBtn");
const userBadge = $("userBadge");

const authMsg = $("authMsg");
const tripsMsg = $("tripsMsg");
const itemsMsg = $("itemsMsg");

const tripsList = $("tripsList");
const tripTitle = $("tripTitle");
const createTripBtn = $("createTripBtn");

const joinTripId = $("joinTripId");
const joinTripBtn = $("joinTripBtn");

const tripHeading = $("tripHeading");
const tripIdBadge = $("tripIdBadge");
const copyTripIdBtn = $("copyTripIdBtn");
const closeTripBtn = $("closeTripBtn");

const itemDate = $("itemDate");
const itemTitle = $("itemTitle");
const itemLocation = $("itemLocation");
const itemNotes = $("itemNotes");
const addItemBtn = $("addItemBtn");
const itemsList = $("itemsList");

// ---- state
let currentUser = null;
let currentTrip = null;
let realtimeChannel = null;

// ---- auth
async function sendMagicLink() {
  const email = ($("email").value || "").trim();
  if (!email) return setMsg(authMsg, "Enter your email.", "warn");

  loginBtn.disabled = true;
  setMsg(authMsg, "Sending magic link…", "warn");

  const redirectTo = window.location.href.split("#")[0];

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });

  loginBtn.disabled = false;

  if (error) return setMsg(authMsg, error.message, "bad");
  setMsg(authMsg, "Check your email and click the link.", "ok");
}

async function logOut() {
  await supabase.auth.signOut();
}

function signedOutUI() {
  currentUser = null;
  currentTrip = null;
  cleanupRealtime();

  show(authCard);
  hide(appCard);
  hide(tripCard);
  hide(logoutBtn);
  hide(userBadge);

  setMsg(authMsg, "", "");
  setMsg(tripsMsg, "", "");
  setMsg(itemsMsg, "", "");

  tripsList.innerHTML = "";
  itemsList.innerHTML = "";
}

async function signedInUI(user) {
  currentUser = user;

  hide(authCard);
  show(appCard);
  show(logoutBtn);
  show(userBadge);

  userBadge.textContent = user.email || shortId(user.id);

  await loadTrips();
}

// ---- trips
async function loadTrips() {
  setMsg(tripsMsg, "Loading trips…", "warn");
  tripsList.innerHTML = "";

  const { data, error } = await supabase
    .from("trip_members")
    .select("role, trips(id,title,start_date,end_date,created_at,owner_id)")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false, referencedTable: "trips" });

  if (error) return setMsg(tripsMsg, error.message, "bad");

  const trips = (data || [])
    .map((row) => ({ ...row.trips, my_role: row.role }))
    .filter(Boolean);

  if (!trips.length) setMsg(tripsMsg, "No trips yet. Create one or join with a Trip ID.", "warn");
  else setMsg(tripsMsg, "", "");

  for (const t of trips) {
    tripsList.appendChild(renderTripTile(t));
  }
}

function renderTripTile(t) {
  const el = document.createElement("div");
  el.className = "tile";
  el.innerHTML = `
    <div class="tileTop">
      <div>
        <div class="tileTitle">${esc(t.title)}</div>
        <div class="tileMeta">Trip ID: ${esc(shortId(t.id))}</div>
      </div>
      <div class="pill accent">${esc(t.my_role || "member")}</div>
    </div>
  `;
  el.addEventListener("click", () => openTrip(t));
  return el;
}

async function createTrip() {
  const title = (tripTitle.value || "").trim();
  if (!title) return setMsg(tripsMsg, "Trip title required.", "warn");

  createTripBtn.disabled = true;
  setMsg(tripsMsg, "Creating…", "warn");

  const { data: tripRows, error: tripErr } = await supabase
    .from("trips")
    .insert({ owner_id: currentUser.id, title })
    .select("id,title")
    .limit(1);

  if (tripErr) {
    createTripBtn.disabled = false;
    return setMsg(tripsMsg, tripErr.message, "bad");
  }

  const tripId = tripRows?.[0]?.id;

  const { error: memErr } = await supabase.from("trip_members").insert({
    trip_id: tripId,
    user_id: currentUser.id,
    role: "owner",
  });

  createTripBtn.disabled = false;

  if (memErr) return setMsg(tripsMsg, memErr.message, "bad");

  tripTitle.value = "";
  setMsg(tripsMsg, "Trip created. Share the Trip ID with friends.", "ok");
  await loadTrips();
}

async function joinTrip() {
  const tripId = (joinTripId.value || "").trim();
  if (!tripId) return setMsg(tripsMsg, "Paste a Trip ID to join.", "warn");

  joinTripBtn.disabled = true;
  setMsg(tripsMsg, "Joining…", "warn");

  const { error } = await supabase.from("trip_members").insert({
    trip_id: tripId,
    user_id: currentUser.id,
    role: "editor",
  });

  joinTripBtn.disabled = false;

  if (error) return setMsg(tripsMsg, error.message, "bad");

  joinTripId.value = "";
  setMsg(tripsMsg, "Joined. Loading…", "ok");
  await loadTrips();
}

// ---- trip details
async function openTrip(t) {
  currentTrip = t;

  tripHeading.textContent = t.title || "Trip";
  tripIdBadge.textContent = `Trip ID: ${t.id}`;

  show(tripCard);

  await loadItems();
  setupRealtime();
}

function closeTrip() {
  currentTrip = null;
  cleanupRealtime();
  hide(tripCard);
  itemsList.innerHTML = "";
  setMsg(itemsMsg, "", "");
}

async function copyTripId() {
  if (!currentTrip?.id) return;
  await navigator.clipboard.writeText(currentTrip.id);
  setMsg(itemsMsg, "Trip ID copied.", "ok");
}

async function addItem() {
  if (!currentTrip) return;

  const day_date = itemDate.value || null;
  const title = (itemTitle.value || "").trim();
  const location = (itemLocation.value || "").trim() || null;
  const notes = (itemNotes.value || "").trim() || null;

  if (!title) return setMsg(itemsMsg, "Item title required.", "warn");

  addItemBtn.disabled = true;
  setMsg(itemsMsg, "Adding…", "warn");

  const { error } = await supabase.from("itinerary_items").insert({
    trip_id: currentTrip.id,
    day_date,
    title,
    location,
    notes,
    updated_by: currentUser.id,
  });

  addItemBtn.disabled = false;

  if (error) return setMsg(itemsMsg, error.message, "bad");

  itemTitle.value = "";
  itemLocation.value = "";
  itemNotes.value = "";

  setMsg(itemsMsg, "Added.", "ok");
  await loadItems();
}

async function loadItems() {
  if (!currentTrip) return;

  setMsg(itemsMsg, "Loading itinerary…", "warn");
  itemsList.innerHTML = "";

  const { data, error } = await supabase
    .from("itinerary_items")
    .select("id,day_date,title,location,notes,updated_at")
    .eq("trip_id", currentTrip.id)
    .order("day_date", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) return setMsg(itemsMsg, error.message, "bad");

  if (!data?.length) setMsg(itemsMsg, "No items yet. Add one.", "warn");
  else setMsg(itemsMsg, "", "");

  for (const it of data) {
    itemsList.appendChild(renderItemTile(it));
  }
}

function renderItemTile(it) {
  const el = document.createElement("div");
  el.className = "tile";
  const date = it.day_date ? esc(it.day_date) : "No date";
  const loc = it.location ? esc(it.location) : "No location";
  const updated = it.updated_at ? new Date(it.updated_at).toLocaleString() : "";

  el.innerHTML = `
    <div class="tileTop">
      <div>
        <div class="tileTitle">${esc(it.title)}</div>
        <div class="tileMeta">${date} · ${loc}</div>
      </div>
      <div class="pill">${esc(shortId(it.id))}</div>
    </div>
    ${it.notes ? `<div class="tileMeta" style="margin-top:10px;">${esc(it.notes)}</div>` : ""}
    ${updated ? `<div class="pills"><span class="pill">Updated: ${esc(updated)}</span></div>` : ""}
  `;
  return el;
}

// ---- realtime
function setupRealtime() {
  cleanupRealtime();
  if (!currentTrip) return;

  realtimeChannel = supabase
    .channel(`itinerary:${currentTrip.id}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "itinerary_items", filter: `trip_id=eq.${currentTrip.id}` },
      () => loadItems()
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

createTripBtn.addEventListener("click", createTrip);
joinTripBtn.addEventListener("click", joinTrip);

closeTripBtn.addEventListener("click", closeTrip);
copyTripIdBtn.addEventListener("click", copyTripId);

addItemBtn.addEventListener("click", addItem);

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
