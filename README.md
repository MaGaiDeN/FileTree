# FileTree

Visualizador de estructura de archivos optimizado para IA. Genera representaciones de estructuras de carpetas en formatos compatibles con ChatGPT y otras IAs.

## 🌟 Características

- 🌳 Vista de árbol jerárquica
- 📝 Formato Markdown
- { } Formato JSON
- 📋 Copiar al portapapeles con un clic
- 🎯 Optimizado para usar con IAs
- 📱 Diseño responsive
- 🖥️ Funciona en local y en la web

## 🚀 Demo

Visita la demo en vivo: [FileTree](https://magaiden.github.io/FileTree/)

## 📖 Uso

1. Visita [FileTree](https://magaiden.github.io/FileTree/) o ejecuta en local
2. Arrastra una carpeta al área indicada
3. Obtén la estructura en tres formatos diferentes:
   - Estructura de árbol (ideal para visualización)
   - Markdown (perfecto para documentación)
   - JSON (óptimo para procesamiento)
4. Copia el formato que necesites con un clic

## 💻 Desarrollo Local

# Clona el repositorio
git clone https://github.com/MaGaiDeN/FileTree.git

# Navega al directorio
cd FileTree

# Abre index.html en tu navegador favorito
# No requiere servidor local ni dependencias

## 🛠️ Tecnologías

- HTML5
- CSS3
- JavaScript (Vanilla)
- Font Awesome para iconos
- No requiere dependencias externas

## 📋 Formatos de Salida

### Estructura de Árbol
📁 FileTree/
  📄 index.html
  📄 script.js
  📄 styles.css
  📁 images/
    📄 logo.webp

### Markdown
# FileTree

* index.html
* script.js
* styles.css

## images
* logo.webp

### JSON
{
  "name": "FileTree",
  "type": "directory",
  "children": [
    {
      "name": "index.html",
      "type": "file"
    },
    {
      "name": "script.js",
      "type": "file"
    },
    {
      "name": "styles.css",
      "type": "file"
    },
    {
      "name": "images",
      "type": "directory",
      "children": [
        {
          "name": "logo.webp",
          "type": "file"
        }
      ]
    }
  ]
}

## 🤝 Contribuir

Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## ✨ Autor

Desarrollado por [Carlos Sánchez](https://sientelared.com)

## 🙏 Agradecimientos

- A la comunidad de desarrolladores
- A los usuarios que proporcionan feedback
- A ChatGPT por la asistencia en el desarrollo