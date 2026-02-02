import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://upzbngnbkkbnpfcxguer.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwemJuZ25ia2tibnBmY3hndWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMTQxNjUsImV4cCI6MjA4NTU5MDE2NX0.yieZV7iL-lS361emD4tMHuXZyss_axulIalFPnFnltk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const $ = (id) => document.getElementById(id);

let user = null;
let currentTrip = null;
let channel = null;

/* AUTH */
$("loginBtn").onclick = async () => {
  const email = $("email").value;
  await supabase.auth.signInWithOtp({
    email,
    options:{ emailRedirectTo: location.href }
  });
  $("authMsg").textContent = "Check your email.";
};

$("logoutBtn").onclick = async () => {
  await supabase.auth.signOut();
};

/* SESSION */
supabase.auth.onAuthStateChange((_e,s)=>{
  user = s?.user || null;
  updateUI();
});

async function updateUI(){
  if(!user){
    $("authCard").classList.remove("hidden");
    $("appCard").classList.add("hidden");
    $("tripCard").classList.add("hidden");
    return;
  }
  $("authCard").classList.add("hidden");
  $("appCard").classList.remove("hidden");
  $("userBadge").classList.remove("hidden");
  $("logoutBtn").classList.remove("hidden");
  $("userBadge").textContent = user.email;
  loadTrips();
}

/* TRIPS */
$("createTripBtn").onclick = async () => {
  const title = $("tripTitle").value;
  const { data } = await supabase.from("trips")
    .insert({ title, owner_id:user.id })
    .select().single();

  await supabase.from("trip_members")
    .insert({ trip_id:data.id, user_id:user.id, role:"owner" });

  $("tripTitle").value="";
  loadTrips();
};

$("joinTripBtn").onclick = async ()=>{
  const id = $("joinTripId").value;
  await supabase.from("trip_members")
    .insert({ trip_id:id, user_id:user.id, role:"editor" });
  $("joinTripId").value="";
  loadTrips();
};

async function loadTrips(){
  const { data } = await supabase
    .from("trip_members")
    .select("role,trips(id,title)")
    .eq("user_id",user.id);

  $("tripsList").innerHTML="";
  data.forEach(r=>{
    const d=document.createElement("div");
    d.className="item";
    d.textContent=r.trips.title+" ("+r.role+")";
    d.onclick=()=>openTrip(r.trips);
    $("tripsList").appendChild(d);
  });
}

/* TRIP */
$("closeTripBtn").onclick = ()=>{
  $("tripCard").classList.add("hidden");
  if(channel) supabase.removeChannel(channel);
};

function openTrip(t){
  currentTrip=t;
  $("tripCard").classList.remove("hidden");
  $("tripHeading").textContent=t.title;
  $("tripIdBadge").textContent=t.id;
  loadItems();
  subscribe();
}

$("copyTripIdBtn").onclick=()=>{
  navigator.clipboard.writeText(currentTrip.id);
};

$("addItemBtn").onclick=async()=>{
  await supabase.from("itinerary_items").insert({
    trip_id:currentTrip.id,
    title:$("itemTitle").value,
    location:$("itemLocation").value,
    notes:$("itemNotes").value,
    day_date:$("itemDate").value,
    updated_by:user.id
  });
  $("itemTitle").value="";
  $("itemLocation").value="";
  $("itemNotes").value="";
  loadItems();
};

async function loadItems(){
  const { data } = await supabase
    .from("itinerary_items")
    .select("*")
    .eq("trip_id",currentTrip.id)
    .order("updated_at",{ascending:false});

  $("itemsList").innerHTML="";
  data.forEach(i=>{
    const d=document.createElement("div");
    d.className="item";
    d.textContent=i.title+" · "+(i.location||"");
    $("itemsList").appendChild(d);
  });
}

/* REALTIME */
function subscribe(){
  if(channel) supabase.removeChannel(channel);
  channel = supabase.channel("trip-"+currentTrip.id)
    .on("postgres_changes",
      {event:"*",schema:"public",table:"itinerary_items",filter:`trip_id=eq.${currentTrip.id}`},
      loadItems
    ).subscribe();
}

/* INIT */
(async()=>{
  const { data } = await supabase.auth.getSession();
  user=data.session?.user||null;
  updateUI();
})();
