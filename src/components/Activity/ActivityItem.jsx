import { useTheme } from '../../contexts/ThemeContext';
import { MOCK_USERS } from '../../data/mockData';
import { formatDateTime } from '../../utils/helpers';

const ActivityItem = ({ activity }) => {
  const { isDark } = useTheme();
  const user = MOCK_USERS.find(u => u.id === activity.user);

  const getActivityText = () => {
    switch (activity.type) {
      case 'page_edit':
        return `edited page "${activity.resource}"`;
      case 'card_move':
        return `moved card "${activity.resource}"`;
      case 'card_create':
        return `created card "${activity.resource}"`;
      case 'card_delete':
        return `deleted card "${activity.resource}"`;
      default:
        return `performed action on "${activity.resource}"`;
    }
  };

  return (
    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'} hover:scale-[1.02] transition-transform`}>
      <div className="flex items-start gap-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
          style={{ backgroundColor: user?.color || '#3b82f6' }}
        >
          {user?.name[0] || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium">{user?.name || 'Unknown User'}</div>
          <div className="text-sm text-gray-500 mt-1">
            {getActivityText()}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            {formatDateTime(activity.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;