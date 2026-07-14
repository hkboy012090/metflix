import { auth } from "./firebase-config.js";

import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

if(loginBtn){

loginBtn.onclick = async ()=>{

const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

try{

await signInWithEmailAndPassword(auth,email,password);

window.location.href="index.html";

}catch(e){

alert(e.message);

}

}

}

if(registerBtn){

registerBtn.onclick = async ()=>{

const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

try{

await createUserWithEmailAndPassword(auth,email,password);

alert("Account Created!");

window.location.href="login.html";

}catch(e){

alert(e.message);

}

}

}
