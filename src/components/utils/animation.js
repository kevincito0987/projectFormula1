// 📌 Asegurar que el DOM esté listo antes de ejecutar GSAP
document.addEventListener("DOMContentLoaded", () => {
    gsap.from("h1", { opacity: 0, y: -50, duration: 1, ease: "power2.out" }); // 🏆 Animación de entrada del título
    gsap.from("p", { opacity: 0, y: 30, duration: 1, ease: "power2.out", stagger: 0.3 }); // 📜 Efecto escalonado en los párrafos
    gsap.from("a", { opacity: 0, scale: 0.8, duration: 1, ease: "back.out(1.7)", delay: 0.5 }); // 🎟️ Botón con efecto de expansión
});
