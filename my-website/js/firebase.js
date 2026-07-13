// Firebase SDK

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Firebase Config

const firebaseConfig = {

apiKey: "AIzaSyBMTzMvEFUEGSMtBiT8hf5gj6ZocikC-lo",

authDomain: "metflix-d10a6.firebaseapp.com",

projectId: "metflix-d10a6",

storageBucket: "metflix-d10a6.firebasestorage.app",

messagingSenderId: "459321141412",

appId: "1:459321141412:web:873b9addd6d2ae59855e31"

};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };

