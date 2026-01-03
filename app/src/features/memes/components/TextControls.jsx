/**
 * Text Controls Component
 * Manages text elements and styling with delete buttons
 */

const TextControls = ({
  textElements,
  fontSize,
  textColor,
  onAddText,
  onUpdateText,
  onDeleteText,
  onFontSizeChange,
  onColorChange
}) => {
  return (
    <div className="control-card">
      <div className="card-header">
        <h2>Text</h2>
      </div>
      <div className="card-content">
        <div id="textElementsContainer">
          {textElements.map((element) => (
            <div key={element.id} className="text-element-item" style={{ position: 'relative' }}>
              <div className="text-element-header">
                <span className="text-element-label">Text {element.id + 1}</span>
                <button
                  className="delete-text-btn-x"
                  onClick={() => onDeleteText(element.id)}
                  aria-label={`Delete text ${element.id + 1}`}
                  title="Delete text"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    color: 'var(--orange-color)',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all var(--transition-fast)',
                    padding: 0
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--orange-color)';
                    e.target.style.color = 'white';
                    e.target.style.borderColor = 'var(--orange-color)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'var(--orange-color)';
                    e.target.style.borderColor = 'var(--border-color)';
                  }}
                >
                  ×
                </button>
              </div>
              <input
                type="text"
                className="text-element-input"
                placeholder="Enter text..."
                value={element.text}
                onChange={(e) => onUpdateText(element.id, { text: e.target.value })}
                aria-label={`Text input ${element.id + 1}`}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Size: {element.fontSize}px
              </div>
            </div>
          ))}
        </div>

        <button className="add-text-btn" onClick={onAddText}>
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
              onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
              aria-label="Font size"
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
                onChange={(e) => onColorChange(e.target.value)}
                aria-label="Text color"
              />
              <span
                className="color-preview"
                style={{ backgroundColor: textColor }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextControls;

