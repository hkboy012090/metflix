import { auth, db } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// -------------------- LOGIN --------------------
const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

  loginBtn.addEventListener("click", async () => {

    let login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value;

    try {

      // Kung username ang inilagay
      if (!login.includes("@")) {

        const q = query(
          collection(db, "users"),
          where("username", "==", login)
        );

        const snap = await getDocs(q);

        if (snap.empty) {
          alert("Username not found.");
          return;
        }

        login = snap.docs[0].data().email;
      }

      await signInWithEmailAndPassword(auth, login, password);

      alert("Login Successful!");
      window.location.href = "index.html";

    } catch (error) {
      alert(error.message);
    }

  });

}

// -------------------- REGISTER --------------------
const registerBtn = document.getElementById("registerBtn");

if (registerBtn) {

  registerBtn.addEventListener("click", async () => {

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

      // Check kung ginagamit na ang username
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        alert("Username already exists.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: username,
        email: email
      });

      alert("Registration Successful!");
      window.location.href = "login.html";

    } catch (error) {
      alert(error.message);
    }

  });

}

// -------------------- LOGOUT --------------------
export async function logout() {

  await signOut(auth);

  window.location.href = "index.html";

}

// -------------------- CHECK LOGIN --------------------
export function checkAuth(callback) {
  onAuthStateChanged(auth, callback);
}
