document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('drop-zone');
    const resultContainer = document.getElementById('result-container');
    const structureOutput = document.getElementById('structure-output');

    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('dragover');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('dragover');
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
        resultContainer.classList.remove('hidden');
        structureOutput.innerHTML = generateAllFormats(files);
    });

    // Añadir funcionalidad de click para abrir explorador
    dropArea.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        input.multiple = true;
        input.click();

        input.addEventListener('change', (e) => {
            handleFiles(Array.from(e.target.files));
            resultContainer.classList.remove('hidden');
        });
    });
});

function handleFiles(files) {
    const structureOutput = document.getElementById('structure-output');
    structureOutput.innerHTML = generateAllFormats(files);
    
    // Añadir event listeners a los botones de copiar
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const format = button.dataset.format;
            const formatSection = button.closest('.format-section');
            const codeBlock = formatSection.querySelector('.format-output');
            
            try {
                await navigator.clipboard.writeText(codeBlock.textContent);
                
                // Feedback visual
                button.classList.add('copied');
                const originalIcon = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i>';
                
                setTimeout(() => {
                    button.classList.remove('copied');
                    button.innerHTML = originalIcon;
                }, 2000);
                
            } catch (err) {
                console.error('Error al copiar:', err);
            }
        });
    });
}

function generateStructure(files) {
    let output = '';
    output += '📁 FileTree/\n';
    
    // Crear un mapa de archivos y carpetas
    const fileMap = new Map();
    files.forEach(file => {
        const path = file.webkitRelativePath || file.name;
        const parts = path.split('/').filter(part => part);
        
        if (parts.length === 1) {
            // Archivo en la raíz
            fileMap.set(path, { type: 'file', name: path });
        } else {
            // Archivo en subcarpeta
            const folderPath = parts.slice(0, -1);
            const fileName = parts[parts.length - 1];
            const folderName = folderPath[folderPath.length - 1];
            
            if (!fileMap.has(folderName)) {
                fileMap.set(folderName, { 
                    type: 'folder', 
                    name: folderName,
                    files: []
                });
            }
            fileMap.get(folderName).files.push(fileName);
        }
    });

    // Generar salida para archivos de raíz
    Array.from(fileMap.values())
        .filter(item => item.type === 'file')
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(file => {
            output += `  📄 ${file.name}\n`;
        });

    // Generar salida para carpetas y sus archivos
    Array.from(fileMap.values())
        .filter(item => item.type === 'folder')
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(folder => {
            output += `  📁 ${folder.name}/\n`;
            folder.files
                .sort((a, b) => a.localeCompare(b))
                .forEach(file => {
                    output += `    📄 ${file}\n`;
                });
        });

    return output;
}

function displayStructure(structure, parent) {
    Object.entries(structure).forEach(([name, content]) => {
        const item = document.createElement('div');
        
        if (Object.keys(content).length > 0) {
            item.classList.add('folder');
            item.textContent = name + '/';
            const subFolder = document.createElement('div');
            subFolder.classList.add('subfolder');
            displayStructure(content, subFolder);
            item.appendChild(subFolder);
        } else {
            item.classList.add('file');
            item.textContent = name;
        }
        
        parent.appendChild(item);
    });
}

function getElementDepth(element) {
    let depth = 0;
    let current = element;
    while (current.parentElement && !current.parentElement.id.includes('structure')) {
        depth++;
        current = current.parentElement;
    }
    return depth;
}

// Función auxiliar para reconstruir la estructura
function buildStructureFromDOM(element) {
    const structure = {};
    Array.from(element.children).forEach(child => {
        const name = child.textContent.replace('/', '');
        if (child.classList.contains('folder')) {
            structure[name] = buildStructureFromDOM(child.querySelector('.subfolder'));
        } else {
            structure[name] = {};
        }
    });
    return structure;
}

