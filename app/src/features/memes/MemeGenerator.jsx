/**
 * Meme Generator Component
 * Canvas-based meme creator with advanced text editing and image resizing
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth, useQuery, db, id } from '../../lib/instant';
import { useCreateMeme, useUploadImage } from '../../shared/hooks/useInstant';
import { MEME_TEMPLATES, CANVAS_SETTINGS } from '../../shared/config/constants';
import { getTodayString } from '../../shared/utils/postLimits';
import { 
  wrapText, 
  canvasToBlob, 
  downloadCanvas, 
  loadImage,
  getCanvasCoordinates,
  isPointInBounds,
  setupTextStyle 
} from '../../shared/utils/canvas';
import { checkPostLimit, getDailyLimit } from '../../shared/utils/postLimits';
import TextControls from './components/TextControls';
import ImageSelector from './components/ImageSelector';
import Notification from '../../components/Notification';

const MemeGenerator = () => {
  const { user } = useAuth();
  const { createMeme } = useCreateMeme();
  const { uploadImage } = useUploadImage();
  
  // Query user data to get daily post count
  const { data: userData } = useQuery(
    user ? { users: { $: { where: { id: user.id } } } } : null
  );
  
  const currentUser = userData?.users?.[0] || user;
  
  const [currentImage, setCurrentImage] = useState(null);
  const [imageScale, setImageScale] = useState(1);
  const [textElements, setTextElements] = useState([]);
  const [fontSize, setFontSize] = useState(CANVAS_SETTINGS.defaultFontSize);
  const [textColor, setTextColor] = useState(CANVAS_SETTINGS.defaultTextColor);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [draggedTextId, setDraggedTextId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const textElementIdCounter = useRef(0);
  const baseImageRef = useRef(null);

  // Draw meme on canvas
  const drawMeme = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentImage) return;

    const ctx = canvas.getContext('2d');
    
    // Calculate scaled dimensions
    const scaledWidth = currentImage.width * imageScale;
    const scaledHeight = currentImage.height * imageScale;
    
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    // Draw scaled image
    ctx.drawImage(currentImage, 0, 0, scaledWidth, scaledHeight);

    const maxWidth = canvas.width - (CANVAS_SETTINGS.padding * 2);

    // Draw all text elements
    const updatedElements = textElements.map(textElement => {
      if (!textElement.text) {
        return { ...textElement, bounds: null };
      }

      setupTextStyle(ctx, {
        fontSize: textElement.fontSize,
        color: textElement.color
      });

      const lines = wrapText(ctx, textElement.text, maxWidth);
      const lineHeight = textElement.fontSize * 1.2;
      const totalHeight = lines.length * lineHeight;

      const textX = textElement.x * imageScale;
      const textY = textElement.y * imageScale;

      // Calculate bounds
      const textWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
      const bounds = {
        x: textX - textWidth / 2 - 10,
        y: textY - totalHeight / 2 - 5,
        width: textWidth + 20,
        height: totalHeight + 10
      };

      // Draw text with outline
      lines.forEach((line, index) => {
        const y = textY - totalHeight / 2 + (index * lineHeight) + textElement.fontSize;
        ctx.strokeText(line, textX, y);
        ctx.fillText(line, textX, y);
      });

      // Draw resize handle if this text is being dragged
      if (draggedTextId === textElement.id && !isResizing) {
        ctx.strokeStyle = 'var(--orange-color)';
        ctx.lineWidth = 2;
        ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        
        // Resize handle (bottom-right corner)
        ctx.fillStyle = 'var(--orange-color)';
        ctx.fillRect(bounds.x + bounds.width - 10, bounds.y + bounds.height - 10, 10, 10);
      }

      return { ...textElement, bounds, scaledBounds: bounds };
    });

    if (JSON.stringify(textElements.map(e => e.bounds)) !== JSON.stringify(updatedElements.map(e => e.bounds))) {
      setTextElements(updatedElements);
    }
  }, [currentImage, textElements, imageScale, draggedTextId, isResizing]);

  useEffect(() => {
    if (currentImage) {
      drawMeme();
    }
  }, [currentImage, drawMeme]);

  // Template loading
  const handleLoadTemplate = async (template) => {
    try {
      const img = await loadImage(template.url);
      baseImageRef.current = img;
      setCurrentImage(img);
      setImageScale(1);
      setActiveTemplate(template.id);
    } catch (error) {
      console.error('Failed to load template:', error);
      alert('Failed to load template. Please try uploading your own image.');
    }
  };

  // Image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        baseImageRef.current = img;
        setCurrentImage(img);
        setImageScale(1);
        setActiveTemplate(null);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Image resize
  const handleImageResize = (newScale) => {
    setImageScale(newScale);
    // Update text positions proportionally
    setTextElements(textElements.map(el => ({
      ...el,
      x: el.x,
      y: el.y
    })));
  };

  // Text element management
  const addTextElement = () => {
    const id = textElementIdCounter.current++;
    const newElement = {
      id,
      text: '',
      x: currentImage ? (currentImage.width * imageScale) / 2 / imageScale : 250,
      y: currentImage ? (currentImage.height * imageScale) / 2 / imageScale : 250,
      fontSize,
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
    if (draggedTextId === id) {
      setDraggedTextId(null);
    }
  };

  // Check if clicking on resize handle
  const isOnResizeHandle = (x, y, bounds) => {
    if (!bounds) return false;
    const handleX = bounds.x + bounds.width - 10;
    const handleY = bounds.y + bounds.height - 10;
    return x >= handleX && x <= handleX + 10 && y >= handleY && y <= handleY + 10;
  };

  // Drag handling
  const handleMouseDown = (e) => {
    if (!currentImage) return;
    const coords = getCanvasCoordinates(canvasRef.current, e);

    for (let i = textElements.length - 1; i >= 0; i--) {
      const textElement = textElements[i];
      if (textElement.scaledBounds) {
        // Check resize handle first
        if (isOnResizeHandle(coords.x, coords.y, textElement.scaledBounds)) {
          setIsResizing(true);
          setDraggedTextId(textElement.id);
          return;
        }
        // Then check bounds for dragging
        if (isPointInBounds(coords.x, coords.y, textElement.scaledBounds)) {
          setIsDragging(true);
          setDraggedTextId(textElement.id);
          setDragOffset({
            x: coords.x - (textElement.x * imageScale),
            y: coords.y - (textElement.y * imageScale)
          });
          return;
        }
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!currentImage) return;
    
    const coords = getCanvasCoordinates(canvasRef.current, e);

    if (isResizing && draggedTextId !== null) {
      const textElement = textElements.find(el => el.id === draggedTextId);
      if (textElement && textElement.scaledBounds) {
        // Calculate new font size based on distance from text center
        const centerY = textElement.y * imageScale;
        const distance = Math.abs(coords.y - centerY);
        const newFontSize = Math.max(20, Math.min(100, Math.floor(distance / 2)));
        updateTextElement(draggedTextId, { fontSize: newFontSize });
      }
    } else if (isDragging && draggedTextId !== null) {
      updateTextElement(draggedTextId, {
        x: (coords.x - dragOffset.x) / imageScale,
        y: (coords.y - dragOffset.y) / imageScale
      });
    } else {
      // Update cursor based on hover
      let cursor = 'default';
      for (const textElement of textElements) {
        if (textElement.scaledBounds) {
          if (isOnResizeHandle(coords.x, coords.y, textElement.scaledBounds)) {
            cursor = 'nwse-resize';
            break;
          } else if (isPointInBounds(coords.x, coords.y, textElement.scaledBounds)) {
            cursor = 'grab';
            break;
          }
        }
      }
      canvasRef.current.style.cursor = cursor;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setDraggedTextId(null);
  };

  // Download meme
  const handleDownload = () => {
    if (!canvasRef.current || !currentImage) return;
    downloadCanvas(canvasRef.current, 'meme.png');
  };

  // Post meme
  const handlePost = async () => {
    if (!currentImage) return;

    if (!user) {
      setNotification({
        message: 'You need to be logged in to post memes.',
        type: 'error'
      });
      return;
    }

    // Check daily post limit
    const limitCheck = checkPostLimit(currentUser);
    if (!limitCheck.canPost) {
      setNotification({
        message: limitCheck.reason || `Daily limit of ${getDailyLimit()} memes reached. Try again tomorrow!`,
        type: 'info'
      });
      return;
    }

    const title = prompt(`Enter a title for your meme (${limitCheck.remaining} posts remaining today):`);
    if (!title || !title.trim()) return;

    setIsUploading(true);

    try {
      console.log('Starting meme upload...', { userId: user.id, userEmail: user.email });
      
      // Upload image first
      const blob = await canvasToBlob(canvasRef.current);
      console.log('Canvas converted to blob:', blob.size, 'bytes');
      
      const imageUrl = await uploadImage(blob, user.id);
      console.log('Image uploaded successfully:', imageUrl);

      // Prepare text elements
      const textElementsData = textElements.map(el => ({
        id: el.id,
        text: el.text,
        x: el.x,
        y: el.y,
        fontSize: el.fontSize,
        color: el.color
      }));

      // Create meme in database
      console.log('Creating meme with data:', {
        title: title.trim(),
        imageUrl,
        userId: user.id,
        textElementsCount: textElementsData.length,
        currentUser
      });

      // Simplified approach - just create the meme without user update first
      const memeId = id();
      await db.transact([
        db.tx.memes[memeId].update({
          title: title.trim(),
          imageUrl,
          textElements: textElementsData,
          createdAt: Date.now(),
          userId: user.id,
          likesCount: 0,
          commentsCount: 0
        })
      ]);

      console.log('Meme created successfully with ID:', memeId);

      // Update user post count separately (non-blocking)
      try {
        const today = getTodayString();
        const isNewDay = !currentUser || currentUser.lastPostDate !== today;
        const newCount = isNewDay ? 1 : (currentUser?.dailyPostCount || 0) + 1;
        
        await db.transact([
          db.tx.users[user.id].update({
            email: user.email || '',
            username: user.email?.split('@')[0] || 'user',
            dailyPostCount: newCount,
            lastPostDate: today,
            createdAt: currentUser?.createdAt || Date.now()
          })
        ]);
        console.log('User post count updated');
      } catch (userUpdateError) {
        console.warn('Could not update user count, but meme was posted:', userUpdateError);
      }

      const newRemaining = limitCheck.remaining - 1;
      
      // Show success notification
      setNotification({
        message: `Meme posted to feed! ${newRemaining} post${newRemaining !== 1 ? 's' : ''} remaining today. Check the Feed tab to see it!`,
        type: 'success'
      });
      
      // Reset canvas
      setCurrentImage(null);
      setTextElements([]);
      setActiveTemplate(null);
      setImageScale(1);
      
    } catch (error) {
      console.error('Failed to post meme - Full error:', error);
      console.error('Error details:', {
        message: error.message,
        body: error.body,
        status: error.status,
        stack: error.stack
      });
      
      setNotification({
        message: `Failed to post meme: ${error.body?.message || error.message || 'Unknown error. Check console for details.'}`,
        type: 'error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="main-content">
      <div className="canvas-section" ref={containerRef}>
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            style={{ 
              display: currentImage ? 'block' : 'none', 
              maxWidth: '100%', 
              height: 'auto', 
              borderRadius: 'var(--radius-lg)', 
              cursor: isDragging ? 'grabbing' : isResizing ? 'nwse-resize' : 'default' 
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          {!currentImage && (
            <div className="canvas-placeholder">
              <p>Select or upload an image to get started</p>
              <span className="placeholder-hint">Drag text to move • Drag corner to resize • Click X to delete</span>
            </div>
          )}
        </div>

        {currentImage && (
          <div className="image-resize-control" style={{ marginTop: '1rem', textAlign: 'center' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase' }}>
              <span>Image Size: {Math.round(imageScale * 100)}%</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={imageScale}
              onChange={(e) => handleImageResize(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </div>

      <div className="controls-section">
        <ImageSelector
          templates={MEME_TEMPLATES}
          activeTemplate={activeTemplate}
          onTemplateSelect={handleLoadTemplate}
          onImageUpload={handleImageUpload}
        />

        <TextControls
          textElements={textElements}
          fontSize={fontSize}
          textColor={textColor}
          onAddText={addTextElement}
          onUpdateText={updateTextElement}
          onDeleteText={deleteTextElement}
          onFontSizeChange={(size) => {
            setFontSize(size);
            setTextElements(textElements.map(el => ({ ...el, fontSize: size })));
          }}
          onColorChange={(color) => {
            setTextColor(color);
            setTextElements(textElements.map(el => ({ ...el, color })));
          }}
        />

        <div className="download-section">
          {user && currentUser && (
            <div style={{ 
              marginBottom: '1rem', 
              padding: '0.75rem', 
              background: 'var(--card-bg)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}>
              <div style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                Daily Posts: {checkPostLimit(currentUser).remaining} / {getDailyLimit()} remaining
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Resets daily at midnight
              </div>
            </div>
          )}
          <button
            className="post-btn"
            disabled={!currentImage || isUploading || (user && !checkPostLimit(currentUser).canPost)}
            onClick={handlePost}
            title={user && !checkPostLimit(currentUser).canPost ? 'Daily limit reached' : 'Post to feed'}
          >
            <span>{isUploading ? 'Posting...' : 'Post to Feed'}</span>
          </button>
          <button
            className="download-btn"
            disabled={!currentImage}
            onClick={handleDownload}
          >
            <span>Download Meme</span>
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default MemeGenerator;
