import { useState } from 'react';
import {
  Layout,
  FileText,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { isDark } = useTheme();
  const { projects, currentProject, setCurrentProject } = useApp();
  const [expandedProjects, setExpandedProjects] = useState([projects[0]?.id]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleProject = (projectId) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectProject = (project) => {
    setCurrentProject(project);
    toggleProject(project.id);
    navigate(`/project/${project.id}`);
  };

  const handleSelectPage = (project, page) => {
    setCurrentProject(project);
    navigate(`/project/${project.id}/page/${page.id}`);
  };

  const handleSelectBoard = (project, board) => {
    setCurrentProject(project);
    navigate(`/project/${project.id}/board/${board.id}`);
  };

  return (
    <div
      className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-gray-100'
      } border-r ${isDark ? 'border-gray-700' : 'border-gray-200'} overflow-hidden flex flex-col`}
    >
      {/* Collapse / Expand button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`self-end p-2 m-2 rounded ${
          isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
        } transition-colors`}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
      </button>

      {/* Projects list */}
      <div className="flex-1 p-4 overflow-auto">
        {!isCollapsed && (
          <>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Layout size={20} />
              Projects
            </h3>

            <div className="space-y-2">
              {projects.map((project) => (
                <div key={project.id}>
                  <div
                    onClick={() => handleSelectProject(project)}
                    className={`p-2 rounded cursor-pointer flex items-center justify-between ${
                      currentProject?.id === project.id
                        ? 'bg-blue-500 text-white'
                        : isDark
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <span className="font-medium">{project.name}</span>
                    {expandedProjects.includes(project.id) ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </div>

                  {expandedProjects.includes(project.id) && (
                    <div className="ml-4 mt-2 space-y-1">
                      {/* Pages */}
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                        Pages
                      </div>
                      {project.pages.map((page) => (
                        <div
                          key={page.id}
                          onClick={() => handleSelectPage(project, page)}
                          className={`p-2 rounded cursor-pointer text-sm flex items-center gap-2 ${
                            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                          } transition-colors`}
                        >
                          <FileText size={14} />
                          {page.title}
                        </div>
                      ))}

                      {/* Boards */}
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1 mt-3">
                        Boards
                      </div>
                      {project.boards.map((board) => (
                        <div
                          key={board.id}
                          onClick={() => handleSelectBoard(project, board)}
                          className={`p-2 rounded cursor-pointer text-sm flex items-center gap-2 ${
                            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                          } transition-colors`}
                        >
                          <Layout size={14} />
                          {board.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;