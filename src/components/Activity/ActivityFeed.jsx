import { useState } from "react";
import { Filter, Activity } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useApp } from "../../contexts/AppContext";
import { MOCK_USERS } from "../../data/mockData";
import ActivityItem from "./ActivityItem";

const ActivityFeed = () => {
  const { isDark } = useTheme();
  const { activities } = useApp();
  const [filterType, setFilterType] = useState("all");
  const [filterUser, setFilterUser] = useState("all");

  const filteredActivities = activities.filter((activity) => {
    if (filterType !== "all" && activity.type !== filterType) return false;
    if (filterUser !== "all" && activity.user !== filterUser) return false;
    return true;
  });

  const activityTypes = [
    "all",
    "page_edit",
    "card_move",
    "card_create",
    "card_delete",
  ];

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
        <h1 className="text-3xl font-bold mb-4">Activity Feed</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`px-3 py-2 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Types</option>
              {activityTypes.slice(1).map((type) => (
                <option key={type} value={type}>
                  {type
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className={`px-3 py-2 rounded-lg ${
              isDark ? "bg-gray-700" : "bg-gray-100"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="all">All Users</option>
            {MOCK_USERS.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          <div
            className={`px-3 py-2 rounded-lg ${
              isDark ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            {filteredActivities.length} activities
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-3 max-w-4xl">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          ) : (
            <div className="text-center py-12">
              <Activity size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 text-lg">No activities yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Start editing pages or managing tasks to see activity here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
