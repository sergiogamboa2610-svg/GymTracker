# 📱 Gym Tracker Pro - Guía de Almacenamiento en la Nube

Este documento explica cómo configurar tu aplicación para guardar datos en un servidor en la nube.

## 🎯 Estado Actual

- ✅ **Almacenamiento Local**: Funciona con localStorage
- ✅ **Sincronización de Usuarios**: Se carga automáticamente al seleccionar
- ✅ **Exportar/Importar JSON**: Disponible en configuración
- 🔄 **Preparado para la nube**: Sistema modular listo para conectar

## 📡 Opciones de Servidor

### Opción 1: Firebase (Recomendado para principiantes)

**Ventajas**: Sin servidor que mantener, gratuito hasta cierto límite

**Pasos**:

1. Crea un proyecto en [firebase.google.com](https://firebase.google.com)
2. Habilita Firestore Database
3. Copia tu configuración de Firebase
4. Modifica `cloud-sync.js`:

```javascript
const CONFIG = {
  type: 'firebase', // ← Cambia a firebase
  firebaseConfig: {
    apiKey: 'tu-api-key',
    projectId: 'tu-project-id',
    storageBucket: 'tu-storage-bucket.appspot.com',
  },
  autoSync: true,
  syncInterval: 30000,
};
```

5. Descomenta la sección Firebase en `cloud-sync.js` (líneas ~110-127)
6. Añade a `index.html` antes que `cloud-sync.js`:

```html
<script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js"></script>
<script>
  firebase.initializeApp(window.CloudSync.CONFIG.firebaseConfig);
</script>
```

---

### Opción 2: Supabase (PostgreSQL en la nube)

**Ventajas**: Base de datos SQL real, bueno para aplicaciones grandes

**Pasos**:

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Crea tabla `users` con estructura:

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  age INTEGER,
  height INTEGER,
  weight REAL,
  goal TEXT,
  data JSONB, -- Para guardar progreso, tareas, comidas, rutinas
  updated_at TIMESTAMP DEFAULT NOW()
);
```

3. Modifica `cloud-sync.js`:

```javascript
const CONFIG = {
  type: 'supabase', // ← Cambia a supabase
  supabaseUrl: 'https://tu-proyecto.supabase.co',
  supabaseKey: 'tu-anon-key',
  autoSync: true,
};
```

4. Descomenta la sección Supabase en `cloud-sync.js` (líneas ~128-153)
5. Añade a `index.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"></script>
<script>
  const supabaseClient = supabase.createClient(
    window.CloudSync.CONFIG.supabaseUrl,
    window.CloudSync.CONFIG.supabaseKey
  );
  window.supabaseClient = supabaseClient;
</script>
```

---

### Opción 3: Tu Propio Servidor (Máximo Control)

**Ventajas**: Control total, privacidad garantizada

**Backend Node.js + Express** (ejemplo):

```javascript
// server.js
const express = require('express');
const app = express();
app.use(express.json());

let db = {}; // En producción: MongoDB, PostgreSQL, etc.

// Guardar datos de usuario
app.put('/api/users/:userId', (req, res) => {
  db[req.params.userId] = { ...req.body, updatedAt: new Date() };
  res.json({ success: true, message: 'Guardado en servidor' });
});

// Cargar datos de usuario
app.get('/api/users/:userId', (req, res) => {
  res.json(db[req.params.userId] || null);
});

app.listen(3000, () => console.log('Servidor en puerto 3000'));
```

**Modifica `cloud-sync.js`**:

```javascript
const CONFIG = {
  type: 'custom', // ← Cambia a custom
  apiUrl: 'https://tu-servidor.com/api', // Tu URL
  autoSync: true,
};
```

---

## 🔑 Estructura de Datos JSON

Los datos se guardan con esta estructura:

```json
{
  "id": "usuario-123",
  "name": "Sergio",
  "age": 30,
  "height": 175,
  "weight": 80,
  "goal": "Ganar músculo",
  "progress": [
    {
      "id": "prog-1",
      "date": "2026-09-01",
      "weight": 80,
      "muscle": 36,
      "fat": 22
    }
  ],
  "tasks": [
    {
      "id": "task-1",
      "title": "Tomar 2 litros de agua",
      "priority": "Alta",
      "doneDate": ""
    }
  ],
  "meals": [
    {
      "id": "meal-1",
      "date": "2026-09-01",
      "type": "Desayuno",
      "description": "Avena con plátano",
      "calories": 350,
      "protein": 15,
      "carbs": 45,
      "fat": 8
    }
  ],
  "workouts": [
    {
      "id": "workout-1",
      "date": "2026-09-01",
      "exercise": "Press banca",
      "muscle": "Pecho",
      "sets": 4,
      "reps": 10,
      "weight": 70,
      "done": false
    }
  ]
}
```

---

## 🔄 Flujo de Sincronización

```
┌─────────────────────────────────────┐
│  Usuario abre la aplicación        │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Carga datos de localStorage        │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Si hay internet y servidor:        │
│  Sincroniza con la nube            │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Renderiza aplicación              │
└─────────────────────────────────────┘
```

---

## 🛡️ Seguridad

### Autenticación

Cuando uses un servidor en la nube, añade autenticación:

```javascript
// En cloud-sync.js
function getToken() {
  return localStorage.getItem('authToken') || '';
}

// En app.js (después de login exitoso)
CloudSync.setToken(responseFromServer.token);
```

### Base de Datos

- **Firebase**: Usa reglas de seguridad (cada usuario solo ve sus datos)
- **Supabase**: Usa Row Level Security (RLS)
- **Servidor Propio**: Valida userId en cada petición

---

## 🚀 Pasos para Pasar a Producción

1. **Elige tu backend** (Firebase, Supabase o propio servidor)
2. **Configura credenciales** en `cloud-sync.js`
3. **Prueba en desarrollo** cambiando `CONFIG.type`
4. **Implementa autenticación de usuarios**
5. **Configura HTTPS** (obligatorio en producción)
6. **Haz backup regular** de tus datos
7. **Usa variables de entorno** para credenciales (no en el código)

---

## 📊 Ejemplo: Cargar datos al seleccionar usuario

```javascript
// En app.js, función selectUser()
async function selectUser(id) {
  currentUserId = id;
  
  // Cargar datos de la nube
  const userData = await CloudSync.loadUserData(id);
  
  if (userData) {
    // Mezclar con datos locales
    Object.assign(state.users.find(u => u.id === id), userData);
  }
  
  localStorage.setItem('gymTrackerProCurrentUser', id);
  renderAll();
}
```

---

## 🔧 Variables de Entorno (Producción)

Crea `.env` en la raíz:

```
FIREBASE_API_KEY=xxx
FIREBASE_PROJECT_ID=xxx
API_URL=https://tu-servidor.com/api
AUTH_TOKEN=xxx
```

Carga en `cloud-sync.js`:

```javascript
const CONFIG = {
  type: process.env.STORAGE_TYPE || 'local',
  apiUrl: process.env.API_URL || 'http://localhost:3000/api',
  firebaseConfig: {
    apiKey: process.env.FIREBASE_API_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
  },
};
```

---

## 💡 Soporte y Dudas

- **Firebase Docs**: https://firebase.google.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Ejemplos en GitHub**: Consulta repositorios similares

¡Tu aplicación ahora está lista para escalar! 🚀
