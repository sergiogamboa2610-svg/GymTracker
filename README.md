# 💪 Gym Tracker Pro

Aplicación web profesional para seguimiento de progreso físico, tareas, nutrición y rutinas de ejercicio con **almacenamiento en la nube y sincronización automática**.

## ✨ Características

### 📊 Seguimiento de Progreso
- Peso, masa muscular, grasa corporal e IMC
- Gráficos interactivos en tiempo real
- Histórico de cambios

### 📋 Gestión de Tareas
- Checklist diario que se reinicia automáticamente
- 3 niveles de prioridad (Alta, Media, Baja)
- Marcar como completadas

### 🍽️ Registro de Nutrición
- 5 comidas por día (Desayuno, Meriendas AM/PM, Almuerzo, Cena)
- Macronutrientes (Proteína, Carbohidratos, Grasa)
- Calorías totales diarias

### 💪 Rutinas de Ejercicio
- Ejercicios por fecha
- Detalles: Grupo muscular, Series, Repeticiones, Peso
- Marcar ejercicios como completados

### ☁️ Almacenamiento en la Nube
- **LocalStorage**: Almacenamiento local (ya incluido)
- **Servidor Personalizado**: Node.js + Express
- **Firebase**: Nube profesional de Google
- **Supabase**: PostgreSQL en la nube
- **Sincronización automática**: Los cambios se guardan en tiempo real

### 👥 Multi-Usuario
- Crear múltiples perfiles
- Datos separados por usuario
- Cambiar de usuario fácilmente

### 🎨 Interfaz Moderna
- Diseño tipo SaaS
- Modo oscuro y claro
- Responsive (mobile-friendly)
- Tema glassmorphism

### 💾 Respaldos
- Exportar datos como JSON
- Importar respaldos anteriores
- Backup automático en la nube (si está configurada)

## 🚀 Inicio Rápido

### 1. Abrir localmente
```bash
# Opción A: Abrir archivo directamente
Haz doble clic en index.html

# Opción B: Con servidor local (recomendado)
npx serve .
```

### 2. Almacenamiento en la nube (Opcional)

**Lee estos archivos:**
- **`QUICK_START.md`** - Guía rápida de 5 minutos
- **`CLOUD_STORAGE_SETUP.md`** - Documentación completa

**3 opciones:**

#### A) LocalStorage (Sin servidor) ✅
Ya funciona. Los datos se guardan en tu navegador.

#### B) Servidor Propio
```bash
npm install
node server-example.js
```

Luego en `js/cloud-sync.js`:
```javascript
const CONFIG = {
  type: 'custom',
  apiUrl: 'http://localhost:3000/api',
};
```

#### C) Firebase o Supabase
Ver `CLOUD_STORAGE_SETUP.md` para instrucciones completas.

## 📁 Estructura del Proyecto

```
gym-tracker-pro/
├── index.html                    # Página principal
├── css/
│   └── styles.css               # Estilos completos
├── js/
│   ├── app.js                   # Lógica de la app
│   └── cloud-sync.js            # Sistema de sincronización ⭐ NUEVO
├── assets/
│   └── README.txt               # Assets info
├── server-example.js            # Servidor Node.js ejemplo ⭐ NUEVO
├── package.json                 # Dependencias npm ⭐ NUEVO
├── QUICK_START.md               # Guía rápida ⭐ NUEVO
├── CLOUD_STORAGE_SETUP.md       # Documentación ⭐ NUEVO
└── README.md                    # Este archivo
```

## 🔄 Cómo Funciona el Almacenamiento

### Flujo Local
```
Usuario crea datos → Guarda en localStorage → Datos persisten en navegador
```

### Flujo con Servidor
```
Usuario crea datos → Guarda en localStorage → Sincroniza con servidor
                  ↓                        ↓
           Funciona offline          Disponible en otros dispositivos
```

## 🛠️ Tecnologías Usadas

### Frontend
- HTML5 + CSS3 + JavaScript (Vanilla)
- Bootstrap 5.3.3
- Chart.js 4.4.1
- Bootstrap Icons

### Almacenamiento
- LocalStorage (Local)
- Firebase Firestore (Nube profesional)
- Supabase PostgreSQL (Nube SQL)
- Servidor Node.js/Express (Personalizado)

### Backend (Opcional)
- Node.js
- Express.js
- CORS
- Body-parser

## 📱 Compatibilidad

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 📊 Estructura de Datos

Cada usuario tiene:

```json
{
  "id": "uuid",
  "name": "Usuario",
  "age": 30,
  "height": 175,
  "weight": 80,
  "goal": "Ganar músculo",
  "progress": [...],
  "tasks": [...],
  "meals": [...],
  "workouts": [...]
}
```

## 🌐 Publicar en GitHub Pages

1. Crea repo: `gym-tracker-pro`
2. Sube los archivos
3. Configura GitHub Pages: Settings → Pages → Source: main
4. ✅ URL: `https://usuario.github.io/gym-tracker-pro`

## 🔐 Privacidad y Seguridad

- **LocalStorage**: Datos solo en tu dispositivo
- **Servidor Personalizado**: Datos bajo tu control
- **Firebase/Supabase**: Encriptados en tránsito, HTTPS obligatorio
- **Autenticación**: Implementa según tu backend

## 📚 Documentación

| Archivo | Contenido |
|---------|-----------|
| `QUICK_START.md` | Guía de 5 minutos para empezar |
| `CLOUD_STORAGE_SETUP.md` | Configuración completa de backends |
| `server-example.js` | Código servidor de ejemplo |
| `js/cloud-sync.js` | Sistema de sincronización modular |

## 🐛 Solución de Problemas

**P: ¿Cómo borro todos mis datos?**
R: Settings → Limpiar usuario actual (o elimina el usuario)

**P: ¿Funciona sin internet?**
R: Sí, LocalStorage funciona offline. Subirá a la nube cuando hay conexión.

**P: ¿Puedo usar otro servidor?**
R: Sí, modifica `cloud-sync.js` y sigue el patrón `saveToCustomAPI` y `loadFromCustomAPI`

**P: ¿Es seguro?**
R: LocalStorage está en tu navegador. Para producción, usa autenticación y HTTPS.

## 🎯 Hoja de Ruta (Futuro)

- [ ] Autenticación con contraseña
- [ ] Compartir rutinas entre usuarios
- [ ] Estadísticas avanzadas
- [ ] Gráficos PDF
- [ ] App nativa (React Native)
- [ ] Notificaciones push

## 📄 Licencia

MIT - Libre para usar y modificar

## 👨‍💻 Desarrollador

Creado con ❤️ para el fitness

---

**¿Necesitas ayuda?** Lee `QUICK_START.md` o `CLOUD_STORAGE_SETUP.md`

**¿Quieres contribuir?** ¡Abre un pull request!
2. Sube el contenido del proyecto a la rama `main`.
3. Ve a `Settings` > `Pages`.
4. En `Build and deployment`, selecciona:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Guarda los cambios.
6. GitHub generará la URL pública del sitio.

## Notas importantes

- Los datos se guardan en el navegador usando LocalStorage.
- No requiere backend ni base de datos.
- Si se abre en otro navegador o dispositivo, los datos no se sincronizan automáticamente.
- Para respaldar o mover los datos, usa la opción de exportar/importar JSON.

## Mejoras futuras sugeridas

- Migrar a React + TypeScript
- Agregar Firebase para sincronización real entre dispositivos
- Agregar autenticación real
- Agregar reportes PDF
- Agregar calendario de entrenamiento
- Agregar plantillas de rutinas
