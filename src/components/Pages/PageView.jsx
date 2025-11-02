import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Edit2, Clock, User, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';
import { MOCK_USERS } from '../../data/mockData';
import { canEdit } from '../../utils/permissions';
import { generateId, formatDateTime } from '../../utils/helpers';
import RichTextEditor from '../Editor/RichTextEditor';

const PageView = () => {
  const { projectId, pageId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { getPageById, updatePage, currentUser, addActivity, showToast } = useApp();
  
  const page = getPageById(projectId, pageId);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(page?.content || '');
  const [versions, setVersions] = useState([
    { id: 'v1', content: page?.content || '', author: currentUser.id, timestamp: new Date().toISOString() }
  ]);
  const [showVersions, setShowVersions] = useState(false);

  if (!page) {
    return (
      <div className={`p-8 ${isDark ? 'bg-gray-900' : 'bg-white'} h-full flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Page not found</h2>
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

  const handleSave = () => {
    const newVersion = {
      id: generateId(),
      content,
      author: currentUser.id,
      timestamp: new Date().toISOString()
    };
    setVersions([newVersion, ...versions]);
    updatePage(projectId, { ...page, content });
    setIsEditing(false);
    addActivity({
      type: 'page_edit',
      user: currentUser.id,
      resource: page.title,
      timestamp: new Date().toISOString()
    });
    showToast(`Page "${page.title}" saved successfully`);
  };

  const restoreVersion = (version) => {
    setContent(version.content);
    updatePage(projectId, { ...page, content: version.content });
    setShowVersions(false);
    showToast('Version restored successfully');
  };

  const renderMarkdown = (text) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-4xl font-bold mb-4 mt-6">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-3xl font-bold mb-3 mt-5">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-2xl font-bold mb-2 mt-4">{line.substring(4)}</h3>;
      }
      if (line.startsWith('- [ ]')) {
        return (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <input type="checkbox" className="w-4 h-4" />
            <span>{line.substring(5)}</span>
          </div>
        );
      }
      if (line.startsWith('- [x]')) {
        return (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <input type="checkbox" checked readOnly className="w-4 h-4" />
            <span className="line-through text-gray-500">{line.substring(5)}</span>
          </div>
        );
      }
      if (line.startsWith('- ')) {
        return <li key={idx} className="ml-6 mb-1">{line.substring(2)}</li>;
      }
      if (line.match(/^\d+\. /)) {
        return <li key={idx} className="ml-6 mb-1 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
      }
      if (line.includes('**') && line.split('**').length > 2) {
        const parts = line.split('**');
        return (
          <p key={idx} className="mb-2">
            {parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
          </p>
        );
      }
      if (line.includes('`') && line.split('`').length > 2) {
        const parts = line.split('`');
        return (
          <p key={idx} className="mb-2">
            {parts.map((part, i) => i % 2 === 1 ? 
              <code key={i} className={`px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} font-mono text-sm`}>
                {part}
              </code> : part
            )}
          </p>
        );
      }
      if (line.trim() === '') {
        return <br key={idx} />;
      }
      return <p key={idx} className="mb-2">{line}</p>;
    });
  };

  const user = MOCK_USERS.find(u => u.id === currentUser.id);

  return (
    <div
      className={`h-full flex flex-col ${isDark ? "bg-gray-900" : "bg-white"}`}
    >
      {/* Header */}
      <div
        className={`p-6 border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(`/project/${projectId}`)}
            className={`p-2 rounded ${
              isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold">{page.title}</h1>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>Last edited by {user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{formatDateTime(versions[0]?.timestamp)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowVersions(!showVersions)}
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              } transition-colors`}
            >
              <Clock size={16} />
              Versions ({versions.length})
            </button>
            {canEdit(user.role) &&
              (isEditing ? (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Version History */}
      {showVersions && (
        <div
          className={`p-6 border-b ${
            isDark
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <h3 className="font-semibold text-lg mb-4">Version History</h3>
          <div className="space-y-3">
            {versions.map((version, idx) => {
              const author = MOCK_USERS.find((u) => u.id === version.author);
              return (
                <div
                  key={version.id}
                  className={`p-4 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-white"
                  } flex justify-between items-center shadow`}
                >
                  <div>
                    <div className="font-medium">
                      Version {versions.length - idx}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <span>{author?.name}</span>
                      <span>•</span>
                      <span>{formatDateTime(version.timestamp)}</span>
                    </div>
                  </div>
                  {idx !== 0 && (
                    <button
                      onClick={() => restoreVersion(version)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
                    >
                      Restore
                    </button>
                  )}
                  {idx === 0 && (
                    <span className="px-4 py-2 bg-green-500 text-white rounded text-sm">
                      Current
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isEditing ? (
          <RichTextEditor
            pageId={pageId}
            content={content}
            onChange={setContent}
            readOnly={false}
          />
        ) : (
          <div
            className={`p-8 max-w-4xl mx-auto ${isDark ? "prose-invert" : ""}`}
          >
            {renderMarkdown(content)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageView;