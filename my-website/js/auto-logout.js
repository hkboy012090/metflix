import { auth, rtdb } from "./firebase-config.js";

import {
  signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  ref,
  remove
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";


let logoutTimer = null;


// ========================================
// METFLIX AUTO LOGOUT
// ========================================

// 15 minutes
const INACTIVITY_TIME =   15 * 1000;


// ========================================
// CHECK WATCH PAGE
// ========================================

function isWatchingMovie() {

    alert(window.location.pathname);

    return window.location.pathname
        .toLowerCase()
        .includes("watch.html");

}


// ========================================
// STOP TIMER
// ========================================

function stopAutoLogout() {

    if (logoutTimer) {

        clearTimeout(logoutTimer);

        logoutTimer = null;

    }

    console.log(
        "METFLIX: Auto logout disabled on watch page."
    );

}


// ========================================
// AUTO LOGOUT
// ========================================

async function autoLogout() {

    // HUWAG MAG LOGOUT HABANG NANONOOD
    if (isWatchingMovie()) {

        stopAutoLogout();

        return;

    }


    const user = auth.currentUser;


    if (!user) {

        return;

    }


    try {

        // Remove user's presence
        const presenceRef = ref(
            rtdb,
            `presence/${user.uid}`
        );

        await remove(presenceRef);


        // Firebase logout
        await signOut(auth);


        console.log(
            "METFLIX: User automatically logged out."
        );


        // Return to login
        window.location.href = "login.html";


    } catch (error) {

        console.error(
            "METFLIX AUTO LOGOUT ERROR:",
            error
        );

    }

}


// ========================================
// RESET TIMER
// ========================================

function resetTimer() {

    // IMPORTANT:
    // Kapag nasa watch page,
    // walang inactivity timer.

    if (isWatchingMovie()) {

        stopAutoLogout();

        return;

    }


    clearTimeout(logoutTimer);


    logoutTimer = setTimeout(
        autoLogout,
        INACTIVITY_TIME
    );

}


// ========================================
// USER ACTIVITY
// ========================================

const activityEvents = [

    "click",
    "mousemove",
    "keydown",
    "scroll",
    "touchstart",
    "touchmove"

];


activityEvents.forEach((eventName) => {

    document.addEventListener(
        eventName,
        resetTimer,
        { passive: true }
    );

});


// ========================================
// START
// ========================================

if (isWatchingMovie()) {

    stopAutoLogout();

} else {

    resetTimer();

}


console.log(
    "METFLIX AUTO LOGOUT SYSTEM ACTIVE"
);
