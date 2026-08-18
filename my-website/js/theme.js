// ========================================
// METFLIX - GLOBAL THEME SYSTEM
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

function applyMetflixTheme(theme) {

  if (!theme) {
    theme = DEFAULT_THEME;
  }

  console.log(
    "METFLIX: Applying theme:",
    theme
  );


  // Apply theme to HTML
  document.documentElement.setAttribute(
    "data-theme",
    theme
  );


  // Apply theme to body too
  document.body.setAttribute(
    "data-theme",
    theme
  );


  // Save locally
  localStorage.setItem(
    "metflixSelectedTheme",
    theme
  );

}


// ========================================
// LOAD THEME FROM FIRESTORE
// ========================================

async function loadUserTheme(user) {

  if (!user) {

    console.log(
      "METFLIX THEME: Guest user"
    );

    const localTheme =
      localStorage.getItem(
        "metflixSelectedTheme"
      ) || DEFAULT_THEME;

    applyMetflixTheme(localTheme);

    return;

  }


  try {

    const userRef =
      doc(
        db,
        "users",
        user.uid
      );


    const snapshot =
      await getDoc(
        userRef
      );


    if (
      snapshot.exists()
    ) {

      const data =
        snapshot.data();


      let selectedTheme =
        data.selectedTheme;


      // Validate theme
      const allowedThemes = [
        "classic-red",
        "neon-purple",
        "cyber-blue",
        "galaxy",
        "gold-vip"
      ];


      if (
        !allowedThemes.includes(
          selectedTheme
        )
      ) {

        selectedTheme =
          DEFAULT_THEME;

      }


      console.log(
        "METFLIX THEME FROM FIRESTORE:",
        selectedTheme
      );


      applyMetflixTheme(
        selectedTheme
      );


      return;

    }


    // No user document
    applyMetflixTheme(
      DEFAULT_THEME
    );


  } catch (error) {

    console.error(
      "METFLIX THEME LOAD ERROR:",
      error
    );


    // Use local saved theme if Firebase fails
    const localTheme =
      localStorage.getItem(
        "metflixSelectedTheme"
      ) || DEFAULT_THEME;


    applyMetflixTheme(
      localTheme
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


// ========================================
// GLOBAL FUNCTION
// ========================================

window.applyMetflixTheme =
  applyMetflixTheme;
