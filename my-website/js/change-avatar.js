import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


const currentAvatar = document.getElementById("currentAvatar");
const status = document.getElementById("status");
const avatarOptions = document.querySelectorAll(".avatar-option");


onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

            const data = userSnap.data();

            if (data.profileImage) {

                currentAvatar.src = "avatars/" + data.profileImage;

                avatarOptions.forEach(button => {

                    if (button.dataset.avatar === data.profileImage) {
                        button.classList.add("selected");
                    }

                });

            }

        }

    } catch (error) {

        console.error("Error loading avatar:", error);

    }

});


avatarOptions.forEach(button => {

    button.addEventListener("click", async () => {

        const user = auth.currentUser;

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        const selectedAvatar = button.dataset.avatar;

        try {

            status.textContent = "Saving...";

            const userRef = doc(db, "users", user.uid);

            await setDoc(
                userRef,
                {
                    profileImage: selectedAvatar
                },
                {
                    merge: true
                }
            );

            currentAvatar.src = "avatars/" + selectedAvatar;

            avatarOptions.forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");

            status.textContent = "Avatar saved successfully!";

        } catch (error) {

            console.error("Error saving avatar:", error);

            status.textContent =
                "Failed to save avatar. Please try again.";

        }

    });

});
