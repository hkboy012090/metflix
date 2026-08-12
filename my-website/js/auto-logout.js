import { auth, rtdb } from "./firebase-config.js";

import {
  signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  ref,
  remove
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";


// ========================================
// METFLIX AUTO LOGOUT SYSTEM
// ========================================


let logoutTimer = null;


// 15 minutes
const INACTIVITY_TIME = 15 * 1000;



// ========================================
// CHECK IF WATCHING MOVIE
// ========================================

function isWatchingMovie() {

    const url = window.location.href.toLowerCase();

    console.log("CURRENT URL:", url);


    // Watch page format:
    // watch.html?id=123&type=movie

    if (
        url.includes("id=") &&
        url.includes("type=")
    ) {

        return true;

    }


    return false;

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
        "METFLIX: Auto logout stopped."
    );

}





// ========================================
// LOGOUT USER
// ========================================

async function autoLogout() {


    // Kapag nanonood ng movie
    // huwag mag logout

    if (isWatchingMovie()) {


        console.log(
            "METFLIX: User watching movie. Logout cancelled."
        );


        stopAutoLogout();


        return;

    }



    const user = auth.currentUser;



    if (!user) {

        return;

    }



    try {


        // Remove online presence

        const presenceRef = ref(
            rtdb,
            `presence/${user.uid}`
        );


        await remove(presenceRef);



        // Firebase logout

        await signOut(auth);



        console.log(
            "METFLIX: Auto logout successful."
        );



        window.location.href =
            "login.html";



    } catch(error) {


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



    // Kapag nasa watch page
    // walang inactivity logout

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
    "keydown",
    "scroll",
    "touchstart",
    "touchmove"

];



activityEvents.forEach((event) => {


    document.addEventListener(

        event,

        resetTimer,

        { passive:true }

    );


});






// ========================================
// START SYSTEM
// ========================================


if (isWatchingMovie()) {


    stopAutoLogout();


} else {


    resetTimer();


}



console.log(
    "METFLIX AUTO LOGOUT SYSTEM ACTIVE"
);
