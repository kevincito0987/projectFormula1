document.addEventListener("DOMContentLoaded", () => {
    // 🔎 Verificar si el cuerpo tiene la clase `no-animations`
    if (document.body.classList.contains("no-animations")) return;

    gsap.from("h1", { opacity: 0, y: -20, duration: 2, ease: "power2.out" });
    gsap.from("p", { opacity: 0, y: 15, duration: 1.5, ease: "power2.out", stagger: 0.6 });

    // 🌈 Animación de degradado en el botón
    gsap.to("a", { 
        background: "linear-gradient(90deg, #ff4d4d, #ffcc00)", /* 🎨 Degradado inicial */
        duration: 2, 
        repeat: -1, /* 🔁 Efecto infinito */
        yoyo: true, /* 🔄 Hace que el degradado oscile */
        ease: "power1.inOut"
    });
});