import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const loginBtnMobile = document.getElementById("loginBtnMobile");
const registerBtnMobile = document.getElementById("registerBtnMobile");
const logoutBtnMobile = document.getElementById("logoutBtnMobile");

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (loginBtnMobile) loginBtnMobile.style.display = "none";
    if (registerBtnMobile) registerBtnMobile.style.display = "none";
    if (logoutBtnMobile) logoutBtnMobile.style.display = "block";
  } else {
    if (loginBtnMobile) loginBtnMobile.style.display = "block";
    if (registerBtnMobile) registerBtnMobile.style.display = "block";
    if (logoutBtnMobile) logoutBtnMobile.style.display = "none";
  }
});

if (logoutBtnMobile) {
  logoutBtnMobile.addEventListener("click", async () => {
    await signOut(auth);
    alert("Logged out successfully!");
    window.location.href = "login.html";
  });
}
