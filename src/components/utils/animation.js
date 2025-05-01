document.addEventListener("DOMContentLoaded", () => {
    // 🔎 Verificar si el cuerpo tiene la clase `no-animations`
    if (document.body.classList.contains("no-animations")) return;

    gsap.from("h1", { opacity: 0, y: -20, duration: 2, ease: "power2.out" });
    gsap.from("p", { opacity: 0, y: 15, duration: 1.5, ease: "power2.out", stagger: 0.6 });

    // 🌈 Animación de degradado en el botón
    gsap.to("main a", {  // 📌 Solo afectará los `<a>` dentro del main
        background: "linear-gradient(90deg, #ff4d4d, #ffcc00)", 
        duration: 2, 
        repeat: -1, 
        yoyo: true, 
        ease: "power1.inOut"
    });
});    
  

document.addEventListener("DOMContentLoaded", () => {
    anime({
        targets: ".card", // 📌 Aplica el efecto a todas las cards
        translateY: [
            { value: -10, duration: 500 }, // 📌 Sube ligeramente
            { value: 10, duration: 500 } // 📌 Baja ligeramente
        ],
        easing: "easeInOutSine", // 🌊 Movimiento suave y natural
        duration: 1000, // ⏳ Tiempo total de la animación
        direction: "alternate", // 🔁 Oscilación continua entre arriba y abajo
        loop: true, // 🔄 Efecto infinito
        delay: anime.stagger(150) // 🔥 Efecto escalonado para simular ondas
    });

    // 🔹 Restaurar visibilidad de las cards manualmente
    document.querySelectorAll(".card").forEach(card => {
        card.style.opacity = "1"; // ✅ Evita que desaparezcan
    });
});
