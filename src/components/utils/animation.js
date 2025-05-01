// 📌 Asegurar que el DOM esté listo antes de ejecutar GSAP
document.addEventListener("DOMContentLoaded", () => {
    gsap.from("h1", { opacity: 0, y: -50, duration: 2.5, ease: "power2.out" }); // 🏆 Animación de entrada del título más lenta
    gsap.from("p", { opacity: 0, y: 30, duration: 2, ease: "power2.out", stagger: 1 }); // 📜 Aparición escalonada más pausada en los párrafos
    gsap.from("a", { 
        opacity: 0, 
        scale: 0.1, /* 📌 Inicia pequeño para expandirse */
        y: 20, /* 🔽 Movimiento vertical leve */
        duration: 2, 
        ease: "elastic.out(1, 0.9)", /* 🌊 Efecto ondulado elástico */
    });
    
});
