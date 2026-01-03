/**
 * Image Selector Component
 * Handles template selection and custom image upload
 */

import { useRef } from 'react';

const ImageSelector = ({ templates, activeTemplate, onTemplateSelect, onImageUpload }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="control-card">
      <div className="card-header">
        <h2>Image</h2>
      </div>
      <div className="card-content">
        <label
          htmlFor="imageUpload"
          className="upload-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          <span>Upload Image</span>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          id="imageUpload"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onImageUpload}
        />

        <div className="divider">
          <span>or</span>
        </div>

        <div className="templates-section">
          <h3>Choose Template</h3>
          <div className="template-buttons">
            {templates.map((template) => (
              <button
                key={template.id}
                className={`template-btn ${activeTemplate === template.id ? 'active' : ''}`}
                onClick={() => onTemplateSelect(template)}
                title={`${template.name} - ${template.category}`}
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSelector;

