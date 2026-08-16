// ========================================
// METFLIX GLOBAL THEME SYSTEM
// ========================================
//
// DARK / LIGHT:
// metflixTheme
//
// PREMIUM THEME:
// metflixSelectedTheme
//
// PREMIUM THEMES:
// classic-red
// neon-purple
// cyber-blue
// galaxy
// gold-vip
//
// ========================================

(function () {

    // ========================================
    // APPLY PREMIUM THEME
    // ========================================

    function applyPremiumTheme(theme) {

        const root =
            document.documentElement;

        // Remove all previous premium themes
        root.classList.remove(
            "theme-classic-red",
            "theme-neon-purple",
            "theme-cyber-blue",
            "theme-galaxy",
            "theme-gold-vip"
        );


        // Default
        if (!theme) {

            theme =
                "classic-red";
        }


        // Apply selected theme
        root.classList.add(
            "theme-" + theme
        );


        // Save locally
        localStorage.setItem(
            "metflixSelectedTheme",
            theme
        );


        console.log(
            "METFLIX PREMIUM THEME:",
            theme
        );

    }


    // ========================================
    // APPLY DARK / LIGHT MODE
    // ========================================

    function applyDarkLightMode() {

        const savedMode =
            localStorage.getItem(
                "metflixTheme"
            ) || "dark";


        if (
            savedMode === "light"
        ) {

            document.documentElement.classList.add(
                "light-mode"
            );

        } else {

            document.documentElement.classList.remove(
                "light-mode"
            );

        }

    }


    // ========================================
    // LOAD LOCAL PREMIUM THEME FIRST
    // ========================================
    //
    // This prevents the page from briefly
    // showing the default theme while waiting
    // for Firestore.
    //
    // ========================================

    const localTheme =
        localStorage.getItem(
            "metflixSelectedTheme"
        ) || "classic-red";


    applyPremiumTheme(
        localTheme
    );


    // ========================================
    // APPLY DARK / LIGHT
    // ========================================

    applyDarkLightMode();


    // ========================================
    // FIREBASE THEME SYNC
    // ========================================
    //
    // We dynamically load Firebase modules
    // so this file can remain a normal script.
    //
    // ========================================

    async function loadFirebaseTheme() {

        try {

            const firebaseConfig =
                await import(
                    "./firebase-config.js"
                );


            const auth =
                firebaseConfig.auth;

            const db =
                firebaseConfig.db;


            const authModule =
                await import(
                    "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"
                );


            const firestoreModule =
                await import(
                    "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js"
                );


            const onAuthStateChanged =
                authModule.onAuthStateChanged;

            const doc =
                firestoreModule.doc;

            const getDoc =
                firestoreModule.getDoc;


            onAuthStateChanged(
                auth,
                async (user) => {

                    // ====================================
                    // NOT LOGGED IN
                    // ====================================

                    if (!user) {

                        applyPremiumTheme(
                            "classic-red"
                        );

                        return;
                    }


                    // ====================================
                    // LOGGED IN
                    // ====================================

                    try {

                        const userRef =
                            doc(
                                db,
                                "users",
                                user.uid
                            );


                        const snapshot =
                            await getDoc(
                                userRef
                            );


                        if (
                            snapshot.exists()
                        ) {

                            const data =
                                snapshot.data();


                            let selectedTheme =
                                data.selectedTheme;


                            // ====================================
                            // VALID THEMES
                            // ====================================

                            const validThemes = [
                                "classic-red",
                                "neon-purple",
                                "cyber-blue",
                                "galaxy",
                                "gold-vip"
                            ];


                            if (
                                !validThemes.includes(
                                    selectedTheme
                                )
                            ) {

                                selectedTheme =
                                    "classic-red";
                            }


                            applyPremiumTheme(
                                selectedTheme
                            );


                        } else {

                            applyPremiumTheme(
                                "classic-red"
                            );

                        }


                    } catch (error) {

                        console.error(
                            "METFLIX THEME FIRESTORE ERROR:",
                            error
                        );


                        // Keep local theme if Firestore
                        // cannot be reached.

                        applyPremiumTheme(
                            localTheme
                        );

                    }

                }
            );


        } catch (error) {

            console.error(
                "METFLIX THEME SYSTEM ERROR:",
                error
            );

        }

    }


    // ========================================
    // START FIREBASE SYNC
    // ========================================

    loadFirebaseTheme();


    // ========================================
    // GLOBAL FUNCTIONS
    // ========================================

    window.MetflixTheme = {

        apply:
            applyPremiumTheme,

        applyMode:
            applyDarkLightMode,

        getCurrent:
            function () {

                return (
                    localStorage.getItem(
                        "metflixSelectedTheme"
                    ) ||
                    "classic-red"
                );

            }

    };


})();
