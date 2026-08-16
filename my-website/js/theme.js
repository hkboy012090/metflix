// ==============================
// METFLIX GLOBAL THEME SYSTEM
// ==============================

(function () {

    const savedTheme =
        localStorage.getItem("metflixSelectedTheme") ||
        "classic-red";

    // Remove old theme classes
    document.documentElement.classList.remove(
        "theme-classic-red",
        "theme-neon-purple",
        "theme-cyber-blue",
        "theme-galaxy",
        "theme-gold-vip"
    );

    // Apply selected theme
    document.documentElement.classList.add(
        "theme-" + savedTheme
    );

    console.log(
        "METFLIX THEME:",
        savedTheme
    );

})();
