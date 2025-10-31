import { useState } from "react";
import {
  User,
  Clock,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { MOCK_USERS } from "../../data/mockData";
import { formatDate } from "../../utils/helpers";
import RichTextEditor from "../Editor/RichTextEditor";

const KanbanCard = ({ card, onEdit, isDragging }) => {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const assignee = MOCK_USERS.find((u) => u.id === card.assignee);

  return (
    <motion.div
      layout
      onClick={() => onEdit(card)}
      className={`
        p-4 rounded-lg cursor-grab active:cursor-grabbing select-none
        ${
          isDark
            ? `bg-gray-700 ${
                isDragging ? "ring-2 ring-blue-500 shadow-xl" : ""
              } hover:bg-gray-600`
            : `bg-white ${
                isDragging ? "ring-2 ring-blue-500 shadow-xl" : ""
              } hover:bg-gray-50`
        }
        transform transition-all duration-200
        ${isDragging ? "scale-105" : "hover:scale-102"}
        shadow-sm hover:shadow-md
      `}
    >
      <div className="space-y-3">
        <div
          className={`font-semibold text-base ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {card.title}
        </div>

        {card.description && (
          <div className="relative">
            <AnimatePresence>
              {isExpanded ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm"
                >
                  <RichTextEditor
                    content={card.richDescription || card.description}
                    readOnly
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-gray-500 line-clamp-2"
                >
                  {card.description}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className={`
                absolute bottom-0 right-0 p-1 text-xs
                ${
                  isDark
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-600 hover:text-gray-800"
                }
              `}
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        )}

        {card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.labels.map((label, idx) => (
              <span
                key={idx}
                className={`
                  px-2 py-1 text-xs rounded-full
                  ${
                    isDark
                      ? "bg-gray-600 text-gray-200"
                      : "bg-gray-200 text-gray-700"
                  }
                `}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center text-sm">
          {assignee && (
            <div className="flex items-center gap-1">
              <User
                size={14}
                className={isDark ? "text-gray-400" : "text-gray-500"}
              />
              <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                {assignee.name}
              </span>
            </div>
          )}
          {card.dueDate && (
            <div className="flex items-center gap-1">
              <Clock
                size={14}
                className={isDark ? "text-gray-400" : "text-gray-500"}
              />
              <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                {formatDate(card.dueDate)}
              </span>
            </div>
          )}
        </div>

        {card.linkedPage && (
          <div className="flex items-center gap-1 text-xs text-blue-500">
            <LinkIcon size={12} />
            <span>Linked to {card.linkedPage.title || "page"}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default KanbanCard;
