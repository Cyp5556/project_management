import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg w-full ${maxWidth} max-h-[90vh] overflow-auto`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className="text-xl font-bold">{title}</h3>
          <button 
            onClick={onClose}
            className={`p-2 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;