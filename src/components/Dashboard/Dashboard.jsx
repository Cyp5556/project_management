import { useNavigate } from 'react-router-dom';
import { FileText, Layout, Users, TrendingUp } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';

const Dashboard = () => {
  const { isDark } = useTheme();
  const { projects, activities } = useApp();
  const navigate = useNavigate();

  const totalPages = projects.reduce((sum, proj) => sum + proj.pages.length, 0);
  const totalBoards = projects.reduce((sum, proj) => sum + proj.boards.length, 0);
  const totalCards = projects.reduce((sum, proj) => 
    sum + proj.boards.reduce((cardSum, board) => 
      cardSum + board.columns.reduce((colSum, col) => colSum + col.cards.length, 0)
    , 0)
  , 0);

  const stats = [
    { icon: Layout, label: 'Projects', value: projects.length, color: 'bg-blue-500' },
    { icon: FileText, label: 'Pages', value: totalPages, color: 'bg-green-500' },
    { icon: Layout, label: 'Boards', value: totalBoards, color: 'bg-purple-500' },
    { icon: TrendingUp, label: 'Tasks', value: totalCards, color: 'bg-orange-500' }
  ];

  return (
    <div className={`p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} min-h-full`}>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-4 rounded-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects Grid */}
      <h2 className="text-2xl font-bold mb-4">Your Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div
            key={project.id}
            onClick={() => navigate(`/project/${project.id}`)}
            className={`${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-lg p-6 shadow-lg cursor-pointer transition-all`}
          >
            <h3 className="text-xl font-bold mb-3">{project.name}</h3>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span>{project.pages.length} Pages</span>
              </div>
              <div className="flex items-center gap-2">
                <Layout size={16} />
                <span>{project.boards.length} Boards</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{project.members.length} Members</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Recent Activity</h2>
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-lg`}>
        {activities.slice(0, 5).map(activity => (
          <div key={activity.id} className={`py-3 border-b last:border-b-0 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                {activity.user[0]}
              </div>
              <div className="flex-1">
                <span className="font-medium">{activity.user}</span>
                <span className="text-gray-500"> {activity.type.replace('_', ' ')} </span>
                <span className="font-medium">"{activity.resource}"</span>
                <div className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-gray-500 text-center py-4">No activity yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;