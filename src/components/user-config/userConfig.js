class UserConfig extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
            <div class="flex">
                <aside class="w-64 bg-blue-800 text-white h-screen p-5">
                    <h2 class="text-xl font-bold mb-4">Configuración</h2>
                    <ul>
                        <li class="mb-3"><a href="#" class="hover:underline">Perfil</a></li>
                        <li class="mb-3"><a href="#" class="hover:underline">Preferencias</a></li>
                        <li class="mb-3"><a href="#" class="hover:underline">Seguridad</a></li>
                        <li class="mb-3"><a href="#" class="hover:underline">Roles y permisos</a></li>
                    </ul>
                </aside>
                <main class="flex-1 p-6">
                    <div class="bg-white p-6 rounded-lg shadow">
                        <h1 class="text-2xl font-bold mb-4">Panel de Configuración</h1>
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">Cambiar Nombre:</label>
                        <input type="text" id="username" class="border rounded p-2 w-full mb-4" placeholder="Nuevo nombre">
                        <button id="saveBtn" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mb-2">
                            Guardar Cambios
                        </button>
                        <button id="logoutBtn" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full">
                            Cerrar Sesión
                        </button>
                    </div>
                </main>
            </div>
        `;

        this.shadowRoot.querySelector('#saveBtn').addEventListener('click', () => {
            const newName = this.shadowRoot.querySelector('#username').value;
            this.dispatchEvent(new CustomEvent('nameChange', { detail: newName }));
        });

        this.shadowRoot.querySelector('#logoutBtn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('logout'));
        });
    }
}

customElements.define('user-config', UserConfig);
