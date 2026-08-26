# Gym Tracker Pro

Aplicación web estática multiusuario para seguimiento de progreso físico, tareas, nutrición y rutinas de ejercicio.

## Características

- Multiusuario local
- Dashboard profesional tipo SaaS
- Seguimiento de peso, masa muscular, grasa corporal e IMC
- Gráficos con Chart.js
- Registro de tareas tipo checklist
- Menú diario: desayuno, merienda AM, almuerzo, merienda PM y cena
- Rutinas por día de la semana
- Configuración y administración de usuarios
- Exportar e importar respaldo JSON
- Modo oscuro y claro
- Persistencia con LocalStorage
- Compatible con GitHub Pages

## Estructura

```text
gym-tracker-pro/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── assets/
└── README.md
```

## Cómo ejecutarlo localmente

Opción rápida:

1. Descomprime el ZIP.
2. Abre `index.html` directamente en tu navegador.

Opción recomendada con servidor local:

```bash
npx serve .
```

Luego abre la URL local que te indique la terminal.

## Cómo publicarlo en GitHub Pages

1. Crea un repositorio en GitHub, por ejemplo: `gym-tracker-pro`.
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
