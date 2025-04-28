# 🏎️ Simulador Interactivo de Fórmula 1  🏎️

## 📖 Introducción

La Fórmula 1 combina velocidad, estrategia y tecnología de vanguardia, generando una experiencia emocionante tanto para los espectadores como para los equipos involucrados.
 Este proyecto busca desarrollar una **simulación interactiva de Fórmula 1** basada en tecnologías web modernas, permitiendo a los usuarios **gestionar y personalizar su experiencia de carrera** mediante un sistema dinámico de administración de **circuitos, pilotos y vehículos**.

La aplicación se construirá usando **HTML**, **JavaScript**, **Web Components**, **CSS** y un **backend en Node.js + Express** para manejar APIs, persistencia y comunicación de datos.

------

## 🎯 Objetivos del Proyecto

- 🏁 **Administrar circuitos**: Agregar, editar, eliminar y buscar pistas.
- 🧑‍✈️ **Gestionar pilotos y vehículos**: Definir atributos personalizados.
- 🌦️ **Configurar simulaciones**: Ajustar condiciones climáticas y estrategias.
- 🎨 **Visualizar carreras**: Renderizado en tiempo real con **Canvas API** o **WebGL**.
- 💾 **Persistir información**: Usando **MongoDB**, **MySQL**, **IndexedDB** y/o **LocalStorage**.

------

## 🛠️ Tecnologías Utilizadas

### 🖥️ Frontend

- HTML5 + CSS3 (con Bootstrap o Tailwind CSS si es indicado)
- JavaScript (ES6+)
- Web Components (Lit o Vanilla JS)
- Canvas API / WebGL

### ⚙️ Backend

- Node.js
- Express.js
- Patrón MVC (Modelo - Vista - Controlador)

### 🗄️ Bases de Datos

- MongoDB (Pilotos, configuraciones, noticias)
- MySQL (Circuitos y vehículos)

### 💻 Almacenamiento en Navegador

- IndexedDB (soporte offline)

### 🌐 APIs Externas

- F1 API (datos en tiempo real de la Fórmula 1)
- F1DB (información técnica de autos)
- NewsData.io (noticias relevantes de Fórmula 1)

------

## 📦 Requerimientos de Entrega

- 📂 Crear un repositorio por equipo de trabajo.
- ✅ Utilizar **Conventional Commit** en los mensajes de commit.
- 📜 Generar un **README** detallado como este.
- 📱 Proyecto **100% Responsive** en todas las vistas (móvil, tablet, desktop).

------

## 🗂️ Estructura de Datos

```
jsonCopiarEditar// Ejemplo de Circuito
{
  "nombre": "Circuit de Monaco",
  "ubicacion": "Monte Carlo",
  "distancia_km": 3.337,
  "condiciones_pista": "Asfalto seco"
}
jsonCopiarEditar// Ejemplo de Piloto
{
  "nombre": "Max Verstappen",
  "equipo": "Red Bull Racing",
  "experiencia": "Avanzado",
  "habilidades": {
    "velocidad": 95,
    "aceleracion": 92,
    "resistencia_neumaticos": 88
  }
}
jsonCopiarEditar// Ejemplo de Vehículo
{
  "modelo": "RB20",
  "velocidad_maxima_kmh": 350,
  "aceleracion_0_100": "2.6s",
  "consumo_neumaticos": "Moderado"
}
```

------

# 🧠 Patrón de Diseño 

## 🖥️ Backend: **Modelo-Vista-Controlador (MVC)**

- **Modelos**: Estructura de datos de pilotos, vehículos, circuitos, noticias.
- **Vistas**: Respuestas de las APIs REST.
- **Controladores**: Lógica de negocio conectada a la base de datos.
- **Rutas**: Organización por entidad (`/api/circuitos`, `/api/pilotos`, etc).

## 🕹️ Frontend: **Publicador/Suscriptor (Pub/Sub)**

