# Documentación Técnica del ERP - Clínica Dental

Este documento es un artefacto vivo. Se actualizará constantemente a medida que se desarrollen nuevos módulos, esquemas de base de datos y funciones clave, sirviendo como la guía principal para cualquier desarrollador que trabaje en el sistema.

## 1. Arquitectura del Sistema
El sistema está construido bajo la arquitectura **Feature-Sliced Design** usando **Next.js (App Router)**.
- **Frontend**: React, Tailwind CSS v4.
- **Backend**: Next.js Server Actions y Route Handlers.
- **Base de Datos**: PostgreSQL.
- **ORM**: Prisma.
- **Autenticación**: NextAuth.js (Auth.js) v4+ con Google Provider.

## 2. Esquema de Base de Datos (Modelos Base)
A continuación se detallan los modelos principales del sistema (mapeados en Prisma):

### Autenticación y Usuarios
- **User**: Médicos, asistentes y administradores. Se autentican vía Google.
- **Account / Session**: Generados automáticamente por NextAuth para el manejo de sesiones seguras.

### Módulo Médico
- **Patient**: Ficha técnica del cliente. (Nombre, DNI, teléfono, antecedentes, alergias).
- **Appointment**: Citas médicas. Asociadas a un Paciente y a un Usuario (Doctor). Contienen fecha, hora y el ID del evento de Google Calendar.
- **Odontogram**: Historial del estado dental. Cada registro guarda el estado JSON completo de la boca en una fecha específica para tener una trazabilidad en el tiempo.

### Módulo Financiero
- **Transaction**: Movimientos contables (Ingresos o Egresos). Pueden estar vinculados a un `Patient` (pago de tratamiento) o ser independientes (compra de resinas, pago de luz).

## 3. Funciones Críticas y APIs
*(Esta sección se llenará conforme se vayan programando los Server Actions y utilidades)*

- `createAppointment()`: *(Pendiente de desarrollo)*.
- `syncWithGoogleCalendar()`: *(Pendiente de desarrollo)*.
- `saveOdontogramState()`: *(Pendiente de desarrollo)*.
- `calculateNetProfit()`: *(Pendiente de desarrollo)*.

---
*Última actualización: Configuración Inicial.*
