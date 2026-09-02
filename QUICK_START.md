# 🚀 Guía Rápida - Almacenamiento en la Nube

## ¿Qué se añadió?

Tu aplicación ahora tiene **3 nuevos archivos** listos para sincronizar datos con un servidor:

| Archivo | Propósito |
|---------|-----------|
| `js/cloud-sync.js` | Sistema de sincronización (Firebase, Supabase, API personalizada) |
| `server-example.js` | Servidor Node.js de ejemplo |
| `CLOUD_STORAGE_SETUP.md` | Documentación completa |
| `package.json` | Dependencias del servidor |

---

## 🎯 Opción 1: Usar LocalStorage (Ya funciona)

**Sin hacer nada**, tu app ya guarda datos localmente y se cargan automáticamente.

```javascript
// Los datos se guardan automáticamente en localStorage
// Al seleccionar un usuario, se cargan sus datos
```

✅ **Ventaja**: Sin servidor, funciona offline
❌ **Desventaja**: Solo en este dispositivo/navegador

---

## 🎯 Opción 2: Usar Tu Propio Servidor

### Paso 1: Instalar Node.js
Descarga de [nodejs.org](https://nodejs.org)

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Ejecutar servidor
```bash
node server-example.js
```

Verás:
```
╔════════════════════════════════════════╗
║     Gym Tracker API Server Activo      ║
║     http://localhost:3000              ║
╚════════════════════════════════════════╝
```

### Paso 4: Activar en la app
Abre `js/cloud-sync.js` y cambia:

```javascript
const CONFIG = {
  type: 'custom',  // ← Cambiar a 'custom'
  apiUrl: 'http://localhost:3000/api',  // ← Tu servidor
  autoSync: true,
};
```

### Paso 5: Probar
1. Abre `index.html` en el navegador
2. Crea un usuario
3. Los datos se guardarán en el servidor
4. Cierra y abre el navegador
5. ✅ Los datos se cargarán automáticamente

---

## 🎯 Opción 3: Usar Firebase (Nube profesional)

### Paso 1: Crear proyecto Firebase
1. Ve a [firebase.google.com](https://firebase.google.com)
2. Haz clic en "Comenzar"
3. Crea nuevo proyecto

### Paso 2: Obtener credenciales
1. Copia tu `apiKey` y `projectId`
2. Abre `js/cloud-sync.js`

```javascript
const CONFIG = {
  type: 'firebase',  // ← Cambiar a 'firebase'
  firebaseConfig: {
    apiKey: 'TU_API_KEY_AQUI',
    projectId: 'TU_PROJECT_ID_AQUI',
  },
};
```



### Paso 3: Descomentar código Firebase
En `cloud-sync.js`, descomenta las líneas ~110-127:

```javascript
async function saveToFirebase(userId, userData) {
  try {
    const db = firebase.firestore();
    // ... resto del código
```

### Paso 4: Agregar scripts a index.html
Antes de `<script src="js/cloud-sync.js">`, añade:

```html
<script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js"></script>
<script>
  firebase.initializeApp({
    apiKey: 'TU_API_KEY',
    projectId: 'TU_PROJECT_ID',
  });
</script>
```

---

## 📊 Estructura de Datos

Los datos se guardan así:

```json
{
  "id": "usuario-123",
  "name": "Sergio",
  "progress": [...],
  "tasks": [...],
  "meals": [...],
  "workouts": [...]
}
```

---

## 🔄 Cómo Funciona

### Sin servidor (LocalStorage)
```
Usuario abre → Carga localStorage → Muestra datos
```

### Con servidor
```
Usuario abre → Carga localStorage → Sincroniza con servidor → Actualiza datos
```

El servidor solo se usa cuando:
- ✅ Hay conexión a internet
- ✅ `CloudSync.CONFIG.autoSync = true`
- ✅ `CloudSync.CONFIG.type !== 'local'`

Si no hay conexión, funciona con localStorage automáticamente.

---

## 🛠️ Comandos Útiles

### Inicia tu servidor
```bash
node server-example.js
```

### Usa Nodemon (reinicia automáticamente)
```bash
npx nodemon server-example.js
```

### Ver datos guardados
```bash
cat users_data.json  # Linux/Mac
type users_data.json  # Windows
```

### Hacer backup
El servidor tiene endpoint: `POST /api/backup`

---

## ✅ Checklist de Implementación

- [ ] Decidiste qué tipo de almacenamiento usar
- [ ] Modificaste `CONFIG` en `cloud-sync.js`
- [ ] (Opcional) Instalaste Node.js y corriste el servidor
- [ ] (Opcional) Configuraste Firebase/Supabase
- [ ] Probaste crear un usuario
- [ ] Probaste cerrar y reabrirte a verificar que se cargan datos

---

## 🆘 Solución de Problemas

### "Error: Cannot find module 'express'"
```bash
npm install express cors body-parser
```

### "Refused to connect to localhost:3000"
- Asegúrate que el servidor esté corriendo
- Verifica que `apiUrl` en `cloud-sync.js` sea correcto

### "CORS error"
- El servidor ya tiene `cors` habilitado
- Si usas otro servidor, añade:
```javascript
app.use(cors());
```

### Firebase no funciona
- Verifica que `firebaseConfig` tenga `apiKey` y `projectId` correctos
- Revisa la consola del navegador (F12)

---

## 📚 Documentación Completa

Lee `CLOUD_STORAGE_SETUP.md` para:
- Configurar Supabase
- Crear tu propio servidor con BD real
- Seguridad y autenticación
- Variables de entorno
- Ejemplos avanzados

---

## 🎓 Siguientes Pasos

1. **Autenticación**: Implementar login con contraseña
2. **Encriptación**: Proteger datos sensibles
3. **Respaldos**: Automatizar backups diarios
4. **Compartir**: Permitir que usuarios compartan rutinas
5. **Estadísticas**: Gráficos avanzados de progreso

¡Tu app está lista para escalar! 🚀
