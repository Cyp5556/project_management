import { useEffect } from 'react';
import { X } from 'lucide-react';

const Toast = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-slide-up">
      <span>{message}</span>
      <button onClick={onClose} className="hover:opacity-80">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;