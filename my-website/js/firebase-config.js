// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
  getStorage
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

import {
  getDatabase
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyCprwxcwbJm5Qu-IjVQxKxBuseakVu16dY",
  authDomain: "metflix-e8145.firebaseapp.com",
  projectId: "metflix-e8145",
  databaseURL: "https://metflix-e8145-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "metflix-e8145.firebasestorage.app",
  messagingSenderId: "995899651117",
  appId: "1:995899651117:web:3544fba402b658d3f5b4a4",
  measurementId: "G-QFSQ2PLK7R"
};


const app = initializeApp(firebaseConfig);


// Firebase Authentication
export const auth = getAuth(app);


// Firebase Firestore
export const db = getFirestore(app);


// Firebase Storage
export const storage = getStorage(app);


// Firebase Realtime Database
export const rtdb = getDatabase(app);
