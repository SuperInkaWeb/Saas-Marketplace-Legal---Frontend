# AbogHub - Marketplace Legal (Frontend)

Bienvenido al repositorio del frontend de **AbogHub**, una plataforma SaaS diseñada para conectar clientes con abogados de manera eficiente, segura y profesional. Este proyecto forma parte del ecosistema de servicios legales digitales desarrollados para optimizar la gestión de casos y la interacción legal.

## 🚀 Tecnologías Principales

Este proyecto está construido con las últimas tecnologías web para garantizar rendimiento y escalabilidad:

- **Framework:** [Next.js 16+](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS 4+](https://tailwindcss.com/)
- **Gestión de Estado:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Consultas API:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Formularios:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/)

---

## 🛠️ Instalación y Configuración

Siga estos pasos para configurar el entorno de desarrollo local:

### 1. Prerrequisitos
- Node.js (Versión 20 o superior recomendada)
- npm o yarn

### 2. Clonar e instalar
```bash
git clone [URL_DEL_REPOSITORIO]
cd Saas-Marketplace-Legal---Frontend
npm install
```

### 3. Variables de Entorno
Cree un archivo `.env.local` en la raíz del proyecto basándose en `.env.example`:

```bash
cp .env.example .env.local
```

Asegúrese de configurar las siguientes variables:
- `NEXT_PUBLIC_API_URL`: URL base del Backend (ej. `http://localhost:8080/api/v1`).
- `NEXT_PUBLIC_WS_URL`: URL del servidor de WebSockets para el chat en vivo.

---

## 💻 Desarrollo y Despliegue

### Entorno de Desarrollo
Para iniciar el servidor de desarrollo:
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### Compilación para Producción
Para generar el paquete optimizado de producción:
```bash
npm run build
```

### Iniciar en Producción
Una vez compilado, puede iniciar el servidor:
```bash
npm run start
```

---

## 📦 Instrucciones de Despliegue (Paso a Paso)

El despliegue recomendado para este proyecto es mediante **Vercel**, dada su integración nativa con Next.js.

### Opción A: Despliegue en Vercel (Recomendado)
1. Conecte su repositorio de GitHub a Vercel.
2. Configure las variables de entorno en el panel de Vercel (`Settings` > `Environment Variables`).
3. Vercel detectará automáticamente que es un proyecto de Next.js.
4. Haga clic en **Deploy**. Cada "push" a la rama `main` actualizará automáticamente el sitio.

### Opción B: Despliegue Manual (VPS/Docker)
1. Ejecute `npm run build` en su servidor.
2. Asegúrese de que el puerto `3000` esté abierto.
3. Utilice un gestor de procesos como **PM2** para mantener la aplicación activa:
   ```bash
   pm2 start npm --name "aboghub-front" -- start
   ```

---

## 🏗️ Arquitectura del Proyecto

El código está organizado por **módulos funcionales** dentro de `src/modules` para facilitar su escalabilidad:

- **auth:** Gestión de inicio de sesión, registro y tokens.
- **marketplace:** Listado de abogados, perfiles y búsqueda.
- **matter:** Gestión de expedientes y casos legales.
- **chat:** Sistema de mensajería en tiempo real.
- **ai:** Integraciones con servicios de inteligencia artificial.
- **onboarding:** Flujo de configuración inicial para usuarios.

---

## 📝 Notas de Entrega
Este repositorio ha sido actualizado y validado para su entrega formal. Todos los componentes se encuentran en su versión estable y listos para producción.

Para consultas técnicas, por favor referirse al código fuente debidamente documentado en la carpeta `src`.
