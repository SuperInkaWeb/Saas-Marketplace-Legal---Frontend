# Manual Técnico - AbogHub Frontend

Este documento detalla la arquitectura, flujos de datos y configuraciones técnicas del frontend de **AbogHub**.

## 🏗️ Arquitectura del Sistema

La aplicación sigue una arquitectura **basada en módulos**, lo que permite separar la lógica de negocio por dominios funcionales. Se utiliza el **App Router** de Next.js para el manejo de rutas.

### Estructura de Carpetas

- `src/app/`: Define las rutas de la aplicación y layouts.
- `src/modules/`: Contiene la lógica central organizada por dominios (auth, marketplace, matter, etc.).
  - `components/`: Componentes específicos del módulo.
  - `store/`: Estado global (Zustand).
  - `hooks/`: Lógica reutilizable y consultas API (TanStack Query).
  - `types.ts`: Definiciones de TypeScript para el módulo.
- `src/components/`: Componentes de UI genéricos y reutilizables (Botones, Inputs, Modales).
- `src/lib/`: Configuraciones de librerías externas (Axios, API client).
- `src/providers/`: Proveedores de contexto (QueryClient, AuthProvider).

---

## 🔐 Autenticación y Seguridad

El sistema de autenticación utiliza **JWT (JSON Web Tokens)**.

1. **Almacenamiento:** El token se guarda en el estado global (`auth/store`) y se persiste en `localStorage`.
2. **Interceptores:** El cliente de API (`lib/api.ts`) inyecta automáticamente el token en cada solicitud saliente mediante el header `Authorization: Bearer <token>`.
3. **Manejo de Sesión:** Si la API devuelve un error `401 (Unauthorized)`, el interceptor redirige automáticamente al usuario al login y limpia el estado de autenticación.

---

## 📡 Integración con la API (Backend)

Se utiliza **Axios** para las peticiones HTTP y **TanStack Query** para la gestión del estado del servidor (cache, loading, error).

### Configuración del Cliente
- **Base URL:** Configurada en `.env` como `NEXT_PUBLIC_API_URL`.
- **Timeouts:** Gestión de reintentos y alertas de error mediante `sonner`.

### Endpoints Principales
- `POST /auth/login`: Autenticación de usuarios.
- `GET /lawyers`: Listado y búsqueda de abogados.
- `GET /matters`: Gestión de expedientes legales.
- `POST /chat`: Envío de mensajes en tiempo real.

---

## 💬 Comunicación en Tiempo Real (Chat)

El chat utiliza **WebSockets (STOMP/SockJS)** para garantizar la entrega inmediata de mensajes.
- **Configuración:** `NEXT_PUBLIC_WS_URL`.
- **Módulo:** `src/modules/chat`.

---

## 🎨 Sistema de Diseño

- **Tailwind CSS:** Utilizado para todos los estilos visuales.
- **Framer Motion:** Maneja las transiciones de página y micro-interacciones para una experiencia de usuario premium.
- **Iconografía:** [Lucide React](https://lucide.dev/).
