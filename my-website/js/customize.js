

import { auth, db } from "./firebase-config.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// ===========================
// ELEMENTS
// ===========================

const preview = document.getElementById("profilePreview");
const avatarBtn = document.getElementById("avatarBtn");
const avatarBox = document.getElementById("avatarBox");
const gallery = document.getElementById("gallery");

// ===========================
// LOAD USER PROFILE
// ===========================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    try {

        const ref = doc(db, "users", user.uid);

        const snap = await getDoc(ref);

        if (snap.exists()) {

            const data = snap.data();

            if (data.profileImage) {

                preview.src = data.profileImage;

            }

        }

    } catch (error) {

        console.error(error);

    }

});

// ===========================
// OPEN AVATAR LIST
// ===========================

avatarBtn.addEventListener("click", () => {

    avatarBox.classList.toggle("show");

});

// ===========================
// SELECT AVATAR
// ===========================

document.querySelectorAll(".avatar-box img").forEach(img => {

    img.addEventListener("click", async () => {

        preview.src = img.src;

        if (!auth.currentUser) return;

        try {

            await setDoc(

                doc(db, "users", auth.currentUser.uid),

                {

                    profileImage: img.src

                },

                {

                    merge: true

                }

            );

            console.log("Avatar Saved");

        } catch (error) {

            console.error(error);

            alert("Failed to save avatar.");

        }

    });

});

// ===========================
// GALLERY UPLOAD
// ===========================

gallery.addEventListener("change", () => {

    const file = gallery.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {

        preview.src = e.target.result;

        if (!auth.currentUser) return;

        try {

            await setDoc(

                doc(db, "users", auth.currentUser.uid),

                {

                    profileImage: e.target.result

                },

                {

                    merge: true

                }

            );

            console.log("Custom Avatar Saved");

        } catch (error) {

            console.error(error);

            alert("Failed to save avatar.");

        }

    };

    reader.readAsDataURL(file);

});
