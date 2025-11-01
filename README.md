# Dashboard de Proyectos – Next.js + shadcn/ui

Repositorio: [DAWA_S11](https://github.com/Vania-0731/DAWA_S11.git)

## 🚀 Stack
- Next.js 16
- React 19
- Tailwind CSS 4
- shadcn/ui (componentes copiados en `components/ui`)
- Radix UI (debajo de shadcn/ui)

## 📦 Instalación

Clonar
```bash
git clone https://github.com/Vania-0731/DAWA_S11.git
```

Entrar al proyecto
```bash
cd DAWA_S11/next-shadcn-ui
```

Instalar dependencias
```bash
npm install
```

Ejecutar en desarrollo
```bash
npm run dev
```

Nota: la ruta `/` redirige automáticamente a `/dashboard` (local y en Vercel).

## 🧭 Estructura relevante
- `app/dashboard/page.tsx`: Página principal del dashboard (Tabs: Resumen, Proyectos, Equipo, Tareas, Configuración)
- `components/DashboardContext.tsx`: Estado global en memoria + CRUD simulado (latencia incluida)
- `components/ProjectForm.tsx`: Form para crear proyectos (validación + spinner)
- `components/TeamManager.tsx`: CRUD de miembros del equipo (Calendar + Switch)
- `components/TaskTable.tsx`: CRUD de tareas + Calendar + paginación
- `components/ui/*`: Componentes de shadcn/ui instalados localmente
- `app/globals.css`: Colores/tema (acento verde/teal)

## 🧩 Componentes shadcn/ui usados
- Base: `button`, `card`, `input`, `label`, `dialog`, `tabs`, `select`, `badge`, `avatar`, `table`, `checkbox`, `switch`
- Nuevos: `spinner`, `alert`, `calendar`, `pagination`

## ✅ Funcionalidades
- **Resumen**
  - Métricas calculadas desde el estado en memoria: total de proyectos, tareas (totales y completadas), miembros activos
- **Proyectos**
  - Crear proyecto desde `ProjectForm` (campos: name, description, category, priority, teamSize)
  - Ver detalles (Dialog) y eliminar proyecto
- **Equipo**
  - CRUD completo de miembros con campos: `userId`, `role`, `name`, `email`, `position`, `birthdate`, `phone`, `projectId`, `isActive`
  - Calendar para `birthdate`, Switch para `isActive`, Select para proyecto
- **Tareas**
  - CRUD completo con campos: `description`, `projectId`, `status`, `priority`, `userId`, `dateline`
  - Calendar para `dateline` y paginación controlada por configuración
- **Configuración**
  - Preferencias simuladas: `itemsPerPage`, `notifications`, `theme`, `dateFormat`, `language`, `defaultProjectId`, `compactMode`, `showActivityFeed`

## 🎨 Tema/estilos
- Paleta con acento verde/teal definida en `app/globals.css` (variables CSS)
- Soporte para dark y light (desde las variables base)

## 📝 Notas técnicas
- No se usan librerías externas de estado (Redux/Zustand); sólo React Context + hooks nativos
- Para `Select` se evita `value=""`; se usa el valor sentinela `"none"` y se mapea a `null`/vacío donde corresponde
- Los componentes shadcn/ui están copiados en `components/ui` y pueden personalizarse