- **Broker Central** (`f1-simulator-app`) maneja los eventos globales.
- **Publicadores**: Componentes que emiten eventos (circuitos, pilotos, vehículos).
- **Suscriptores**: Componentes que escuchan eventos (carreras animadas, noticias).

------

## 📂 Estructura de Carpetas Final Optimizada

```
csharpCopiarEditarf1-simulator/
├── assets/
│   ├── icons/          # Iconos SVG (banderas, autos, etc.)
│   ├── images/         # Imágenes optimizadas
│   └── fonts/          # Fuentes personalizadas
├── src/
│   ├── components/     
│   │   ├── f1-simulator-app/    # Broker central (gestiona eventos)
│   │   ├── circuit-manager/     # Gestión de circuitos
│   │   ├── pilot-manager/       # Gestión de pilotos
│   │   ├── vehicle-manager/     # Gestión de vehículos
│   │   ├── race-visualizer/     # Animaciones Canvas/WebGL
│   │   └── news-section/        # Noticias F1
│   ├── data/         
│   ├── events/        
│   ├── utils/         
│   └── index.js                 
├── styles/
│   ├── variables.css
|   ├── style.css
│   └── components/              
├── server/
│   ├── controllers/             
│   ├── models/                  
│   ├── routes/                  
│   ├── services/                
│   ├── config/                  
│   └── app.js                   
├── package.json                 # Scripts y dependencias
├── index.html                   
└── README.md
```

------

# 🚀 Diseño Base

Para lograr una experiencia visual moderna, interactiva y adaptable, el proyecto se inspira en los siguientes **cuatro** diseños de Figma:



| Diseño                          | Descripción                                                  | Link                                                         |
| ------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 📱 **iOS 18 Design & Prototype** | Inspiración en diseño móvil moderno para fluidez en la interfaz de usuario. | [Ver diseño](https://www.figma.com/design/wp8pjI4WtdXECwp5egiyft/Design-and-Prototype-iOS-18--Community---Community-?node-id=1204-4997&t=0QSqNKJPfjeF5N9r-0) |
| 🏆 **Leaderboard Daily UI**      | Gestión de tablas de posiciones y resultados competitivos.   | [Ver diseño](https://www.figma.com/design/RJRrgsAYgSzdFHyij3CQl0/-78-Leaderborad-Dail-UI--Community-?node-id=0-1&p=f&t=SZPtqAjv4zUuXRKB-0) |
| 🚗 **Car Rent Project**          | Presentación limpia y detallada de vehículos y características. | [Ver diseño](https://www.figma.com/design/5Lof0wkHQ09WfMFY2YZiaf/Car-rent-project--Community-?node-id=0-1&p=f&t=wJ8xaeuIlo9GtyYZ-0) |
| 🏁 **PitStop Community**         | Integración de datos técnicos y dinámicos para carreras y estrategias. | [Ver diseño](https://www.figma.com/design/fNyvLJeMRtGLDHtuyJhKTy/PitStop--Community-?node-id=5-590&t=J2vpbxpwtT6BwXDp-0) |



# 🎯 Conclusión

Con esta arquitectura híbrida **(MVC en el backend + Pub/Sub en el frontend)** y una inspiración en prototipos profesionales de Figma, el simulador garantiza:

- ⚙️ **Modularidad**: Componentes reutilizables.
- 📈 **Escalabilidad**: Sólido crecimiento a futuro.
- 🎨 **Consistencia visual**: UX/UI coherente y atractiva.
- 💻 **Responsividad total**: Experiencia perfecta en todos los dispositivos.

------

# 👥 Contribuyentes



| Rol                        | Nombre                                            | Perfil |
| -------------------------- | ------------------------------------------------- | ------ |
| 👨‍💻 Desarrollador Principal | [kevincito0987](https://github.com/kevincito0987) | 🔗      |

------



# ✨ Frase Estelar Final

> ✨ *"En cada curva, cada estrategia y cada línea de código... construimos la velocidad del futuro."* 🏎️⚡