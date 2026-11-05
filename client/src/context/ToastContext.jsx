import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: { Comp: CheckCircle2, cls: 'toast-icon--success' },
  error: { Comp: AlertCircle, cls: 'toast-icon--error' },
  info: { Comp: Info, cls: 'toast-icon--info' }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="toast-container" role="status" aria-live="polite">
        {toasts.map((toast) => {
          const meta = ICONS[toast.type] || ICONS.success;
          const IconComp = meta.Comp;
          return (
            <div key={toast.id} className="toast" role="alert">
              <span className={`toast-icon ${meta.cls}`} aria-hidden="true">
                <IconComp size={19} />
              </span>
              <div className="toast-message">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="toast-close"
                aria-label="Dismiss notification"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
