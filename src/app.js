document.addEventListener("DOMContentLoaded", () => {
    const profileIcon = document.getElementById("profile-icon");
    const homeIcon = document.getElementById("home-icon");

    profileIcon.addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector(".mainContent").innerHTML = "<user-config></user-config>";
    });

    homeIcon.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "../views/homePageUser.html"; // 🔄 Redirección al archivo de inicio
    });
});
