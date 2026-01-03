import { useState, useRef, useEffect } from 'react';
import { useAuth, db, id } from '../lib/instant';

// Sample meme templates
const templates = [
  { name: 'Drake', url: 'https://i.imgflip.com/30b1gx.jpg' },
  { name: 'Distracted Boyfriend', url: 'https://i.imgflip.com/1ur9b0.jpg' },
  { name: 'Expanding Brain', url: 'https://i.imgflip.com/1jhl5s.jpg' },
  { name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg' },
  { name: 'Change My Mind', url: 'https://i.imgflip.com/24y43o.jpg' }
];

function MemeGenerator() {
  const { user } = useAuth();
  
  const [currentImage, setCurrentImage] = useState(null);
  const [textElements, setTextElements] = useState([]);
  const [fontSize, setFontSize] = useState(40);
  const [textColor, setTextColor] = useState('#ffffff');
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTextId, setDraggedTextId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isUploading, setIsUploading] = useState(false);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const textElementIdCounter = useRef(0);

  // Draw meme whenever dependencies change
  useEffect(() => {
    if (currentImage) {
      drawMeme();
    }
  }, [currentImage, textElements, fontSize, textColor]);

  const loadTemplate = (template) => {
    setActiveTemplate(template.name);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setCurrentImage(img);
    };
    img.onerror = () => {
      alert('Failed to load template image. Please try uploading your own image.');
    };
    img.src = template.url;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setCurrentImage(img);
          setActiveTemplate(null);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const addTextElement = () => {
    const id = textElementIdCounter.current++;
    const canvas = canvasRef.current;
    const newElement = {
      id: id,
      text: '',
      x: currentImage ? currentImage.width / 2 : 250,
      y: currentImage ? currentImage.height / 2 : 250,
      fontSize: fontSize,
      color: textColor,
      bounds: null
    };
    setTextElements([...textElements, newElement]);
  };

  const updateTextElement = (id, updates) => {
    setTextElements(textElements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const deleteTextElement = (id) => {
    setTextElements(textElements.filter(el => el.id !== id));
  };

  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const drawMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentImage) return;

    const ctx = canvas.getContext('2d');
    canvas.width = currentImage.width;
    canvas.height = currentImage.height;

    // Draw image
    ctx.drawImage(currentImage, 0, 0);

    const padding = 20;
    const maxWidth = canvas.width - (padding * 2);

    // Draw all text elements
    const updatedElements = textElements.map(textElement => {
      if (!textElement.text) {
        return { ...textElement, bounds: null };
      }

      ctx.fillStyle = textElement.color;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = Math.max(6, textElement.fontSize / 6);
      ctx.textAlign = 'center';
      ctx.font = `bold ${textElement.fontSize}px Impact, Arial Black, sans-serif`;

      const lines = wrapText(ctx, textElement.text, maxWidth);
      const lineHeight = textElement.fontSize * 1.2;
      const totalHeight = lines.length * lineHeight;

      const textX = textElement.x;
      const textY = textElement.y;

      // Calculate bounds for hit detection
      const textWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
      const bounds = {
        x: textX - textWidth / 2 - 10,
        y: textY - totalHeight / 2 - 5,
        width: textWidth + 20,
        height: totalHeight + 10
      };

      // Draw text
      lines.forEach((line, index) => {
        const y = textY - totalHeight / 2 + (index * lineHeight) + textElement.fontSize;
        ctx.strokeText(line, textX, y);
        ctx.fillText(line, textX, y);
      });

      return { ...textElement, bounds };
    });

    // Update bounds without causing re-render loop
    if (JSON.stringify(textElements.map(e => e.bounds)) !== JSON.stringify(updatedElements.map(e => e.bounds))) {
      setTextElements(updatedElements);
    }
  };

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const isPointInBounds = (x, y, bounds) => {
    if (!bounds) return false;
    return x >= bounds.x && x <= bounds.x + bounds.width &&
           y >= bounds.y && y <= bounds.y + bounds.height;
  };

  const handleMouseDown = (e) => {
    if (!currentImage) return;
    const coords = getCanvasCoordinates(e);

    for (let i = textElements.length - 1; i >= 0; i--) {
      const textElement = textElements[i];
      if (textElement.bounds && isPointInBounds(coords.x, coords.y, textElement.bounds)) {
        setIsDragging(true);
        setDraggedTextId(textElement.id);
        setDragOffset({
          x: coords.x - textElement.x,
          y: coords.y - textElement.y
        });
        return;
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!currentImage) return;
    const coords = getCanvasCoordinates(e);

    if (isDragging && draggedTextId !== null) {
      updateTextElement(draggedTextId, {
        x: coords.x - dragOffset.x,
        y: coords.y - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedTextId(null);
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentImage) return;

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
  };

  const postMeme = async () => {
    if (!currentImage) return;

    if (!user) {
      alert('You need to be logged in to post memes.');
      return;
    }

    const title = prompt('Enter a title for your meme:');
    if (!title || !title.trim()) {
      return;
    }

    setIsUploading(true);

    try {
      // Convert canvas to blob
      const canvas = canvasRef.current;
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });

      // Upload image to InstantDB Storage
      const fileName = `meme-${Date.now()}-${user.id}.png`;
      const { url: imageUrl } = await db.storage.upload(fileName, blob);

      // Prepare text elements data
      const textElementsData = textElements.map(el => ({
        id: el.id,
        text: el.text,
        x: el.x,
        y: el.y,
        fontSize: el.fontSize,
        color: el.color
      }));

      // Create meme record in InstantDB
      await db.transact([
        db.tx.memes[id()].update({
          title: title.trim(),
          imageUrl: imageUrl,
          textElements: textElementsData,
          createdAt: Date.now(),
          userId: user.id,
          likesCount: 0,
          commentsCount: 0
        })
      ]);

      alert('Meme posted successfully!');
      
      // Clear canvas
      setCurrentImage(null);
      setTextElements([]);
      setActiveTemplate(null);
    } catch (error) {
      console.error('Failed to post meme:', error);
      alert('Failed to post meme: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="canvas-section">
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            id="memeCanvas"
            style={{ display: currentImage ? 'block' : 'none', maxWidth: '100%', height: 'auto', borderRadius: 'var(--radius-lg)', cursor: isDragging ? 'grabbing' : 'default' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          {!currentImage && (
            <div className="canvas-placeholder">
              <p>Select or upload an image to get started</p>
              <span className="placeholder-hint">Drag text to reposition after adding</span>
            </div>
          )}
        </div>
      </div>

      <div className="controls-section">
        <div className="control-card">
          <div className="card-header">
            <h2>Image</h2>
          </div>
          <div className="card-content">
            <label htmlFor="imageUpload" className="upload-btn">
              <span>Upload Image</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              id="imageUpload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />

            <div className="divider">
              <span>or</span>
            </div>

            <div className="templates-section">
              <h3>Choose Template</h3>
              <div className="template-buttons">
                {templates.map((template) => (
                  <button
                    key={template.name}
                    className={`template-btn ${activeTemplate === template.name ? 'active' : ''}`}
                    onClick={() => loadTemplate(template)}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="control-card">
          <div className="card-header">
            <h2>Text</h2>
          </div>
          <div className="card-content">
            <div id="textElementsContainer">
              {textElements.map((element) => (
                <div key={element.id} className="text-element-item">
                  <div className="text-element-header">
                    <span className="text-element-label">Text {element.id + 1}</span>
                    <button
                      className="delete-text-btn"
                      onClick={() => deleteTextElement(element.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <input
                    type="text"
                    className="text-element-input"
                    placeholder="Enter text..."
                    value={element.text}
                    onChange={(e) => updateTextElement(element.id, { text: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <button className="add-text-btn" onClick={addTextElement}>
              <span>Add Text</span>
            </button>

            <div className="control-row">
              <div className="font-size-control">
                <label htmlFor="fontSize">
                  <span className="control-label">Font Size</span>
                  <span className="control-value">{fontSize}px</span>
                </label>
                <input
                  type="range"
                  id="fontSize"
                  min="20"
                  max="100"
                  value={fontSize}
                  onChange={(e) => {
                    const newSize = parseInt(e.target.value);
                    setFontSize(newSize);
                    setTextElements(textElements.map(el => ({ ...el, fontSize: newSize })));
                  }}
                />
              </div>

              <div className="text-color-control">
                <label htmlFor="textColor">
                  <span className="control-label">Text Color</span>
                </label>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    id="textColor"
                    value={textColor}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      setTextColor(newColor);
                      setTextElements(textElements.map(el => ({ ...el, color: newColor })));
                    }}
                  />
                  <span
                    className="color-preview"
                    style={{ backgroundColor: textColor }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="download-section">
          <button
            className="post-btn"
            disabled={!currentImage || isUploading}
            onClick={postMeme}
          >
            <span>{isUploading ? 'Posting...' : 'Post to Feed'}</span>
          </button>
          <button
            className="download-btn"
            disabled={!currentImage}
            onClick={downloadMeme}
          >
            <span>Download Meme</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemeGenerator;

