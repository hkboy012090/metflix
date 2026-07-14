import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCprwxcwbJm5Qu-IjVQxKxBuseakVu16dY",
  authDomain: "metflix-e8145.firebaseapp.com",
  projectId: "metflix-e8145",
  storageBucket: "metflix-e8145.firebasestorage.app",
  messagingSenderId: "995899651117",
  appId: "1:995899651117:web:3544fba402b658d3f5b4a4",
  measurementId: "G-QFSQ2PLK7R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
