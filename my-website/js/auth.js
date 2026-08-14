import { auth, db, rtdb } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  ref,
  remove
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// =====================================================
// USERNAME LOOKUP
// =====================================================

async function getEmailFromUsername(username) {

  const response = await fetch(
    "/username-lookup",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        username: username
      })
    }
  );


  const result =
    await response.json();


  if (!response.ok) {

    throw new Error(
      result.message ||
      "Username not found."
    );

  }


  if (
    !result.success ||
    !result.email
  ) {

    throw new Error(
      "Username not found."
    );

  }


  return result.email;

}


// =====================================================
// LOGIN
// =====================================================

const loginBtn =
  document.getElementById("loginBtn");


if (loginBtn) {

  loginBtn.addEventListener(
    "click",
    async () => {

      let login =
        document
          .getElementById("login")
          .value
          .trim();

      const password =
        document
          .getElementById("password")
          .value;


      if (!login || !password) {

        alert(
          "Please enter your username/email and password."
        );

        return;

      }


      loginBtn.disabled = true;

      loginBtn.textContent =
        "Logging in...";


      try {

        // ---------------------------------------------
        // USERNAME LOGIN
        // ---------------------------------------------

        if (!login.includes("@")) {

          login =
            await getEmailFromUsername(
              login
            );

        }


        // ---------------------------------------------
        // FIREBASE LOGIN
        // ---------------------------------------------

        await signInWithEmailAndPassword(
          auth,
          login,
          password
        );


        alert(
          "Login Successful!"
        );


        window.location.href =
          "index.html";


      } catch (error) {

        console.error(
          "LOGIN ERROR:",
          error
        );


        let message =
          error.message;


        if (
          error.code ===
          "auth/invalid-credential"
        ) {

          message =
            "Incorrect username/email or password.";

        }

        else if (
          error.code ===
          "auth/user-not-found"
        ) {

          message =
            "Account not found.";

        }

        else if (
          error.code ===
          "auth/wrong-password"
        ) {

          message =
            "Incorrect password.";

        }


        alert(message);


        loginBtn.disabled =
          false;

        loginBtn.textContent =
          "Login";

      }

    }
  );

}


// =====================================================
// REGISTER
// =====================================================

const registerBtn =
  document.getElementById(
    "registerBtn"
  );


if (registerBtn) {

  registerBtn.addEventListener(
    "click",
    async () => {

      const username =
        document
          .getElementById("username")
          .value
          .trim();

      const email =
        document
          .getElementById("email")
          .value
          .trim();

      const password =
        document
          .getElementById("password")
          .value;


      // ---------------------------------------------
      // VALIDATION
      // ---------------------------------------------

      if (!username) {

        alert(
          "Please enter a username."
        );

        return;

      }


      if (!email) {

        alert(
          "Please enter an email."
        );

        return;

      }


      if (!password) {

        alert(
          "Please enter a password."
        );

        return;

      }


      if (username.length < 3) {

        alert(
          "Username must be at least 3 characters."
        );

        return;

      }


      if (password.length < 6) {

        alert(
          "Password must be at least 6 characters."
        );

        return;

      }


      registerBtn.disabled =
        true;

      registerBtn.textContent =
        "Creating Account...";


      try {

        // ---------------------------------------------
        // CHECK USERNAME
        // ---------------------------------------------

        let usernameAvailable =
          true;


        try {

          await getEmailFromUsername(
            username
          );

          // If we reached here,
          // the username already exists.

          usernameAvailable =
            false;

        } catch (lookupError) {

          // 404 means username does not exist.
          // That is what we want for registration.

          usernameAvailable =
            true;

        }


        if (!usernameAvailable) {

          throw new Error(
            "Username already exists. Please choose another username."
          );

        }


        // ---------------------------------------------
        // CREATE FIREBASE AUTH ACCOUNT
        // ---------------------------------------------

        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );


        const user =
          userCredential.user;


        // ---------------------------------------------
        // CREATE USER PROFILE
        // ---------------------------------------------

        await setDoc(
          doc(
            db,
            "users",
            user.uid
          ),
          {
            username:
              username,

            email:
              email
          }
        );


        alert(
          "Registration Successful!"
        );


        window.location.href =
          "login.html";


      } catch (error) {

        console.error(
          "REGISTRATION ERROR:",
          error
        );


        let message =
          error.message;


        if (
          error.code ===
          "auth/email-already-in-use"
        ) {

          message =
            "This email is already registered.";

        }

        else if (
          error.code ===
          "auth/invalid-email"
        ) {

          message =
            "Please enter a valid email address.";

        }

        else if (
          error.code ===
          "auth/weak-password"
        ) {

          message =
            "Password is too weak.";

        }


        alert(message);


        registerBtn.disabled =
          false;

        registerBtn.textContent =
          "Register";

      }

    }
  );

}


// =====================================================
// LOGOUT
// =====================================================

export async function logout() {

  const user =
    auth.currentUser;


  if (user) {

    const presenceRef =
      ref(
        rtdb,
        `presence/${user.uid}`
      );


    try {

      await remove(
        presenceRef
      );

    } catch (error) {

      console.error(
        "Presence removal error:",
        error
      );

    }

  }


  await signOut(auth);


  window.location.href =
    "index.html";

}


// =====================================================
// CHECK AUTH
// =====================================================

export function checkAuth(
  callback
) {

  onAuthStateChanged(
    auth,
    callback
  );

}
