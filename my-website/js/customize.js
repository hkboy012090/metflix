body{

background:#111;
color:white;
font-family:Arial;

}

.profile-container{

max-width:500px;
margin:auto;
padding:30px;
text-align:center;

}

.profile-preview{

width:140px;
height:140px;
border-radius:50%;
object-fit:cover;
border:4px solid #e50914;
margin:20px 0;

}

button{

width:100%;
padding:14px;
margin:10px 0;
font-size:17px;
background:#e50914;
color:white;
border:none;
border-radius:10px;
cursor:pointer;

}

.avatar-box{

display:none;
margin-top:20px;

grid-template-columns:repeat(3,1fr);

gap:15px;

}

.avatar-box.show{

display:grid;

}

.avatar-box img{

width:100%;
border-radius:50%;
cursor:pointer;
border:3px solid transparent;

}

.avatar-box img:hover{

border-color:#e50914;

}
