import { Plus, MoreVertical } from "lucide-react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
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
          className={`flex-shrink-0 w-80 flex flex-col rounded-lg ${
            isDark ? "bg-gray-800" : "bg-white"
          } shadow-lg ${snapshot.isDragging ? "ring-2 ring-blue-500 shadow-2xl" : ""}`}
          style={{ height: 'fit-content', maxHeight: 'calc(100vh - 250px)' }}
        >
          {/* Column Header */}
          <div
            {...provided.dragHandleProps}
            className={`p-3 rounded-t-lg flex justify-between items-center flex-shrink-0 ${
              canEdit ? "cursor-grab active:cursor-grabbing" : ""
            } ${color || "bg-gray-200"}`}
          >
            <h3 className="font-semibold text-lg text-gray-900">
              {column.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-50 text-gray-900">
                {column.cards.length}
              </span>
              {canEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditColumn(column);
                  }}
                  className="p-1 rounded hover:bg-gray-300 hover:bg-opacity-50 transition-colors"
                >
                  <MoreVertical size={16} className="text-gray-900" />
                </button>
              )}
            </div>
          </div>

          {/* Droppable Area for Cards */}
          <Droppable droppableId={column.id} type="card">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 p-3 overflow-y-auto transition-colors duration-200 ${
                  snapshot.isDraggingOver
                    ? isDark
                      ? "bg-gray-700 ring-2 ring-blue-500 ring-opacity-50 ring-inset"
                      : "bg-blue-50 ring-2 ring-blue-500 ring-opacity-50 ring-inset"
                    : isDark
                    ? "bg-gray-800"
                    : "bg-white"
                }`}
                style={{
                  minHeight: column.cards.length === 0 ? '120px' : '60px',
                }}
              >
                <div className="space-y-3">
                  {column.cards.map((card, cardIndex) => (
                    <Draggable
                      key={card.id}
                      draggableId={card.id}
                      index={cardIndex}
                      isDragDisabled={!canEdit}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            transform: snapshot.isDragging 
                              ? provided.draggableProps.style?.transform 
                              : 'translate(0px, 0px)',
                          }}
                        >
                          <KanbanCard
                            card={card}
                            onEdit={() => onEditCard(card)}
                            isDragging={snapshot.isDragging}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>

                {/* Empty State */}
                {column.cards.length === 0 && !snapshot.isDraggingOver && (
                  <div className={`text-center py-4 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    <p className="text-sm">No cards yet</p>
                    {canEdit && (
                      <p className="text-xs mt-1">Drag cards here or click "Add Card"</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </Droppable>

          {/* Add Card Button */}
          {canEdit && (
            <div className="p-3 flex-shrink-0 border-t" style={{
              borderColor: isDark ? '#374151' : '#e5e7eb'
            }}>
              <button
                onClick={() => onAddCard(column.id)}
                className={`w-full p-2.5 rounded-lg border-2 border-dashed ${
                  isDark
                    ? "border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                } transition-all flex items-center justify-center gap-2 font-medium text-sm`}
              >
                <Plus size={18} />
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