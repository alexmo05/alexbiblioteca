# 📚 Aplicación Buscador de Libros (Angular)

Aplicación web desarrollada con **Angular** que permite buscar libros usando la API de Google Books, filtrarlos por categoría e idioma, ver sus detalles, marcarlos como favoritos y almacenarlos en `localStorage`.

---

## 🌐 Enlaces

- **🔗 Despliegue del proyecto**: [https://alexbiblioteca.vercel.app/](https://alexbiblioteca.vercel.app/)  
- **🎨 Diseño en Figma**: [https://www.figma.com/file/ejemplo](https://www.figma.com/design/Bj8UnXpU4z7ADThZGlKvul/Untitled?node-id=1-369&t=Wr4rjmHP47m0c0fX-1)

---

## ⚙️ Funcionalidades principales

### 🔍 Búsqueda de libros
- Entrada en vivo con `debounce` para optimizar peticiones.
- Los resultados se cargan de forma paginada hasta completar todos los disponibles.

### 🗂 Filtros
- **Categoría**: permite filtrar por temas como ficción, historia, ciencia, etc.
- **Idioma**: permite mostrar solo libros en el idioma seleccionado.

### 📖 Visualización de resultados
- Cuadrícula responsive con las portadas de los libros.
- Cada tarjeta muestra el título y un botón para agregar a favoritos.

### 💾 Favoritos
- Los libros se pueden marcar como favoritos.
- Se guardan en `localStorage` para persistencia entre sesiones.
- Se pueden eliminar individualmente.

### 📘 Detalles de libro
- Al hacer clic en una tarjeta se muestra información detallada:
  - Título
  - Autores
  - Editorial
  - Fecha de publicación
  - Descripción
  - Número de páginas
  - Idioma
  - Enlace a Google Books
  - Botón para añadir o quitar de favoritos

### 🆙 Scroll suave
- Al seleccionar un libro, se hace scroll suave a la sección de detalles.
- Botón para volver arriba en secciones largas (Favoritos y Detalles).

---

## 🧠 Tecnologías usadas

- **Angular (standalone components)**
- **TypeScript**
- **RxJS** (`Subject`, `debounceTime`, `distinctUntilChanged`)
- **Google Books API**
- **LocalStorage**
- **HTML + CSS (estilos propios y adaptados)**

---

## 📝 Cómo usar el proyecto

1. Clona el repositorio:
   ```bash
   git clone https://github.com/alexmo05/alexbiblioteca
   cd tu-repo
