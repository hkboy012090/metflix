import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Pakilagay ang email at password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    window.location.href = "index.html";
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});

document.getElementById("forgotPassword").addEventListener("click", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    if(email===""){
        alert("Please enter your email address first.");
        return;
    }

    try{

        await sendPasswordResetEmail(auth,email);

        alert("Password reset link has been sent to your email.");

    }catch(error){

        alert(error.message);

    }

});
