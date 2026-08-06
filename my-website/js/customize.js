import { auth, db } from "./firebase-config.js";

import {
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
const preview = document.getElementById("profilePreview");

const avatarBtn = document.getElementById("avatarBtn");

const avatarBox = document.getElementById("avatarBox");

const gallery = document.getElementById("gallery");



// Load saved profile

const saved = localStorage.getItem("profileImage");

if(saved){

preview.src = saved;

}



// Show avatars

avatarBtn.onclick=()=>{

avatarBox.classList.toggle("show");

}



// Select avatar

document.querySelectorAll(".avatar-box img").forEach(img => {

    img.onclick = async () => {

        preview.src = img.src;

        localStorage.setItem("profileImage", img.src);

        if (!auth.currentUser) {
            alert("No user is logged in!");
            return;
        }

        try {

            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                profileImage: img.src
            });

            alert("Avatar saved to Firestore!");

        } catch (error) {

            alert(error.message);
            console.error(error);

        }

    };

});



// Gallery upload

gallery.addEventListener("change",function(){

const file=this.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload = async function(e){

    preview.src = e.target.result;

    localStorage.setItem("profileImage", e.target.result);

    if (auth.currentUser) {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
            profileImage: e.target.result
        });
    }

}

reader.readAsDataURL(file);

});
