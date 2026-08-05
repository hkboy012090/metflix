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

document.querySelectorAll(".avatar-box img").forEach(img=>{

img.onclick=()=>{

preview.src=img.src;

localStorage.setItem("profileImage",img.src);

}

});



// Gallery upload

gallery.addEventListener("change",function(){

const file=this.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=function(e){

preview.src=e.target.result;

localStorage.setItem("profileImage",e.target.result);

}

reader.readAsDataURL(file);

});
