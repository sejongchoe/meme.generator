/**
 * Canvas Utilities
 * Helper functions for canvas manipulation
 */

import { CANVAS_SETTINGS } from '../config/constants';

/**
 * Wrap text to fit within maximum width
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} text - Text to wrap
 * @param {number} maxWidth - Maximum width
 * @returns {string[]} Array of wrapped lines
 */
export const wrapText = (ctx, text, maxWidth) => {
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

/**
 * Convert canvas to blob
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} type - Image type (default: 'image/png')
 * @param {number} quality - Image quality (0-1)
 * @returns {Promise<Blob>} Canvas as blob
 */
export const canvasToBlob = (canvas, type = 'image/png', quality = 0.95) => {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
};

/**
 * Download canvas as image
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} filename - Download filename
 */
export const downloadCanvas = async (canvas, filename = 'meme.png') => {
  const blob = await canvasToBlob(canvas);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Load image from URL
 * @param {string} url - Image URL
 * @param {boolean} crossOrigin - Enable cross-origin (default: true)
 * @returns {Promise<HTMLImageElement>} Loaded image
 */
export const loadImage = (url, crossOrigin = true) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (crossOrigin) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Get canvas coordinates from mouse event
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {MouseEvent} event - Mouse event
 * @returns {{x: number, y: number}} Canvas coordinates
 */
export const getCanvasCoordinates = (canvas, event) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
};

/**
 * Check if point is within bounds
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {{x: number, y: number, width: number, height: number}} bounds - Bounds object
 * @returns {boolean} True if point is within bounds
 */
export const isPointInBounds = (x, y, bounds) => {
  if (!bounds) return false;
  return x >= bounds.x && 
         x <= bounds.x + bounds.width &&
         y >= bounds.y && 
         y <= bounds.y + bounds.height;
};

/**
 * Setup canvas text style
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {{fontSize: number, color: string, strokeColor?: string, lineWidth?: number}} options - Style options
 */
export const setupTextStyle = (ctx, options) => {
  const { 
    fontSize, 
    color, 
    strokeColor = CANVAS_SETTINGS.defaultStrokeColor,
    lineWidth 
  } = options;
  
  ctx.fillStyle = color;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth || Math.max(6, fontSize / 6);
  ctx.textAlign = 'center';
  ctx.font = `bold ${fontSize}px ${CANVAS_SETTINGS.fontFamily}`;
};

