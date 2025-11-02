import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useActivity } from "../../contexts/ActivityContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useCollaboration } from "../../contexts/CollaborationContext";
import { formatDistance } from "date-fns";

const LiveActivity = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { activities } = useActivity();
  const { isDark } = useTheme();
  const { isOnline } = useCollaboration();

  useEffect(() => {
    console.log("LiveActivity rendered with activities:", activities);
  }, [activities]);

  const recentActivities = activities.slice(0, 5);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full ${
          isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
        }`}
      >
        <Bell size={20} />
        {recentActivities.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
            {recentActivities.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 top-12 w-80 shadow-lg rounded-lg ${
            isDark ? "bg-gray-800" : "bg-white"
          } border ${isDark ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Recent Activity
              </h3>
              <span
                className={`flex items-center gap-1 text-xs ${
                  isOnline ? "text-green-500" : "text-gray-500"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-gray-500"
                  }`}
                />
                {isOnline ? "Live" : "Offline"}
              </span>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {recentActivities.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No recent activity
              </div>
            ) : (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-3 border-b ${
                    isDark
                      ? "border-gray-700 hover:bg-gray-700"
                      : "border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                      {activity.userName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        <span className="font-medium">{activity.userName}</span>{" "}
                        {activity.type === "page_edit"
                          ? "edited"
                          : activity.type === "card_move"
                          ? "moved"
                          : "updated"}{" "}
                        {activity.resource}
                      </p>
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {formatDistance(
                          new Date(activity.timestamp),
                          new Date(),
                          { addSuffix: true }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveActivity;
