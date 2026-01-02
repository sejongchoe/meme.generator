// Meme Generator Script - Multiple Text Support

const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const fontSizeSlider = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const textColorPicker = document.getElementById('textColor');
const colorPreview = document.getElementById('colorPreview');
const downloadBtn = document.getElementById('downloadBtn');
const canvasPlaceholder = document.getElementById('canvasPlaceholder');
const templateButtons = document.getElementById('templateButtons');
const addTextBtn = document.getElementById('addTextBtn');
const textElementsContainer = document.getElementById('textElementsContainer');

let currentImage = null;
let fontSize = 40;
let textColor = '#ffffff';

// Array to store all text elements
let textElements = [];
let textElementIdCounter = 0;

// Drag state
let isDragging = false;
let draggedTextId = null;
let dragOffset = { x: 0, y: 0 };

// Sample meme templates
const templates = [
    { name: 'Drake', url: 'https://i.imgflip.com/30b1gx.jpg' },
    { name: 'Distracted Boyfriend', url: 'https://i.imgflip.com/1ur9b0.jpg' },
    { name: 'Expanding Brain', url: 'https://i.imgflip.com/1jhl5s.jpg' },
    { name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg' },
    { name: 'Change My Mind', url: 'https://i.imgflip.com/24y43o.jpg' }
];

// Initialize template buttons
function initTemplates() {
    templates.forEach((template, index) => {
        const btn = document.createElement('button');
        btn.className = 'template-btn';
        btn.textContent = template.name;
        btn.addEventListener('click', () => loadTemplate(template.url, btn));
        templateButtons.appendChild(btn);
    });
}

// Load image from template
function loadTemplate(url, button) {
    document.querySelectorAll('.template-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        currentImage = img;
        drawMeme();
    };
    img.onerror = () => {
        alert('Failed to load template image. Please try uploading your own image.');
    };
    img.src = url;
}

// Handle image upload
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                currentImage = img;
                document.querySelectorAll('.template-btn').forEach(btn => btn.classList.remove('active'));
                drawMeme();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Add new text element
function addTextElement() {
    const id = textElementIdCounter++;
    const textElement = {
        id: id,
        text: '',
        x: null,
        y: null,
        center: { x: null, y: null },
        bounds: null,
        fontSize: fontSize,
        color: textColor
    };
    
    textElements.push(textElement);
    createTextElementUI(textElement);
    
    if (currentImage) {
        // Position new text at center of canvas
        textElement.x = currentImage.width / 2;
        textElement.y = currentImage.height / 2;
        drawMeme();
    }
}

// Create UI for a text element
function createTextElementUI(textElement) {
    const item = document.createElement('div');
    item.className = 'text-element-item';
    item.dataset.id = textElement.id;
    
    const header = document.createElement('div');
    header.className = 'text-element-header';
    
    const label = document.createElement('span');
    label.className = 'text-element-label';
    label.textContent = `Text ${textElement.id + 1}`;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-text-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTextElement(textElement.id));
    
    header.appendChild(label);
    header.appendChild(deleteBtn);
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'text-element-input';
    input.placeholder = 'Enter text...';
    input.value = textElement.text;
    input.addEventListener('input', (e) => {
        textElement.text = e.target.value;
        if (currentImage) {
            drawMeme();
        }
    });
    
    item.appendChild(header);
    item.appendChild(input);
    textElementsContainer.appendChild(item);
}

// Delete text element
function deleteTextElement(id) {
    textElements = textElements.filter(el => el.id !== id);
    const item = document.querySelector(`.text-element-item[data-id="${id}"]`);
    if (item) {
        item.remove();
    }
    if (currentImage) {
        drawMeme();
    }
}

// Update font size display
fontSizeSlider.addEventListener('input', (e) => {
    fontSize = parseInt(e.target.value);
    fontSizeValue.textContent = fontSize;
    // Update font size for all text elements
    textElements.forEach(el => {
        el.fontSize = fontSize;
    });
    if (currentImage) {
        drawMeme();
    }
});

// Update text color
textColorPicker.addEventListener('input', (e) => {
    textColor = e.target.value;
    if (colorPreview) {
        colorPreview.style.backgroundColor = textColor;
    }
    // Update color for all text elements
    textElements.forEach(el => {
        el.color = textColor;
    });
    if (currentImage) {
        drawMeme();
    }
});

