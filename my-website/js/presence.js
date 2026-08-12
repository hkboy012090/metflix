import { auth, rtdb } from "./firebase-config.js";
import {
  ref,
  push,
  set,
  onDisconnect,
  onValue,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

console.log("METFLIX PRESENCE FILE LOADED");
console.log("AUTH:", auth);
console.log("RTDB:", rtdb);

// ========================================
// METFLIX ONLINE PRESENCE
// ========================================

onAuthStateChanged(auth, (user) => {

  // Walang naka-login
  if (!user) {
    console.log("Metflix: No user logged in.");
    return;
  }

  console.log("Metflix: Logged in user:", user.uid);

  // Check kung connected sa Realtime Database
  const connectedRef = ref(rtdb, ".info/connected");

  onValue(connectedRef, async (snapshot) => {

    if (snapshot.val() !== true) {
      console.log("Metflix: Realtime Database disconnected.");
      return;
    }

    console.log("Metflix: Realtime Database connected.");

    // User's presence location
    const userPresenceRef = ref(
      rtdb,
      `presence/${user.uid}`
    );

    // Gumawa ng unique connection
    const connectionRef = push(userPresenceRef);

    // Kapag nawala ang connection,
    // automatic itong magiging offline.
    await onDisconnect(connectionRef).set({
      state: "offline",
      last_changed: serverTimestamp()
    });

    // Mark user as online
    await set(connectionRef, {
      state: "online",
      last_changed: serverTimestamp()
    });

    console.log("Metflix: User is ONLINE.");
  });

});


// ========================================
// COUNT ONLINE USERS
// ========================================

const presenceRef = ref(rtdb, "presence");

onValue(presenceRef, (snapshot) => {

  const presenceData = snapshot.val() || {};

  const onlineUsers = new Set();

  // Loop through users
  Object.keys(presenceData).forEach((uid) => {

    const connections = presenceData[uid];

    // Loop through connections ng bawat user
    Object.values(connections || {}).forEach((connection) => {

      if (connection.state === "online") {
        onlineUsers.add(uid);
      }

    });

  });

  const onlineCount = onlineUsers.size;

  console.log("Metflix Online Users:", onlineCount);

  // Update counter sa website
  const onlineUserCount =
    document.getElementById("onlineUserCount");

  if (onlineUserCount) {
    onlineUserCount.textContent = onlineCount;
  }

});
