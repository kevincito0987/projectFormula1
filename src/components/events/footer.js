// footer.js

document.addEventListener('DOMContentLoaded', () => {
    const icons = [
        { id: "home-icon", position: 0 },
        { id: "bag-icon", position: 1 },
        { id: "heart-icon", position: 2 },
        { id: "profile-icon", position: 3 }
    ];

    const movingBar = document.getElementById("moving-bar");

    function moveBarToIcon(iconElement) {
        const iconRect = iconElement.getBoundingClientRect();
        const footerRect = iconElement.closest('footer').getBoundingClientRect();
        const barPosition = iconRect.left - footerRect.left + (iconElement.offsetWidth / 2) - (movingBar.offsetWidth / 2.2);
        movingBar.style.transform = `translateX(${barPosition}px)`;
    }

    // Inicializar la barra en el primer ícono (la casa)
    const homeIcon = document.getElementById("home-icon");
    if (homeIcon) {
        moveBarToIcon(homeIcon);
    }

    icons.forEach(icon => {
        const iconElement = document.getElementById(icon.id);
        if (iconElement) {
            iconElement.addEventListener('mouseover', (event) => {
                moveBarToIcon(iconElement);
            });
        }
    });
});