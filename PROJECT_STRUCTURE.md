# 📁 Estructura del Proyecto - Gym Tracker Pro

```
GymTracker/
├── 📄 index.html                          # Página principal (HTML)
│
├── 📁 css/
│   └── 📄 styles.css                      # Estilos de la aplicación
│
├── 📁 js/
│   ├── 📄 app.js                          # Lógica principal de la app
│   └── 📄 cloud-sync.js                   # ⭐ NUEVO: Sistema de sincronización en la nube
│
├── 📁 assets/
│   └── 📄 README.txt                      # Info de assets
│
├── 📄 package.json                        # ⭐ NUEVO: Dependencias npm
├── 📄 server-example.js                   # ⭐ NUEVO: Servidor Node.js/Express
│
├── 📚 DOCUMENTACIÓN:
│   ├── 📄 README.md                       # 📖 Documentación principal (ACTUALIZADO)
│   ├── 📄 QUICK_START.md                  # ⭐ NUEVO: Guía de 5 minutos
│   ├── 📄 CLOUD_STORAGE_SETUP.md          # ⭐ NUEVO: Guía completa de almacenamiento
│   ├── 📄 CHANGES_SUMMARY.md              # ⭐ NUEVO: Resumen de cambios
│   └── 📄 PROJECT_STRUCTURE.md            # ⭐ NUEVO: Este archivo
│
└── 📁 usuarios_data.json                  # (Generado automáticamente por server-example.js)
   └── Contiene datos de todos los usuarios
```

---

## 📊 Desglose de Componentes

### Frontend (Lo que ve el usuario)

```
index.html
│
├── CSS & Fonts
│   ├── Bootstrap 5.3.3
│   ├── Bootstrap Icons
│   ├── Google Fonts (Inter)
│   └── styles.css (custom)
│
├── JavaScript Modules
│   ├── js/app.js (Lógica de negocio)
│   └── js/cloud-sync.js (Almacenamiento)
│
└── HTML Sections
    ├── Login Screen
    │   ├── Usuario selector
    │   ├── Login button
    │   └── New user button
    │
    └── App Shell
        ├── Sidebar (Navigation)
        ├── Top Bar (Header)
        └── Views (5 vistas)
            ├── Dashboard
            ├── Tasks
            ├── Nutrition
            ├── Workouts
            └── Settings
```

### Backend (Opcional - Tu servidor)

```
server-example.js
│
├── Middleware
│   ├── CORS
│   ├── Body Parser
│   └── Error Handler
│
├── Endpoints
│   ├── GET /api/status
│   ├── GET /api/users/:userId
│   ├── PUT /api/users/:userId
│   ├── DELETE /api/users/:userId
│   ├── GET /api/users
│   ├── POST /api/backup
│   ├── POST /api/restore
│   └── POST /api/sync
│
├── Data Storage (JSON File)
│   └── users_data.json
│
└── Server Config
    ├── PORT: 3000
    ├── CORS: Habilitado
    └── Auto-reload: Con nodemon
```

### Almacenamiento (CloudSync)

```
js/cloud-sync.js
│
├── Configuration
│   ├── Type: local | custom | firebase | supabase
│   ├── API URL (para custom)
│   ├── Firebase Config
│   └── Supabase Config
│
├── Public API
│   ├── saveUserData(userId, data)
│   ├── loadUserData(userId)
│   ├── syncAll()
│   ├── getSyncStatus()
│   ├── setBackend(type)
│   ├── setToken(token)
│   └── getToken()
│
└── Backends Implementados
    ├── Local (localStorage)
    ├── Custom API (REST)
    ├── Firebase (Firestore)
    └── Supabase (PostgreSQL)
```

---

## 🔄 Flujo de Datos

### 1. Aplicación Abierta

```
Browser
  │
  ├─→ Load index.html
  │
  ├─→ Load css/styles.css
  │
  ├─→ Load js/cloud-sync.js
  │      │
  │      └─→ Initialize CONFIG
  │           ├─ type: 'local' (default)
  │           └─ autoSync: true
  │
  ├─→ Load js/app.js
  │      │
  │      └─→ App.init()
  │           ├─ Load state from localStorage
  │           ├─ If empty, seed with demo data
  │           ├─ Render login screen
  │           └─ If has current user, show app
  │
  └─→ User sees login screen or dashboard
```

### 2. Usuario Selecciona su Perfil

```
selectUser(userId)
  │
  ├─→ Set currentUserId
  │
  ├─→ Save to localStorage
  │
  ├─→ If CloudSync available:
  │   │
  │   └─→ loadUserData(userId)
  │       ├─ If type === 'local':
  │       │   └─→ Read from localStorage
  │       │
  │       ├─ If type === 'custom':
  │       │   └─→ GET /api/users/:userId
  │       │
  │       ├─ If type === 'firebase':
  │       │   └─→ Query Firestore
  │       │
  │       └─ If type === 'supabase':
  │           └─→ Query PostgreSQL
  │
  └─→ renderAll() with user data
```

### 3. Usuario Guarda Datos