// Initialize color preview
if (colorPreview) {
    colorPreview.style.backgroundColor = textColor;
}

// Add text button handler
addTextBtn.addEventListener('click', addTextElement);

// Draw meme on canvas
function drawMeme() {
    if (!currentImage) return;
    
    // Set canvas dimensions to match image
    canvas.width = currentImage.width;
    canvas.height = currentImage.height;
    
    // Draw image
    ctx.drawImage(currentImage, 0, 0);
    
    const padding = 20;
    const maxWidth = canvas.width - (padding * 2);
    
    // Draw all text elements
    textElements.forEach(textElement => {
        if (!textElement.text) {
            textElement.bounds = null;
            return;
        }
        
        // Configure text styling for this element
        ctx.fillStyle = textElement.color;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = Math.max(6, textElement.fontSize / 6);
        ctx.textAlign = 'center';
        ctx.font = `bold ${textElement.fontSize}px Impact, Arial Black, sans-serif`;
        
        const lines = wrapText(ctx, textElement.text, maxWidth);
        const lineHeight = textElement.fontSize * 1.2;
        const totalHeight = lines.length * lineHeight;
        
        // Use stored position or default to center
        let textX = textElement.x !== null ? textElement.x : canvas.width / 2;
        let textY = textElement.y !== null ? textElement.y : canvas.height / 2;
        
        // Store center position for drag calculations
        textElement.center = { x: textX, y: textY };
        
        // Store bounds for hit detection
        const textWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
        textElement.bounds = {
            x: textX - textWidth / 2 - 10,
            y: textY - totalHeight / 2 - 5,
            width: textWidth + 20,
            height: totalHeight + 10
        };
        
        lines.forEach((line, index) => {
            const y = textY - totalHeight / 2 + (index * lineHeight) + textElement.fontSize;
            ctx.strokeText(line, textX, y);
            ctx.fillText(line, textX, y);
        });
    });
    
    // Show canvas and hide placeholder
    canvas.style.display = 'block';
    canvasPlaceholder.classList.add('hidden');
    downloadBtn.disabled = false;
}

// Check if point is within text bounds
function isPointInTextBounds(x, y, bounds) {
    if (!bounds) return false;
    return x >= bounds.x && x <= bounds.x + bounds.width &&
           y >= bounds.y && y <= bounds.y + bounds.height;
}

// Get canvas coordinates from mouse event
function getCanvasCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

// Mouse down handler
canvas.addEventListener('mousedown', (e) => {
    if (!currentImage) return;
    
    const coords = getCanvasCoordinates(e);
    
    // Check if clicking on any text element
    for (let i = textElements.length - 1; i >= 0; i--) {
        const textElement = textElements[i];
        if (textElement.bounds && isPointInTextBounds(coords.x, coords.y, textElement.bounds)) {
            isDragging = true;
            draggedTextId = textElement.id;
            dragOffset.x = coords.x - textElement.center.x;
            dragOffset.y = coords.y - textElement.center.y;
            canvas.style.cursor = 'grabbing';
            return;
        }
    }
});

// Mouse move handler
canvas.addEventListener('mousemove', (e) => {
    if (!currentImage) return;
    
    const coords = getCanvasCoordinates(e);
    
    // Update cursor style
    if (!isDragging) {
        let hoveringText = false;
        for (const textElement of textElements) {
            if (textElement.bounds && isPointInTextBounds(coords.x, coords.y, textElement.bounds)) {
                hoveringText = true;
                break;
            }
        }
        canvas.style.cursor = hoveringText ? 'grab' : 'default';
        return;
    }
    
    // Handle dragging
    if (isDragging && draggedTextId !== null) {
        const textElement = textElements.find(el => el.id === draggedTextId);
        if (textElement) {
            textElement.x = coords.x - dragOffset.x;
            textElement.y = coords.y - dragOffset.y;
            drawMeme();
            canvas.style.cursor = 'grabbing';
        }
    }
});

// Mouse up handler
canvas.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        draggedTextId = null;
        canvas.style.cursor = 'default';
    }
});

// Mouse leave handler
canvas.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        draggedTextId = null;
        canvas.style.cursor = 'default';
    }
});

// Wrap text to fit within max width
function wrapText(context, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = context.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

// Download meme
downloadBtn.addEventListener('click', () => {
    if (!currentImage) return;
    
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'meme.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 'image/png');
});

// Initialize templates on load
initTemplates();
