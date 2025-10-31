import { Sun, Moon, Activity, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const { currentProject, currentUser } = useApp();
  const navigate = useNavigate();

  return (
    <div className={`h-16 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b flex items-center justify-between px-6`}>
      <div className="flex items-center gap-4">
        <h1 
          className="text-xl font-bold cursor-pointer hover:text-blue-500 transition-colors"
          onClick={() => navigate('/')}
        >
          ProjecFlow
        </h1>
        {currentProject && (
          <div className={`px-3 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} text-sm`}>
            {currentProject.name}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/activity')}
          className={`p-2 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
          title="Activity Feed"
        >
          <Activity size={20} />
        </button>
        
        <button
          onClick={toggleTheme}
          className={`p-2 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
          title="Toggle Theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/profile')}>
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
            style={{ backgroundColor: currentUser.color }}
          >
            {currentUser.name[0]}
          </div>
          <div>
            <div className="text-sm font-medium">{currentUser.name}</div>
            <div className="text-xs text-gray-500">{currentUser.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;