function generateAllFormats(files) {
    const treeFormat = generateStructure(files, 'tree');
    const markdownFormat = generateMarkdown(files);
    const jsonFormat = generateJSON(files);

    return `
<div class="formats-container">
    <div class="format-section">
        <div class="format-header">
            <h3>🌳 Estructura de Árbol</h3>
            <button class="copy-btn" data-format="tree">
                <i class="fas fa-copy"></i>
            </button>
        </div>
        <pre class="format-output tree-output">${treeFormat}</pre>
    </div>
    
    <div class="format-section">
        <div class="format-header">
            <h3>📝 Markdown</h3>
            <button class="copy-btn" data-format="markdown">
                <i class="fas fa-copy"></i>
            </button>
        </div>
        <pre class="format-output markdown-output">${markdownFormat}</pre>
    </div>
    
    <div class="format-section">
        <div class="format-header">
            <h3>{ } JSON</h3>
            <button class="copy-btn" data-format="json">
                <i class="fas fa-copy"></i>
            </button>
        </div>
        <pre class="format-output json-output">${jsonFormat}</pre>
    </div>
</div>`;
}

function generateMarkdown(files) {
    let output = '# FileTree\n\n';
    
    // Crear un mapa de archivos y carpetas
    const fileMap = new Map();
    files.forEach(file => {
        const path = file.webkitRelativePath || file.name;
        const parts = path.split('/').filter(part => part);
        
        if (parts.length === 1) {
            // Archivo en la raíz
            fileMap.set(path, { type: 'file', name: path });
        } else {
            // Archivo en subcarpeta
            const folderPath = parts.slice(0, -1);
            const fileName = parts[parts.length - 1];
            const folderName = folderPath[folderPath.length - 1];
            
            if (!fileMap.has(folderName)) {
                fileMap.set(folderName, { 
                    type: 'folder', 
                    name: folderName,
                    files: []
                });
            }
            fileMap.get(folderName).files.push(fileName);
        }
    });

    // Generar salida para archivos de raíz
    Array.from(fileMap.values())
        .filter(item => item.type === 'file')
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(file => {
            output += `* ${file.name}\n`;
        });

    // Generar salida para carpetas
    Array.from(fileMap.values())
        .filter(item => item.type === 'folder')
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(folder => {
            output += `\n## ${folder.name}\n`;
            folder.files
                .sort((a, b) => a.localeCompare(b))
                .forEach(file => {
                    output += `* ${file}\n`;
                });
        });

    return output;
}

function generateJSON(files) {
    const structure = {
        name: "FileTree",
        type: "directory",
        children: []
    };
    
    // Crear un mapa de archivos y carpetas
    const fileMap = new Map();
    files.forEach(file => {
        const path = file.webkitRelativePath || file.name;
        const parts = path.split('/').filter(part => part);
        
        // Ignorar la carpeta raíz FileTree si está presente
        if (parts[0] === 'FileTree') {
            parts.shift();
        }
        
        if (parts.length === 1) {
            // Archivo en la raíz
            structure.children.push({
                name: parts[0],
                type: "file"
            });
        } else {
            // Archivo en subcarpeta
            const folderName = parts[0];
            const fileName = parts[parts.length - 1];
            
            // Buscar o crear la carpeta
            let folder = structure.children.find(
                child => child.type === "directory" && child.name === folderName
            );
            
            if (!folder) {
                folder = {
                    name: folderName,
                    type: "directory",
                    children: []
                };
                structure.children.push(folder);
            }
            
            // Añadir el archivo a la carpeta
            folder.children.push({
                name: fileName,
                type: "file"
            });
        }
    });
    
    // Ordenar los children alfabéticamente
    structure.children.sort((a, b) => {
        // Primero archivos, luego carpetas
        if (a.type !== b.type) {
            return a.type === "file" ? -1 : 1;
        }
        // Mismo tipo, ordenar por nombre
        return a.name.localeCompare(b.name);
    });
    
    // Ordenar los archivos dentro de las carpetas
    structure.children
        .filter(item => item.type === "directory")
        .forEach(folder => {
            folder.children.sort((a, b) => a.name.localeCompare(b.name));
        });
    
    return JSON.stringify(structure, null, 2);
}

