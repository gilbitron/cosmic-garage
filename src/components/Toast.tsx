import { useEffect, useState, useCallback, createContext, useContext, ReactNode } from 'react';

interface ToastMessage {
  id: number;
  text: string;
  icon?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (text: string, icon?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

let nextId = 0;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, icon = '🔔', duration = 4000) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, text, icon, duration }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onDismiss }: { toast: ToastMessage; onDismiss: () => void }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true));
    // Auto-dismiss
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 200);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.duration, onDismiss]);

  return (
    <div
      onClick={onDismiss}
      className={`bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 shadow-lg cursor-pointer
        transition-all duration-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg shrink-0">{toast.icon}</span>
        <p className="text-sm text-gray-200">{toast.text}</p>
      </div>
    </div>
  );
};
