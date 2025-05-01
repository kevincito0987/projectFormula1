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
    gsap.fromTo(".card", 
        { opacity: 0, scale: 0.5 },  // 📌 Estado inicial (opacas y reducidas)
        { opacity: 1, scale: 1, duration: 1, stagger: { amount: 1, grid: [2, 2], from: "edges" }, ease: "power2.out" } // 📌 Animación panal
    );
});

document.addEventListener("DOMContentLoaded", () => {
    gsap.fromTo(".card", 
        { opacity: 0, boxShadow: "0px 0px 0px rgba(255,255,255,0)" },  // 📌 Estado inicial sin brillo
        { opacity: 1, duration: 1, stagger: 0.3, ease: "power2.out",
          boxShadow: "0px 0px 20px rgba(255,255,255,0.8)" } // 📌 Brillo progresivo
    );
});


