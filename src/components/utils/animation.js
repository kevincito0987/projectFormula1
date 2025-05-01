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
  

window.onload = () => {
    // 🔹 GSAP: Entrada con escala y opacidad
    gsap.from(".card", {
      scale: 0.5,
      opacity: 0,
      stagger: 0.2, // 📌 Aparición escalonada
      duration: 1,
      ease: "power2.out"
    });
  
    // 🔹 Anime.js: Refinamiento de opacidad + escalado dinámico
    anime({
      targets: ".card",
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 1200,
      delay: anime.stagger(150), // 📌 Se mantiene el efecto secuencial
      easing: "easeOutQuad"
    });
  };
  
  