```
User creates task/meal/workout/progress
  │
  └─→ addTask() / addMeal() / addWorkout() / addProgress()
       │
       ├─→ Add to state object
       │
       ├─→ saveState()
       │   │
       │   ├─→ localStorage.setItem() ✅
       │   │
       │   └─→ If CloudSync available:
       │       │
       │       └─→ CloudSync.saveUserData()
       │           ├─ If type === 'local': ✅ (already saved)
       │           ├─ If type === 'custom': PUT /api/users/:userId
       │           ├─ If type === 'firebase': doc.set()
       │           └─ If type === 'supabase': upsert()
       │
       └─→ renderAll()
```

---

## 💾 Estructura de Datos

### Estado Global (state)

```javascript
{
  users: [
    {
      id: "uuid-1",
      name: "Sergio",
      age: 30,
      height: 175,
      weight: 80,
      goal: "Ganar músculo"
    }
  ],
  
  progress: [
    {
      id: "uuid-p1",
      userId: "uuid-1",
      date: "2026-09-01",
      weight: 80,
      muscle: 36,
      fat: 22
    }
  ],
  
  tasks: [
    {
      id: "uuid-t1",
      userId: "uuid-1",
      title: "Tomar 2 litros de agua",
      priority: "Alta",
      doneDate: ""
    }
  ],
  
  meals: [
    {
      id: "uuid-m1",
      userId: "uuid-1",
      date: "2026-09-01",
      type: "Desayuno",
      description: "Avena con plátano",
      calories: 350,
      protein: 15,
      carbs: 45,
      fat: 8
    }
  ],
  
  workouts: [
    {
      id: "uuid-w1",
      userId: "uuid-1",
      date: "2026-09-01",
      exercise: "Press banca",
      muscle: "Pecho",
      sets: 4,
      reps: 10,
      weight: 70,
      done: false
    }
  ],
  
  settings: {
    theme: "dark"
  }
}
```

### LocalStorage Keys

```
localStorage.getItem('gymTrackerProDataV1')
  └─→ Complete state (JSON stringified)

localStorage.getItem('gymTrackerProCurrentUser')
  └─→ Current userId
```

### Servidor (users_data.json)

```json
{
  "uuid-1": {
    "id": "uuid-1",
    "name": "Sergio",
    "age": 30,
    "height": 175,
    "weight": 80,
    "goal": "Ganar músculo",
    "progress": [...],
    "tasks": [...],
    "meals": [...],
    "workouts": [...],
    "updatedAt": "2026-09-01T10:30:00Z"
  },
  "uuid-2": { ... }
}
```

---

## 🔐 Niveles de Almacenamiento

### Nivel 1: LocalStorage (Siempre)
- Ubicación: Browser
- Persistencia: Por navegador/dispositivo
- Encriptación: No
- Acceso offline: ✅

### Nivel 2A: Servidor Personalizado
- Ubicación: Tu servidor (Node.js)
- Base de datos: JSON file o BD real
- Persistencia: Por usuario
- Sincronización: Automática
- Escalabilidad: Limitada

### Nivel 2B: Firebase
- Ubicación: Google Cloud
- Base de datos: Firestore
- Persistencia: Por usuario
- Sincronización: Automática
- Escalabilidad: Automática

### Nivel 2C: Supabase
- Ubicación: Servidor Supabase
- Base de datos: PostgreSQL
- Persistencia: Por usuario
- Sincronización: Automática
- Escalabilidad: Configurable

---

## 🚀 Opciones de Despliegue

### Desarrollo Local
```
open index.html → Browser → Funciona ✅
```

### Servidor Local
```
npm install && node server-example.js
→ http://localhost:3000
→ Configura CloudSync
→ Funciona ✅
```

### GitHub Pages (Solo Frontend)
```
Push a GitHub → GitHub Pages → Funciona con localStorage ✅
→ Sin sincronización en la nube (necesitas servidor externo)
```

### Servidor en la Nube (Recomendado)
```
Frontend → GitHub Pages
Backend → Heroku, Railway, Fly.io, DigitalOcean, etc.
DB → MongoDB Atlas, PostgreSQL, Firebase, etc.
→ Sincronización completa ✅
```

---

## 📈 Escalabilidad

### Fase 1: MVP (Actual)
```
✅ LocalStorage funciona
✅ Multi-usuario local
✅ Exportar/Importar JSON
```

### Fase 2: Servidor Propio
```
✅ Servidor Node.js
✅ Datos en múltiples dispositivos
✅ API REST
```

### Fase 3: Base de Datos Real
```
✅ MongoDB, PostgreSQL, etc.
✅ Backups automáticos
✅ Escalabilidad ilimitada
```

### Fase 4: Producción
```
✅ Autenticación de usuarios
✅ Encriptación
✅ SSL/HTTPS
✅ Rate limiting
✅ Monitoreo
```

---

## 🔧 Tecnologías por Componente

| Componente | Tecnología |
|-----------|-----------|
| Frontend | HTML5 + CSS3 + Vanilla JS |
| Estilos | Bootstrap 5.3 + Custom CSS |
| Gráficos | Chart.js 4.4.1 |
| Iconos | Bootstrap Icons |
| Almacenamiento Local | localStorage API |
| Almacenamiento Remoto | CloudSync (modular) |
| Servidor Backend | Node.js + Express |
| API | REST |
| Nube Profesional | Firebase o Supabase |
| Versionado | Git |
| Hosting Frontend | GitHub Pages |

---

¡Tu aplicación está lista para crecer! 🚀
