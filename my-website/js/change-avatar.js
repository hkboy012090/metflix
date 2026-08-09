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


// ===============================
// CHECK LOGIN
// ===============================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    // Kunin ang user's Firestore document
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);


    // ===============================
    // LOAD SAVED AVATAR
    // ===============================

    if (userSnap.exists()) {

        const userData = userSnap.data();

        if (userData.profileImage) {

            currentAvatar.src = userData.profileImage;

            // Markahan kung alin ang kasalukuyang avatar
            avatarOptions.forEach(option => {

                if (option.dataset.avatar === userData.profileImage) {

                    option.classList.add("selected");

                }

            });

        }

    }


    // ===============================
    // AVATAR SELECTION
    // ===============================

    avatarOptions.forEach(option => {

        option.addEventListener("click", async () => {

            const avatar = option.dataset.avatar;

            // Ipakita agad ang bagong avatar
            currentAvatar.src = avatar;


            // Alisin ang selected sa lahat
            avatarOptions.forEach(item => {
                item.classList.remove("selected");
            });


            // Lagyan ng selected ang pinili
            option.classList.add("selected");


            status.textContent = "Saving avatar...";


            try {

                // SAVE SA FIRESTORE
                await setDoc(
                    userRef,
                    {
                        profileImage: avatar
                    },
                    {
                        merge: true
                    }
                );


                status.textContent = "Avatar saved successfully!";


                // Mawawala ang message pagkatapos ng ilang segundo
                setTimeout(() => {
                    status.textContent = "";
                }, 2000);


            } catch (error) {

                console.error("Avatar save error:", error);

                status.textContent =
                    "Failed to save avatar.";

            }

        });

    });

});
