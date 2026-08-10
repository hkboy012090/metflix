import { auth } from "./firebase-config.js";

import {
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


const currentEmail = document.getElementById("currentEmail");
const sendResetBtn = document.getElementById("sendResetBtn");
const status = document.getElementById("status");


let userEmail = "";


// GET CURRENT EMAIL

onAuthStateChanged(auth, (user)=>{

  if(user){

    userEmail = user.email;

    currentEmail.textContent = user.email;

  }else{

    currentEmail.textContent = "Not logged in";

  }

});



// SEND RESET EMAIL

sendResetBtn.addEventListener("click", async()=>{


  if(!userEmail){

    status.textContent = "No email found";
    status.style.color = "red";
    return;

  }



  try{


    await sendPasswordResetEmail(
      auth,
      userEmail
    );


    status.textContent =
    "Password reset link sent to your email";


    status.style.color =
    "#00ff66";



  }catch(error){


    console.log(error);


    status.textContent =
    error.message;


    status.style.color =
    "red";


  }


});
