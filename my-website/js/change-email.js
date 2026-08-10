import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged,
    EmailAuthProvider,
    reauthenticateWithCredential,
    verifyBeforeUpdateEmail
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


const currentEmail = document.getElementById("currentEmail");
const newEmail = document.getElementById("newEmail");
const password = document.getElementById("password");
const saveEmailBtn = document.getElementById("saveEmailBtn");
const status = document.getElementById("status");


onAuthStateChanged(auth, (user) => {

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
    // SAVE EMAIL BUTTON
    // ========================================

    saveEmailBtn.addEventListener("click", async () => {

        const newEmailValue = newEmail.value.trim();
        const passwordValue = password.value;


        // ========================================
        // CHECK NEW EMAIL
        // ========================================

        if (!newEmailValue) {

            status.textContent =
                "Please enter your new email.";

            return;
        }


        // ========================================
        // CHECK PASSWORD
        // ========================================

        if (!passwordValue) {

            status.textContent =
                "Please enter your current password.";

            return;
        }


        // ========================================
        // SAME EMAIL CHECK
        // ========================================

        if (newEmailValue === user.email) {

            status.textContent =
                "This is already your current email.";

            return;
        }


        // ========================================
        // START
        // ========================================

        status.textContent =
            "Checking your password...";

        saveEmailBtn.disabled = true;


        try {

            // ========================================
            // RE-AUTHENTICATE USER
            // ========================================

            const credential =
                EmailAuthProvider.credential(
                    user.email,
                    passwordValue
                );

            await reauthenticateWithCredential(
                user,
                credential
            );


            // ========================================
            // SEND VERIFICATION LINK
            // ========================================

            status.textContent =
                "Sending verification email...";

            await verifyBeforeUpdateEmail(
                user,
                newEmailValue
            );


            // ========================================
            // SUCCESS
            // ========================================

            status.textContent =
                "Verification link sent to your new email. Check your inbox and click the link to complete the change.";

            newEmail.value = "";
            password.value = "";


        } catch (error) {

            console.error(
                "Change email error:",
                error
            );


            // ========================================
            // WRONG PASSWORD
            // ========================================

            if (
                error.code ===
                "auth/wrong-password"
            ) {

                status.textContent =
                    "Incorrect current password.";

            }


            // ========================================
            // INVALID CREDENTIAL
            // ========================================

            else if (
                error.code ===
                "auth/invalid-credential"
            ) {

                status.textContent =
                    "Incorrect current password.";

            }


            // ========================================
            // EMAIL ALREADY USED
            // ========================================

            else if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                status.textContent =
                    "This email is already being used by another account.";

            }


            // ========================================
            // INVALID EMAIL
            // ========================================

            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                status.textContent =
                    "Please enter a valid email address.";

            }


            // ========================================
            // RECENT LOGIN REQUIRED
            // ========================================

            else if (
                error.code ===
                "auth/requires-recent-login"
            ) {

                status.textContent =
                    "Please log in again and try again.";

            }


            // ========================================
            // TOO MANY REQUESTS
            // ========================================

            else if (
                error.code ===
                "auth/too-many-requests"
            ) {

                status.textContent =
                    "Too many attempts. Please try again later.";

            }


            // ========================================
            // OTHER ERROR
            // ========================================

            else {

                status.textContent =
                    "Something went wrong. Please try again.";

            }

        } finally {

            saveEmailBtn.disabled = false;

        }

    });

});
