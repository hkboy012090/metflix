import { auth } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// -------------------- LOGIN --------------------
const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);



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

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

      await createUserWithEmailAndPassword(auth, email, password);

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
