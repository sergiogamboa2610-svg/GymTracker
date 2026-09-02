/**
 * SERVIDOR EJEMPLO - Gym Tracker API
 * 
 * Usa: Node.js + Express
 * Instalación: npm init -y && npm install express cors body-parser
 * Ejecutar: node server.js
 * 
 * Este es un ejemplo simple para desarrollo local.
 * Para producción, usa una base de datos real (MongoDB, PostgreSQL, etc.)
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Archivo para almacenar datos (en producción: usa una BD real)
const DATA_FILE = path.join(__dirname, 'users_data.json');

// Función para leer datos
function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

// Función para guardar datos
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ============ RUTAS ============

/**
 * GET /api/status
 * Verifica que el servidor esté activo
 */
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'Gym Tracker API está activa',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/users/:userId
 * Obtiene datos de un usuario específico
 */
app.get('/api/users/:userId', (req, res) => {
  try {
    const data = readData();
    const userData = data[req.params.userId];
    
    if (!userData) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado',
        userId: req.params.userId 
      });
    }
    
    res.json({ success: true, data: userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/users/:userId
 * Guarda o actualiza datos de un usuario
 */
app.put('/api/users/:userId', (req, res) => {
  try {
    const data = readData();
    const userId = req.params.userId;
    
    // Guardar datos del usuario
    data[userId] = {
      ...data[userId],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    saveData(data);
    
    res.json({ 
      success: true, 
      message: 'Datos guardados correctamente',
      userId: userId,
      data: data[userId]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/users/:userId
 * Elimina todos los datos de un usuario
 */
app.delete('/api/users/:userId', (req, res) => {
  try {
    const data = readData();
    delete data[req.params.userId];
    saveData(data);
    
    res.json({ 
      success: true, 
      message: 'Usuario eliminado',
      userId: req.params.userId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/users
 * Lista todos los usuarios (solo IDs, sin datos sensibles)
 */
app.get('/api/users', (req, res) => {
  try {
    const data = readData();
    const userIds = Object.keys(data);
    
    res.json({ 
      success: true, 
      count: userIds.length,
      users: userIds
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/backup
 * Descarga backup completo
 */
app.post('/api/backup', (req, res) => {
  try {
    const data = readData();
    res.json({ 
      success: true,
      backup: data,
      timestamp: new Date().toISOString(),
      totalUsers: Object.keys(data).length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/restore
 * Restaura backup completo
 */
app.post('/api/restore', (req, res) => {
  try {
    const { backup } = req.body;
    
    if (!backup || typeof backup !== 'object') {
      return res.status(400).json({ error: 'Backup inválido' });
    }
    
    saveData(backup);
    
    res.json({ 
      success: true,
      message: 'Backup restaurado',
      totalUsers: Object.keys(backup).length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/sync
 * Sincroniza datos de múltiples usuarios
 */
app.post('/api/sync', (req, res) => {
  try {
    const { updates } = req.body; // Array de {userId, data}
    
    if (!Array.isArray(updates)) {
      return res.status(400).json({ error: 'Formato inválido' });
    }
    
    const data = readData();
    const results = [];
    
    updates.forEach(update => {
      const { userId, payload } = update;
      data[userId] = {
        ...data[userId],
        ...payload,
        updatedAt: new Date().toISOString()
      };
      results.push({ userId, success: true });
    });
    
    saveData(data);
    
    res.json({ 
      success: true,
      synced: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ MANEJO DE ERRORES ============

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ============ INICIAR SERVIDOR ============

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║     Gym Tracker API Server Activo      ║
  ║     http://localhost:${PORT}              ║
  ╚════════════════════════════════════════╝
  
  Endpoints disponibles:
  - GET  /api/status           → Estado del servidor
  - GET  /api/users/:userId    → Obtener datos de usuario
  - PUT  /api/users/:userId    → Guardar datos de usuario
  - GET  /api/users            → Listar todos los usuarios
  - DELETE /api/users/:userId  → Eliminar usuario
  - POST /api/backup           → Descargar backup completo
  - POST /api/restore          → Restaurar backup completo
  - POST /api/sync             → Sincronizar múltiples usuarios
  
  Archivo de datos: ${DATA_FILE}
  `);
});

module.exports = app;
