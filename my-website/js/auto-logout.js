import { auth, rtdb } from "./firebase-config.js";

import {
  signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  ref,
  remove
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";


let logoutTimer;


// 15 minutes
const INACTIVITY_TIME = 30 * 1000;

// Check kung nasa watch page
function isWatchingMovie() {

  return window.location.pathname.includes("watch.html");

}


// Auto logout function
async function autoLogout() {

  // Huwag mag logout habang nanonood
  if (isWatchingMovie()) {

    console.log("METFLIX: User watching movie. Auto logout disabled.");

    resetTimer();
    return;

  }


  const user = auth.currentUser;


  if (user) {

    // alisin presence
    const presenceRef = ref(
      rtdb,
      `presence/${user.uid}`
    );

    await remove(presenceRef);


    // logout firebase
    await signOut(auth);


    console.log("METFLIX: Auto logout due to inactivity.");

    window.location.href = "login.html";

  }

}



// Reset timer
function resetTimer() {

  clearTimeout(logoutTimer);

  logoutTimer = setTimeout(
    autoLogout,
    INACTIVITY_TIME
  );

}



// User activity detection
[
  "click",
  "mousemove",
  "keydown",
  "scroll",
  "touchstart"
].forEach(event => {

  document.addEventListener(
    event,
    resetTimer
  );

});


// Start timer
resetTimer();

console.log("METFLIX AUTO LOGOUT ACTIVE");
