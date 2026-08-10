// ==============================
// METFLIX GLOBAL THEME
// ==============================

(function () {

    const savedTheme =
        localStorage.getItem("metflixTheme") || "dark";

    if (savedTheme === "light") {
        document.documentElement.classList.add("light-mode");
    } else {
        document.documentElement.classList.remove("light-mode");
    }

})();
