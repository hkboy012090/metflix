import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    verifyBeforeUpdateEmail
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


const currentEmail = document.getElementById("currentEmail");
const newEmail = document.getElementById("newEmail");
const password = document.getElementById("password");
const saveEmailBtn = document.getElementById("saveEmailBtn");
const status = document.getElementById("status");


onAuthStateChanged(auth, async (user) => {

    // ========================================
    // CHECK LOGIN
    // ========================================

    if (!user) {
        window.location.href = "login.html";
        return;
    }


    // ========================================
    // SHOW CURRENT EMAIL
    // ========================================

    currentEmail.textContent = user.email;


    // ========================================
    // SEND VERIFICATION EMAIL
    // ========================================

    saveEmailBtn.addEventListener("click", async () => {

        const newEmailValue = newEmail.value.trim();


        // ========================================
        // CHECK NEW EMAIL
        // ========================================

        if (!newEmailValue) {

            status.textContent =
                "Please enter your new email.";

            return;
        }


        if (newEmailValue === user.email) {

            status.textContent =
                "This is already your current email.";

            return;
        }


        // ========================================
        // START
        // ========================================

        status.textContent =
            "Sending verification email...";

        saveEmailBtn.disabled = true;


        try {

            // ========================================
            // SEND VERIFICATION TO NEW EMAIL
            // ========================================

            await verifyBeforeUpdateEmail(
                user,
                newEmailValue
            );


            // ========================================
            // SUCCESS
            // ========================================

            status.textContent =
                "Verification link sent! Check your new email.";


            newEmail.value = "";


        } catch (error) {

            console.error(
                "Error sending verification email:",
                error
            );


            // ========================================
            // ERROR HANDLING
            // ========================================

            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                status.textContent =
                    "This email is already being used.";

            } else if (
                error.code ===
                "auth/invalid-email"
            ) {

                status.textContent =
                    "Invalid email address.";

            } else if (
                error.code ===
                "auth/requires-recent-login"
            ) {

                status.textContent =
                    "Please log in again before changing your email.";

            } else {

                status.textContent =
                    "Failed to send verification email.";

            }

        } finally {

            saveEmailBtn.disabled = false;

        }

    });

});
