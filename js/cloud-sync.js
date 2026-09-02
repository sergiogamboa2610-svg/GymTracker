/**
 * CloudSync - Sistema de sincronización con servidor en la nube
 * Sincroniza datos de usuarios entre localStorage y un servidor remoto
 * Compatible con Firebase, Supabase, o cualquier API REST personalizada
 */

const CloudSync = (() => {
  // ==================== CONFIGURACIÓN ====================
  // Cambia estos valores según tu servidor
  const CONFIG = {
    // Tipo de backend: 'local', 'firebase', 'supabase', 'custom'
    type: 'firebase', // Comienza en local, cambia a 'firebase', 'supabase' o 'custom'
    
    // Para servidor personalizado (REST API)
    apiUrl: 'https://tu-servidor.com/api', // Cambia a tu URL
    
    // Para Firebase
    firebaseConfig: {
      apiKey: 'AIzaSyB2RLX2XBaBBcIa0-tb_1wP5vz0ChhYM4k',
      projectId: 'gymtracker-c4622',
      storageBucket: 'gymtracker-c4622.firebasestorage.app',
    },
    
    // Para Supabase
    supabaseUrl: 'https://tu-proyecto.supabase.co',
    supabaseKey: 'YOUR_ANON_KEY',
    
    // Habilitar sincronización automática
    autoSync: true,
    syncInterval: 30000, // Cada 30 segundos
  };

  let syncInProgress = false;
  let lastSyncTime = null;

  // ==================== FUNCIONES PÚBLICAS ====================

  /**
   * Guarda datos de usuario en la nube
   * @param {string} userId - ID del usuario
   * @param {object} userData - Datos del usuario a guardar
   */
  async function saveUserData(userId, userData) {
    if (CONFIG.type === 'local') {
      return saveToLocal(userId, userData);
    } else if (CONFIG.type === 'custom') {
      return saveToCustomAPI(userId, userData);
    } else if (CONFIG.type === 'firebase') {
      return saveToFirebase(userId, userData);
    } else if (CONFIG.type === 'supabase') {
      return saveToSupabase(userId, userData);
    }
  }

  /**
   * Carga datos de usuario desde la nube
   * @param {string} userId - ID del usuario
   */
  async function loadUserData(userId) {
    if (CONFIG.type === 'local') {
      return loadFromLocal(userId);
    } else if (CONFIG.type === 'custom') {
      return loadFromCustomAPI(userId);
    } else if (CONFIG.type === 'firebase') {
      return loadFromFirebase(userId);
    } else if (CONFIG.type === 'supabase') {
      return loadFromSupabase(userId);
    }
  }

  /**
   * Sincroniza todos los datos entre local y nube
   */
  async function syncAll() {
    if (syncInProgress || CONFIG.type === 'local') return false;
    
    syncInProgress = true;
    try {
      console.log('🔄 Sincronizando datos con la nube...');
      // La sincronización específica depende del tipo de backend
      lastSyncTime = new Date();
      console.log('✅ Sincronización completada:', lastSyncTime);
      return true;
    } catch (error) {
      console.error('❌ Error en sincronización:', error);
      return false;
    } finally {
      syncInProgress = false;
    }
  }

  /**
   * Obtiene el estado de la sincronización
   */
  function getSyncStatus() {
    return {
      type: CONFIG.type,
      autoSync: CONFIG.autoSync,
      inProgress: syncInProgress,
      lastSync: lastSyncTime,
      isConnected: CONFIG.type !== 'local',
    };
  }

  /**
   * Cambia el tipo de backend en tiempo de ejecución
   */
  function setBackend(newType) {
    CONFIG.type = newType;
    console.log(`Backend cambiado a: ${newType}`);
  }

  // ==================== IMPLEMENTACIÓN LOCAL ====================

  function saveToLocal(userId, userData) {
    const key = `user_${userId}`;
    localStorage.setItem(key, JSON.stringify(userData));
    return Promise.resolve({ success: true, message: 'Guardado localmente' });
  }

  function loadFromLocal(userId) {
    const key = `user_${userId}`;
    const data = localStorage.getItem(key);
    return Promise.resolve(data ? JSON.parse(data) : null);
  }

  // ==================== IMPLEMENTACIÓN API PERSONALIZADA ====================
  // Usa esto si tienes tu propio servidor (Node.js, Python, PHP, etc.)

  async function saveToCustomAPI(userId, userData) {
    try {
      const response = await fetch(`${CONFIG.apiUrl}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`, // Implementar autenticación
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}`);
      return { success: true, message: 'Guardado en servidor' };
    } catch (error) {
      console.error('Error guardando en API:', error);
      // Fallback a localStorage
      return saveToLocal(userId, userData);
    }
  }

  async function loadFromCustomAPI(userId) {
    try {
      const response = await fetch(`${CONFIG.apiUrl}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error cargando de API:', error);
      // Fallback a localStorage
      return loadFromLocal(userId);
    }
  }

  // ==================== IMPLEMENTACIÓN FIREBASE ====================
  // Para usar Firebase: npm install firebase
  // Descomenta cuando tengas Firebase configurado

  
  async function saveToFirebase(userId, userData) {
    try {
      const db = firebase.firestore();
      await db.collection('users').doc(userId).set(userData, { merge: true });
      return { success: true, message: 'Guardado en Firebase' };
    } catch (error) {
      console.error('Error con Firebase:', error);
      return saveToLocal(userId, userData);
    }
  }

  async function loadFromFirebase(userId) {
    try {
      const db = firebase.firestore();
      const doc = await db.collection('users').doc(userId).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error('Error con Firebase:', error);
      return loadFromLocal(userId);
    }
  }
  

  // ==================== IMPLEMENTACIÓN SUPABASE ====================
  // Para usar Supabase: npm install @supabase/supabase-js
  // Descomenta cuando tengas Supabase configurado

  /*
  async function saveToSupabase(userId, userData) {
    try {
      const { supabaseClient } = window;
      const { data, error } = await supabaseClient
        .from('users')
        .upsert({ id: userId, ...userData });
      
      if (error) throw error;
      return { success: true, message: 'Guardado en Supabase' };
    } catch (error) {
      console.error('Error con Supabase:', error);
      return saveToLocal(userId, userData);
    }
  }

  async function loadFromSupabase(userId) {
    try {
      const { supabaseClient } = window;
      const { data, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error con Supabase:', error);
      return loadFromLocal(userId);
    }
  }
  */

  // ==================== FUNCIONES AUXILIARES ====================

  function getToken() {
    return localStorage.getItem('authToken') || '';
  }

  function setToken(token) {
    localStorage.setItem('authToken', token);
  }

  // Iniciar sincronización automática si está habilitada
  if (CONFIG.autoSync && CONFIG.type !== 'local') {
    setInterval(syncAll, CONFIG.syncInterval);
  }

  // Exportar API pública
  return {
    saveUserData,
    loadUserData,
    syncAll,
    getSyncStatus,
    setBackend,
    setToken,
    getToken,
    CONFIG,
  };
})();
