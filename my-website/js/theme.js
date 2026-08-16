// ========================================
// METFLIX GLOBAL THEME
// ========================================

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// ========================================
// DEFAULT THEME
// ========================================

const DEFAULT_THEME = "classic-red";


// ========================================
// APPLY THEME
// ========================================

function applyTheme(theme) {

    const validThemes = [
        "classic-red",
        "neon-purple",
        "cyber-blue",
        "galaxy",
        "gold-vip"
    ];

    if (!validThemes.includes(theme)) {
        theme = DEFAULT_THEME;
    }

    const root =
        document.documentElement;

    // Remove old theme classes
    root.classList.remove(
        "theme-classic-red",
        "theme-neon-purple",
        "theme-cyber-blue",
        "theme-galaxy",
        "theme-gold-vip"
    );

    // Add selected theme
    root.classList.add(
        "theme-" + theme
    );

    // Save only as local cache
    localStorage.setItem(
        "metflixSelectedTheme",
        theme
    );

    console.log(
        "METFLIX THEME APPLIED:",
        theme
    );
}


// ========================================
// LOAD THEME FROM FIRESTORE
// ========================================

async function loadUserTheme(user) {

    // No user = classic theme
    if (!user) {

        applyTheme(
            DEFAULT_THEME
        );

        return;
    }


    try {

        const userRef =
            doc(
                db,
                "users",
                user.uid
            );


        const userSnap =
            await getDoc(
                userRef
            );


        if (
            userSnap.exists()
        ) {

            const data =
                userSnap.data();


            const selectedTheme =
                data.selectedTheme;


            if (
                typeof selectedTheme ===
                "string"
            ) {

                applyTheme(
                    selectedTheme
                );

                return;
            }

        }


        // No selected theme
        applyTheme(
            DEFAULT_THEME
        );


    } catch (error) {

        console.error(
            "METFLIX THEME LOAD ERROR:",
            error
        );


        // Use cached theme if Firestore fails
        const cachedTheme =
            localStorage.getItem(
                "metflixSelectedTheme"
            );


        applyTheme(
            cachedTheme ||
            DEFAULT_THEME
        );

    }

}


// ========================================
// AUTH STATE
// ========================================

onAuthStateChanged(
    auth,
    async (user) => {

        await loadUserTheme(
            user
        );

    }
);
