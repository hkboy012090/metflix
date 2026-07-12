import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Pakilagay ang email at password.");
    return;
  }

  if (password.length < 6) {
    alert("Ang password ay dapat hindi bababa sa 6 na characters.");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Registration successful!");
    window.location.href = "login.html";
  } catch (error) {
    alert("Registration failed: " + error.message);
  }
});
