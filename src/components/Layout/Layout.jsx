import { Outlet } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';
import Header from './Header';
import Sidebar from './Sidebar';
import Toast from '../Common/Toast';

const Layout = () => {
  const { isDark } = useTheme();
  const { toast, setToast } = useApp();

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'dark bg-black text-white' : 'bg-white text-black'}`}>
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Layout;