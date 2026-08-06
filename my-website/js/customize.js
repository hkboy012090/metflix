import { auth, db } from "./firebase-config.js";

import {
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Check kung naka-login ang user
onAuthStateChanged(auth, (user) => {

    if (user) {
        alert("User: " + user.uid);
    } else {
        alert("No user logged in");
    }

});

const preview = document.getElementById("profilePreview");
const avatarBtn = document.getElementById("avatarBtn");
const avatarBox = document.getElementById("avatarBox");
const gallery = document.getElementById("gallery");

// Load saved profile
const saved = localStorage.getItem("profileImage");

if (saved) {
    preview.src = saved;
}

// Show avatars
avatarBtn.onclick = () => {
    avatarBox.classList.toggle("show");
};

// Select avatar
document.querySelectorAll(".avatar-box img").forEach(img => {

    img.onclick = async () => {

        preview.src = img.src;

        localStorage.setItem("profileImage", img.src);

        if (!auth.currentUser) {
            alert("No user is logged in!");
            return;
        }

        try {

            await updateDoc(
                doc(db, "users", auth.currentUser.uid),
                {
                    profileImage: img.src
                }
            );

            alert("SUCCESS");

        } catch (e) {

            alert("ERROR: " + e.message);
            console.error(e);

        }

    };

});

// Gallery upload
gallery.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async function (e) {

        preview.src = e.target.result;

        localStorage.setItem("profileImage", e.target.result);

        if (!auth.currentUser) {
            alert("No user is logged in!");
            return;
        }

        try {

            await updateDoc(
                doc(db, "users", auth.currentUser.uid),
                {
                    profileImage: e.target.result
                }
            );

            alert("SUCCESS");

        } catch (e) {

            alert("ERROR: " + e.message);
            console.error(e);

        }

    };

    reader.readAsDataURL(file);

});
