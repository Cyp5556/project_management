import { useState } from "react";
import {
  User,
  Clock,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { MOCK_USERS } from "../../data/mockData";
import { formatDate } from "../../utils/helpers";

const KanbanCard = ({ card, onEdit, isDragging }) => {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const assignee = MOCK_USERS.find((u) => u.id === card.assignee);

  return (
    <div
      onClick={() => !isDragging && onEdit(card)}
      className={`
        p-4 rounded-lg cursor-pointer select-none
        ${
          isDark
            ? `bg-gray-700 hover:bg-gray-600 border-gray-600`
            : `bg-white hover:bg-gray-50 border-gray-200`
        }
        ${isDragging ? "ring-2 ring-blue-500 shadow-2xl opacity-80 scale-105" : "shadow-md"}
        transform transition-all duration-150
        border
      `}
    >
      <div className="space-y-3">
        {/* Card Title */}
        <div className={`font-semibold text-base leading-tight ${
          isDark ? "text-white" : "text-gray-900"
        }`}>
          {card.title}
        </div>

        {/* Card Description */}
        {card.description && (
          <div className="relative">
            <div className={`text-sm ${
              isExpanded ? '' : 'line-clamp-2'
            } ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {card.description}
            </div>

            {card.description.length > 80 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className={`mt-1 text-xs font-medium flex items-center gap-1 ${
                  isDark
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-800"
                }`}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp size={12} /> Show less
                  </>
                ) : (
                  <>
                    <ChevronDown size={12} /> Show more
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Card Labels */}
        {card.labels && card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {card.labels.map((label, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                  isDark
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Card Footer */}
        <div className="flex justify-between items-center text-xs pt-1">
          {assignee && (
            <div className="flex items-center gap-1">
              <User
                size={13}
                className={isDark ? "text-gray-400" : "text-gray-500"}
              />
              <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                {assignee.name}
              </span>
            </div>
          )}
          {card.dueDate && (
            <div className="flex items-center gap-1">
              <Clock
                size={13}
                className={isDark ? "text-gray-400" : "text-gray-500"}
              />
              <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                {formatDate(card.dueDate)}
              </span>
            </div>
          )}
        </div>

        {/* Linked Page Indicator */}
        {card.linkedPage && (
          <div className={`flex items-center gap-1 text-xs ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`}>
            <LinkIcon size={11} />
            <span>Linked to {card.linkedPage.title || "page"}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanCard;