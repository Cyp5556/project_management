import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, Plus, Search, Trash2, Edit2, ChevronRight, 
  FolderOpen, Clock, User, MoreVertical 
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';
import { MOCK_USERS } from '../../data/mockData';
import { canEdit, canDelete } from '../../utils/permissions';
import { formatDateTime, generateId } from '../../utils/helpers';
import Modal from '../Common/Modal';

const PageList = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { getProjectById, updatePage, currentUser, showToast, setProjects, projects } = useApp();
  
  const project = getProjectById(projectId);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [editingPage, setEditingPage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  if (!project) {
    return (
      <div className={`p-8 ${isDark ? 'bg-gray-900' : 'bg-white'} h-full flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const user = MOCK_USERS.find(u => u.id === currentUser.id);
  
  // Filter pages based on search query
  const filteredPages = project.pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createNewPage = () => {
    if (!newPageTitle.trim()) {
      showToast('Please enter a page title');
      return;
    }

    const newPage = {
      id: generateId(),
      title: newPageTitle,
      content: `# ${newPageTitle}\n\nStart writing your content here...`,
      parentId: null,
      children: [],
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const updatedProject = {
      ...project,
      pages: [...project.pages, newPage]
    };

    setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
    setShowCreateModal(false);
    setNewPageTitle('');
    showToast(`Page "${newPageTitle}" created successfully`);
    navigate(`/project/${projectId}/page/${newPage.id}`);
  };

  const handleEditTitle = () => {
    if (!editingPage || !editingPage.title.trim()) {
      showToast('Please enter a valid title');
      return;
    }

    updatePage(projectId, editingPage);
    setEditingPage(null);
    showToast('Page title updated');
  };

  const handleDeletePage = (pageId) => {
    const pageToDelete = project.pages.find(p => p.id === pageId);
    
    const updatedProject = {
      ...project,
      pages: project.pages.filter(p => p.id !== pageId)
    };

    setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
    setShowDeleteConfirm(null);
    showToast(`Page "${pageToDelete.title}" deleted`);
  };

  const duplicatePage = (page) => {
    const duplicatedPage = {
      ...page,
      id: generateId(),
      title: `${page.title} (Copy)`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const updatedProject = {
      ...project,
      pages: [...project.pages, duplicatedPage]
    };

    setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
    showToast(`Page duplicated successfully`);
  };

  return (
    <div className={`h-full flex flex-col ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FolderOpen size={32} />
              {project.name} - Pages
            </h1>
            <p className="text-gray-500 mt-2">
              {project.pages.length} {project.pages.length === 1 ? 'page' : 'pages'} in this project
            </p>
          </div>
          
          {canEdit(user.role) && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              New Page
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search pages by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg ${
              isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-auto p-6">
        {filteredPages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPages.map(page => (
              <div
                key={page.id}
                className={`${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} rounded-lg p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group relative`}
              >
                {/* Dropdown Menu */}
                {canEdit(user.role) && (
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPage(editingPage?.id === page.id ? null : page);
                        }}
                        className={`p-2 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                      >
                        <MoreVertical size={18} />
                      </button>
                      
                      {editingPage?.id === page.id && (
                        <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-10 ${
                          isDark ? 'bg-gray-700' : 'bg-white'
                        } border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/project/${projectId}/page/${page.id}`);
                              setEditingPage(null);
                            }}
                            className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                              isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                            } rounded-t-lg`}
                          >
                            <Edit2 size={16} />
                            Edit Content
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicatePage(page);
                              setEditingPage(null);
                            }}
                            className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                              isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                            }`}
                          >
                            <FileText size={16} />
                            Duplicate
                          </button>
                          {canDelete(user.role) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteConfirm(page);
                                setEditingPage(null);
                              }}
                              className={`w-full px-4 py-2 text-left flex items-center gap-2 text-red-500 ${
                                isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                              } rounded-b-lg`}
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Page Content */}
                <div onClick={() => navigate(`/project/${projectId}/page/${page.id}`)}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <FileText size={24} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold mb-1 truncate">{page.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {page.content.substring(0, 100)}...
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={14} />
                      <span>Modified {formatDateTime(page.lastModified || page.createdAt || new Date().toISOString())}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User size={14} />
                      <span>Created by {MOCK_USERS.find(u => u.id === (page.createdBy || currentUser.id))?.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            {searchQuery ? (
              <>
                <Search size={64} className="text-gray-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">No pages found</h3>
                <p className="text-gray-500 mb-4">
                  No pages match your search query "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <FileText size={64} className="text-gray-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">No pages yet</h3>
                <p className="text-gray-500 mb-4">
                  Create your first page to start documenting your project
                </p>
                {canEdit(user.role) && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Create First Page
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Create Page Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewPageTitle('');
        }}
        title="Create New Page"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Page Title</label>
            <input
              type="text"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createNewPage()}
              className={`w-full p-3 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter page title..."
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowCreateModal(false);
                setNewPageTitle('');
              }}
              className={`px-4 py-2 rounded-lg ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={createNewPage}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Create Page
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Delete Page"
        maxWidth="max-w-md"
      >
        {showDeleteConfirm && (
          <div className="space-y-4">
            <p className="text-gray-500">
              Are you sure you want to delete "{showDeleteConfirm.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className={`px-4 py-2 rounded-lg ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePage(showDeleteConfirm.id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PageList;