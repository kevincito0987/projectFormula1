class UserConfig extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
            <style>
                .container {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    align-items: center;
                    justify-content: center;
                }
                .inputs {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    align-items: center;
                    justify-content: center;
                }
                h1 {
                    text-align: center;
                }
                .user {
                    display: flex;
                    flex-direction: row;
                    gap: 40px;
                    align-items: center;
                    justify-content: center;
                }
                .text {
                    display: flex;
                    flex-direction: row;
                    gap: 10px;
                    align-items: center;
                    justify-content: center;
                }
                .escuderia {
                    display: flex;
                    flex-direction: row;
                    gap: 40px;
                    align-items: center;
                    justify-content: center;
                }
                .option {
                    display: flex;
                    flex-direction: row;
                    gap: 10px;
                    align-items: center;
                    justify-content: center;
                }
                .buttons {
                    display: flex;
                    flex-direction: row;
                    gap: 50px;
                    align-items: center;
                    justify-content: center;
                }
                .buttons a {
                    text-decoration: none;
                    padding: 20px;
                    border-radius: 30px;
                    transition: all 0.4s ease-in-out;
                }
                .buttons a:hover {
                    transform: scale(1.05);
                    box-shadow: 0px 4px 10px var(--color-5);
                    transition: all 0.4s ease-in-out;
                    background: var(--color-8);
                    border-radius: 30px;
                }
                .user input {
                    padding: 10px;
                    border-radius: 30px;
                }
                .escuderia select {
                    padding: 10px;
                    border-radius: 30px;
                    margin: 20px;
                }
                .image{
                    margin-bottom: 50px;
                }
                    /* 📱 Media Query para pantallas pequeñas */
                @media (max-width: 440px) {
                    .container {
                        width: 93%;
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                        align-items: center;
                        justify-content: center;
                    }
                    h1 {
                        font-size: 1.3rem;
                    }
                    .user, .escuderia, .buttons {
                        flex-direction: column;
                        gap: 20px;
                    }
                    .inputs {
                        gap: 15px;
                    }
                    .user {
                        gap: 20px;
                        margin-left: 10px;
                    }
                    .buttons a {
                        padding: 12px;
                        font-size: 0.9rem;
                    }
                    .image {
                        margin-bottom: 40px;
                        width: 98%;
                        margin-left: 20px;
                    }
                }
                @media (max-width: 162px) {
                    .container {
                        padding: 5px;
                        width: 94%;
                    }
                    h1 {
                        font-size: 0.6rem;
                    }
                    .user, .escuderia, .buttons {
                        flex-direction: column;
                        gap: 10px;
                    }
                    .user input {
                        width: 100px;
                    }
                    .text {
                        flex-direction: column;
                        gap: 5px;
                    }
                    .escuderia {
                        flex-direction: column;
                        gap: 5px;
                        text-align: center;
                    }
                    .escuderia select {
                        width: 100px;
                    }
                    .option {
                        flex-direction: column;
                        gap: 5px;
                    }
                    .inputs {
                        gap: 8px;
                    }
                    .buttons a {
                        padding: 8px;
                        font-size: 0.7rem;
                        border-radius: 20px;
                    }
                    .image {
                        margin-bottom: 40px;
                        width: 98%;
                        margin-left: 2px;
                    }
                }

            </style>
            <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
            <div class="max-w-lg mx-auto bg-gray-900 text-white p-12 rounded-xl shadow-2xl border-2 border-gray-800 relative overflow-hidden container">
                <h1 class="text-4xl font-extrabold text-red-500 text-center tracking-wide mb-6">🚀 Configuración de Perfil</h1>

                <div class="space-y-8 inputs">
                    <!-- Sección Nombre de Usuario -->
                    <div class="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 mb-4 user">
                        <label for="username" class="block text-lg font-semibold text-gray-300 mb-2">👤 Nombre:</label>
                        <div class="relative flex items-center bg-gray-700 p-4 rounded-lg text">
                            <input type="text" id="username" class="w-full text-xl bg-transparent border-none outline-none placeholder-gray-400 text-white user" placeholder="Introduce tu nombre">
                            <img src="../assets/icons/userIcon.svg" alt="User Icon" class="absolute left-4 w-6 h-6 opacity-80">
                        </div>
                    </div>

                    <!-- Sección Escudería Favorita -->
                    <div class="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 escuderia">
                        <label for="team" class="block text-lg font-semibold text-gray-300 mb-2">🏎 Escudería Favorita:</label>
                        <div class="relative flex items-center bg-gray-700 p-4 rounded-lg option">
                            <select id="team" class="w-full text-lg bg-transparent text-white border-none outline-none cursor-pointer">
                                <option value="Red Bull" class="bg-gray-900">Red Bull Racing</option>
                                <option value="Mercedes" class="bg-gray-900">Mercedes-AMG Petronas</option>
                                <option value="Ferrari" class="bg-gray-900">Scuderia Ferrari</option>
                                <option value="McLaren" class="bg-gray-900">McLaren F1 Team</option>
                                <option value="Aston Martin" class="bg-gray-900">Aston Martin Cognizant</option>
                                <option value="Alpine" class="bg-gray-900">BWT Alpine F1 Team</option>
                                <option value="Williams" class="bg-gray-900">Williams Racing</option>
                            </select>
                            <img src="../assets/icons/formula1Icon2.svg" alt="F1 Icon" class="absolute left-4 w-6 h-6 opacity-80">
                        </div>
                    </div>
                </div>

                <!-- Botones -->
                <div class="buttons mt-10 flex flex-col space-y-4">
                    <a id="saveBtn" class="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold rounded-lg shadow-lg text-xl uppercase tracking-wide transition-all duration-300">💾 Guardar Cambios</a>
                    <a id="logoutBtn" class="w-full py-4 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-lg shadow-md text-xl uppercase tracking-wide transition-all duration-300" href="../index.html" target="_blank">🚪 Cerrar Sesión</a>
                </div>

                <!-- Imagen de F1 de fondo con efecto degradado -->
                <div class="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-gray-900 to-transparent opacity-90"></div>
                <img src="https://media.contentapi.ea.com/content/dam/ea/sports/v2-2024/homepage/common/f1-23-keyart-1x1.jpg.adapt.crop16x9.652w.jpg" alt="F1 Background" class="image absolute bottom-0 left-0 w-full opacity-50 rounded-lg">
            </div>
        `;

        this.shadowRoot.querySelector("#saveBtn").addEventListener("click", () => {
            const newName = this.shadowRoot.querySelector("#username").value;
            const teamChoice = this.shadowRoot.querySelector("#team").value;

            if (newName.trim() !== "") {
                this.shadowRoot.querySelector("h1").textContent = `Perfil de ${newName}`;
            }

            this.dispatchEvent(new CustomEvent("nameChange", { detail: { name: newName, team: teamChoice } }));
        });

        this.shadowRoot.querySelector("#logoutBtn").addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("logout"));
        });
    }
}

customElements.define("user-config", UserConfig);
