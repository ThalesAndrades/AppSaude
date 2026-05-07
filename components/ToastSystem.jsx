'use client';

import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          background: 'linear-gradient(135deg, #a8794f, #cc9835)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        },
        className: 'my-toast',
      }}
    />
  );
}

export function showSuccessToast(message, description) {
  toast.success(message, {
    description,
    icon: '🎉',
    duration: 5000,
    style: {
      background: 'linear-gradient(135deg, #10b981, #059669)',
    },
  });
}

export function showErrorToast(message, description) {
  toast.error(message, {
    description,
    icon: '❌',
    duration: 6000,
    style: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    },
  });
}

export function showInfoToast(message, description) {
  toast.info(message, {
    description,
    icon: 'ℹ️',
    duration: 4000,
    style: {
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    },
  });
}

export function showWarningToast(message, description) {
  toast.warning(message, {
    description,
    icon: '⚠️',
    duration: 5000,
    style: {
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
  });
}

export function showCustomToast(message, options = {}) {
  toast.custom(
    (t) => (
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className={`${options.className || ''} ${t.visible ? 'animate-in' : 'animate-out'}`}
      >
        <div className="bg-white rounded-lg shadow-2xl p-4 border border-gray-200 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{options.icon || '🔔'}</div>
            <div>
              <p className="font-semibold text-gray-800">{message}</p>
              {options.description && (
                <p className="text-sm text-gray-600 mt-1">{options.description}</p>
              )}
            </div>
          </div>
          {options.action && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => {
                  options.action.onClick();
                  toast.dismiss(t.id);
                }}
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                {options.action.label}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    ),
    {
      duration: options.duration || 5000,
      position: options.position || 'top-right',
    }
  );
}