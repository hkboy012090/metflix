// ==============================
// METFLIX - THEME SETTINGS
// ==============================

const darkModeBtn = document.getElementById("darkModeBtn");
const lightModeBtn = document.getElementById("lightModeBtn");
const status = document.getElementById("status");


// ==============================
// APPLY THEME
// ==============================

function applyTheme(theme) {

  if (theme === "light") {

    document.body.classList.add("light-mode");

    darkModeBtn.classList.remove("active");
    lightModeBtn.classList.add("active");

  } else {

    document.body.classList.remove("light-mode");

    lightModeBtn.classList.remove("active");
    darkModeBtn.classList.add("active");
  }
}


// ==============================
// SAVE THEME
// ==============================

function saveTheme(theme) {

  localStorage.setItem("metflixTheme", theme);

  applyTheme(theme);

  status.textContent =
    theme === "light"
      ? "Light Mode enabled"
      : "Dark Mode enabled";

  setTimeout(() => {
    status.textContent = "";
  }, 2000);
}


// ==============================
// DARK MODE
// ==============================

darkModeBtn.addEventListener("click", () => {

  saveTheme("dark");

});


// ==============================
// LIGHT MODE
// ==============================

lightModeBtn.addEventListener("click", () => {

  saveTheme("light");

});


// ==============================
// LOAD SAVED THEME
// ==============================

const savedTheme =
  localStorage.getItem("metflixTheme") || "dark";

applyTheme(savedTheme);
