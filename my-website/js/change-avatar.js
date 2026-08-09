import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


const currentAvatar = document.getElementById("currentAvatar");
const avatarOptions = document.querySelectorAll(".avatar-option");
const status = document.getElementById("status");


// ========================================
// CHECK LOGIN
// ========================================

onAuthStateChanged(auth, async (user) => {

    // Kapag hindi naka-login
    if (!user) {
        window.location.href = "login.html";
        return;
    }


    // User document sa Firestore
    const userRef = doc(db, "users", user.uid);


    try {

        // Kunin ang existing user data
        const userSnap = await getDoc(userRef);


        // ========================================
        // LOAD SAVED AVATAR
        // ========================================

        if (userSnap.exists()) {

            const userData = userSnap.data();

            if (userData.profileImage) {

                // Ipakita ang saved avatar
                currentAvatar.src = userData.profileImage;


                // Markahan ang currently selected avatar
                avatarOptions.forEach((option) => {

                    if (
                        option.dataset.avatar ===
                        userData.profileImage
                    ) {
                        option.classList.add("selected");
                    }

                });

            }

        }


        // ========================================
        // AVATAR CLICK
        // ========================================

        avatarOptions.forEach((option) => {

            option.addEventListener("click", async () => {

                const selectedAvatar =
                    option.dataset.avatar;


                // Ipakita agad ang piniling avatar
                currentAvatar.src = selectedAvatar;


                // Alisin ang selected sa lahat
                avatarOptions.forEach((item) => {
                    item.classList.remove("selected");
                });


                // Lagyan ng selected ang pinili
                option.classList.add("selected");


                status.textContent =
                    "Saving avatar...";


                try {

                    // ========================================
                    // SAVE SA FIRESTORE
                    // ========================================

                    await setDoc(
                        userRef,
                        {
                            profileImage: selectedAvatar
                        },
                        {
                            merge: true
                        }
                    );


                    status.textContent =
                        "Avatar saved successfully!";


                    // Burahin ang message pagkatapos ng 2 seconds
                    setTimeout(() => {
                        status.textContent = "";
                    }, 2000);


                } catch (error) {

                    console.error(
                        "Error saving avatar:",
                        error
                    );

                    status.textContent =
                        "Failed to save avatar.";

                }

            });

        });


    } catch (error) {

        console.error(
            "Error loading avatar:",
            error
        );

        status.textContent =
            "Failed to load avatar.";

    }

});
