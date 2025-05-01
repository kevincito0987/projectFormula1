document.addEventListener("DOMContentLoaded", () => {
    // 🔎 Verificar si el cuerpo tiene la clase `no-animations`
    if (document.body.classList.contains("no-animations")) return;

    gsap.from("h1", { opacity: 0, y: -20, duration: 2, ease: "power2.out" });
    gsap.from("p", { opacity: 0, y: 15, duration: 1.5, ease: "power2.out", stagger: 0.6 });

    // 🌈 Animación de degradado en el botón
    gsap.to("main a", {  // 📌 Solo afecta los `<a>` dentro del main
        background: "linear-gradient(90deg, #8b0000, #ff4500)",  // 🎨 Tonos rojo oscuro y naranja intenso
        duration: 2, 
        repeat: -1, 
        yoyo: true, 
        ease: "power1.inOut"
    });
    
});    
  

document.addEventListener("DOMContentLoaded", () => {
    anime({
        targets: ".card",
        translateX: [-400, 0], // 🏎️ Aceleración desde fuera de pantalla
        translateY: [-20, 0], // 🔄 Simula un pequeño rebote como derrape
        rotate: [-5, 0], // 🚀 Ligero giro inicial como efecto de velocidad
        opacity: [0, 1], // 🔥 Se hacen visibles progresivamente
        filter: ["blur(10px)", "blur(0px)"], // 💨 Simulación de velocidad con desenfoque inicial
        duration: 1000, // ⏳ Velocidad de animación rápida, como F1
        easing: "easeOutExpo", // 🔥 Simula la desaceleración tras el arranque
        delay: anime.stagger(150), // 🚀 Aparición escalonada tipo parrilla de salida
    });
});
