import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";



const currentUsername = document.getElementById("currentUsername");
const newUsername = document.getElementById("newUsername");
const saveBtn = document.getElementById("saveUsernameBtn");
const status = document.getElementById("status");



let currentUser = null;



// LOAD USERNAME

onAuthStateChanged(auth, async (user)=>{

  if(!user){

    currentUsername.textContent = "Guest";
    return;

  }


  currentUser = user;


  try {

    const userRef = doc(db,"users",user.uid);

    const snap = await getDoc(userRef);


    if(snap.exists()){

      const data = snap.data();


      currentUsername.textContent =
      data.username || "No username";


    }else{

      currentUsername.textContent =
      "No username";

    }


  } catch(error){

    console.log(error);

    currentUsername.textContent =
    "Error loading";

  }


});




// SAVE USERNAME

saveBtn.addEventListener("click", async()=>{


  const username = newUsername.value.trim();


  if(!username){

    status.textContent="Enter new username";
    status.style.color="red";
    return;

  }



  if(!currentUser){

    status.textContent="Not logged in";
    return;

  }



  try{


    await updateDoc(
      doc(db,"users",currentUser.uid),
      {
        username: username
      }
    );



    await updateProfile(currentUser,{
      displayName: username
    });



    currentUsername.textContent = username;

    status.textContent="Username updated successfully";
    status.style.color="#00ff66";


  }catch(error){


    console.log(error);

    status.textContent=error.message;
    status.style.color="red";


  }


});
