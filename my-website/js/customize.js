import { auth, db } from "./firebase-config.js";

import {
    doc,
    getDoc,
    setDoc
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
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        alert("No user logged in");
        return;
    }

    try {

        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists()) {

            const data = snap.data();

            if (data.profileImage) {
                preview.src = data.profileImage;
            }

        }

    } catch (e) {

        console.error(e);

    }

});
// Show avatars
avatarBtn.onclick = () => {
    avatarBox.classList.toggle("show");
};

// Select avatar
document.querySelectorAll(".avatar-box img").forEach(img => {

    img.onclick = async () => {

        preview.src = img.src;
        

        if (!auth.currentUser) {
            alert("No user is logged in!");
            return;
        }

        try {

            const ref = doc(db, "users", auth.currentUser.uid);

            await setDoc(ref, {
                profileImage: img.src
            }, { merge: true });

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
        

        if (!auth.currentUser) {
            alert("No user is logged in!");
            return;
        }

        try {

            const ref = doc(db, "users", auth.currentUser.uid);

            await setDoc(ref, {
                profileImage: e.target.result
            }, { merge: true });

            alert("SUCCESS");

        } catch (e) {

            alert("ERROR: " + e.message);
            console.error(e);

        }

    };

    reader.readAsDataURL(file);

});
