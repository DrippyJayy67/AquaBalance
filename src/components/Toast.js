import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 0, showConfirmButton = false }) => {
  useEffect(() => {
    if (isVisible && duration > 0 && !showConfirmButton) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration, showConfirmButton]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <i className="fas fa-check-circle"></i>;
      case 'error':
        return <i className="fas fa-exclamation-circle"></i>;
      case 'warning':
        return <i className="fas fa-exclamation-triangle"></i>;
      case 'info':
        return <i className="fas fa-info-circle"></i>;
      default:
        return <i className="fas fa-check-circle"></i>;
    }
  };

  return (
    <>
      <div className="toast-overlay" onClick={onClose}></div>
      <div className={`toast toast-${type} toast-centered ${isVisible ? 'toast-visible' : ''}`}>
        <div className="toast-content">
          <div className="toast-icon">
            {getIcon()}
          </div>
          <div className="toast-message">
            {message}
          </div>
          {!showConfirmButton && (
            <button className="toast-close" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        
        {showConfirmButton && (
          <div className="toast-actions">
            <button className="toast-confirm-btn" onClick={onClose}>
              Okay
            </button>
          </div>
        )}
        
        {duration > 0 && !showConfirmButton && (
          <div className="toast-progress">
            <div className="toast-progress-bar" style={{ animationDuration: `${duration}ms` }}></div>
          </div>
        )}
      </div>
    </>
  );
};

export default Toast;