import { Plus, MoreVertical } from "lucide-react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import KanbanCard from "./KanbanCard";

const KanbanColumn = ({
  column,
  index,
  onAddCard,
  onEditCard,
  onEditColumn,
  onDeleteColumn,
  canEdit,
  color,
}) => {
  const { isDark } = useTheme();

  return (
    <Draggable draggableId={column.id} index={index} isDragDisabled={!canEdit}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex-shrink-0 w-80 rounded-lg ${
            isDark ? "bg-gray-800" : "bg-white"
          } shadow-lg ${snapshot.isDragging ? "ring-2 ring-blue-500" : ""}`}
        >
          <div
            {...provided.dragHandleProps}
            className={`p-3 rounded-t-lg flex justify-between items-center cursor-grab active:cursor-grabbing ${
              color || "bg-gray-100"
            }`}
          >
            <h3
              className={`font-semibold text-lg ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {column.title}
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isDark
                    ? "bg-gray-700 bg-opacity-30"
                    : "bg-white bg-opacity-50"
                }`}
              >
                {column.cards.length}
              </span>
              {canEdit && (
                <button
                  onClick={() => onEditColumn(column)}
                  className="p-1 rounded hover:bg-gray-200 hover:bg-opacity-50"
                >
                  <MoreVertical size={16} />
                </button>
              )}
            </div>
          </div>

          <Droppable droppableId={column.id} type="card">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`p-3 min-h-[200px] transition-colors duration-200 ${
                  snapshot.isDraggingOver
                    ? isDark
                      ? "bg-gray-700 ring-2 ring-blue-500 ring-opacity-50"
                      : "bg-blue-50 ring-2 ring-blue-500 ring-opacity-50"
                    : isDark
                    ? "bg-gray-800"
                    : "bg-white"
                }`}
              >
                <div className="space-y-3">
                  {column.cards.map((card, index) => (
                    <Draggable
                      key={card.id}
                      draggableId={card.id}
                      index={index}
                      isDragDisabled={!canEdit}
                    >
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: snapshot.isDragging ? 1.05 : 1,
                            boxShadow: snapshot.isDragging
                              ? "0 8px 16px rgba(0,0,0,0.1)"
                              : "0 2px 4px rgba(0,0,0,0.05)",
                          }}
                          exit={{ opacity: 0, y: -20 }}
                          style={{
                            ...provided.draggableProps.style,
                            transformOrigin: "center",
                            zIndex: snapshot.isDragging ? 999 : "auto",
                          }}
                        >
                          <KanbanCard
                            card={card}
                            onEdit={() => onEditCard(card)}
                            isDragging={snapshot.isDragging}
                          />
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>

          {canEdit && (
            <div className="p-3 pt-0">
              <button
                onClick={() => onAddCard(column.id)}
                className={`w-full p-3 rounded-lg border-2 border-dashed ${
                  isDark
                    ? "border-gray-600 hover:border-gray-500 hover:bg-gray-700"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                } transition-all flex items-center justify-center gap-2`}
              >
                <Plus size={20} />
                Add Card
              </button>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default KanbanColumn;
