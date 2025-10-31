import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Plus, Settings, Edit2 } from "lucide-react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { useApp } from "../../contexts/AppContext";
import { MOCK_USERS } from "../../data/mockData";
import { canEdit, canDelete } from "../../utils/permissions";
import { generateId } from "../../utils/helpers";
import KanbanColumn from "./KanbanColumn";
import Modal from "../Common/Modal";
import RichTextEditor from "../Editor/RichTextEditor";

const KanbanBoard = () => {
  const { projectId, boardId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { getBoardById, updateBoard, currentUser, addActivity, showToast } =
    useApp();

  const board = getBoardById(projectId, boardId);
  const [columns, setColumns] = useState(board?.columns || []);
  const [editingCard, setEditingCard] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);
  const [showColumnSettings, setShowColumnSettings] = useState(false);

  // Column configuration state
  const [newColumnName, setNewColumnName] = useState("");
  const [columnColors, setColumnColors] = useState(
    board?.columnColors || {
      "To Do": "bg-gray-200",
      "In Progress": "bg-blue-200",
      Done: "bg-green-200",
    }
  );

  if (!board) {
    return (
      <div
        className={`p-8 ${
          isDark ? "bg-gray-900" : "bg-white"
        } h-full flex items-center justify-center`}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Board not found</h2>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const user = MOCK_USERS.find((u) => u.id === currentUser.id);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (type === "column") {
      // Handle column reordering
      const newColumnOrder = Array.from(columns);
      const [removed] = newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, removed);

      setColumns(newColumnOrder);
      updateBoard(projectId, { ...board, columns: newColumnOrder });
      return;
    }

    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find(
      (col) => col.id === destination.droppableId
    );
    const card = sourceColumn.cards.find((c) => c.id === draggableId);

    if (source.droppableId === destination.droppableId) {
      // Moving within the same column
      const newCards = Array.from(sourceColumn.cards);
      newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, card);

      const newColumns = columns.map((col) =>
        col.id === sourceColumn.id ? { ...col, cards: newCards } : col
      );

      setColumns(newColumns);
      updateBoard(projectId, { ...board, columns: newColumns });
    } else {
      // Moving to a different column
      const sourceCards = Array.from(sourceColumn.cards);
      sourceCards.splice(source.index, 1);
      const destCards = Array.from(destColumn.cards);
      destCards.splice(destination.index, 0, card);

      const newColumns = columns.map((col) => {
        if (col.id === source.droppableId) {
          return { ...col, cards: sourceCards };
        }
        if (col.id === destination.droppableId) {
          return { ...col, cards: destCards };
        }
        return col;
      });

      setColumns(newColumns);
      updateBoard(projectId, { ...board, columns: newColumns });
      addActivity({
        type: "card_move",
        user: currentUser.id,
        resource: card.title,
        timestamp: new Date().toISOString(),
      });
      showToast(`Moved "${card.title}" to ${destColumn.title}`);
    }
  };

  const addColumn = () => {
    if (!newColumnName.trim()) return;

    const newColumn = {
      id: generateId(),
      title: newColumnName,
      cards: [],
    };

    const updatedColumns = [...columns, newColumn];
    setColumns(updatedColumns);
    updateBoard(projectId, {
      ...board,
      columns: updatedColumns,
      columnColors: {
        ...columnColors,
        [newColumnName]: `bg-gray-200`,
      },
    });
    setNewColumnName("");
  };

  const updateColumn = (columnId, updates) => {
    const newColumns = columns.map((col) =>
      col.id === columnId ? { ...col, ...updates } : col
    );
    setColumns(newColumns);
    updateBoard(projectId, { ...board, columns: newColumns });
    setEditingColumn(null);
  };

  const deleteColumn = (columnId) => {
    const newColumns = columns.filter((col) => col.id !== columnId);
    setColumns(newColumns);
    updateBoard(projectId, { ...board, columns: newColumns });
  };

  const addCard = (columnId) => {
    const newCard = {
      id: generateId(),
      title: "New Task",
      description: "",
      labels: [],
      assignee: currentUser.id,
      dueDate: new Date().toISOString().split("T")[0],
      linkedPage: null,
      richDescription: "",
    };

    const newColumns = columns.map((col) => {
      if (col.id === columnId) {
        return { ...col, cards: [...col.cards, newCard] };
      }
      return col;
    });

    setColumns(newColumns);
    updateBoard(projectId, { ...board, columns: newColumns });
    setEditingCard(newCard);
    showToast("Card created");
  };

  const updateCard = (updatedCard) => {
    const newColumns = columns.map((col) => ({
      ...col,
      cards: col.cards.map((c) => (c.id === updatedCard.id ? updatedCard : c)),
    }));
    setColumns(newColumns);
    updateBoard(projectId, { ...board, columns: newColumns });
    setEditingCard(null);
    showToast("Card updated");
  };

  const deleteCard = (cardId) => {
    const newColumns = columns.map((col) => ({
      ...col,
      cards: col.cards.filter((c) => c.id !== cardId),
    }));
    setColumns(newColumns);
    updateBoard(projectId, { ...board, columns: newColumns });
    setEditingCard(null);
    showToast("Card deleted");
  };

  return (
    <div
      className={`h-full flex flex-col ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div
        className={`p-6 border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/project/${projectId}`)}
            className={`p-2 rounded ${
              isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold">{board.name}</h1>
        </div>
      </div>

      {/* Board Controls */}
      <div
        className={`px-6 py-3 border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowColumnSettings(true)}
              className={`px-3 py-1 rounded-lg flex items-center gap-2 ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Settings size={16} />
              Column Settings
            </button>
          </div>

          {/* Add Column Form */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="New column name..."
              className={`px-3 py-1 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              }`}
            />
            <button
              onClick={addColumn}
              className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
            >
              <Plus size={16} />
              Add Column
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="board" type="column" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-4 h-full pb-4"
              >
                <AnimatePresence>
                  {columns.map((column, index) => (
                    <motion.div
                      key={column.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                    >
                      <KanbanColumn
                        column={column}
                        index={index}
                        onAddCard={addCard}
                        onEditCard={setEditingCard}
                        onEditColumn={setEditingColumn}
                        onDeleteColumn={deleteColumn}
                        canEdit={canEdit(user.role)}
                        color={columnColors[column.title]}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Column Settings Modal */}
      <Modal
        isOpen={showColumnSettings}
        onClose={() => setShowColumnSettings(false)}
        title="Column Settings"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Customize your board columns. Drag to reorder.
          </p>

          <div className="space-y-2">
            {columns.map((column, index) => (
              <div
                key={column.id}
                className={`p-3 rounded-lg ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                } flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded ${columnColors[column.title]}`}
                  />
                  <span>{column.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingColumn(column)}
                    className={`p-2 rounded hover:bg-opacity-80 ${
                      isDark ? "hover:bg-gray-600" : "hover:bg-gray-200"
                    }`}
                  >
                    <Edit2 size={16} />
                  </button>
                  {columns.length > 1 && (
                    <button
                      onClick={() => deleteColumn(column.id)}
                      className="p-2 rounded hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Edit Column Modal */}
      <Modal
        isOpen={!!editingColumn}
        onClose={() => setEditingColumn(null)}
        title="Edit Column"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Column Name
            </label>
            <input
              type="text"
              value={editingColumn?.title || ""}
              onChange={(e) =>
                setEditingColumn({ ...editingColumn, title: e.target.value })
              }
              className={`w-full p-3 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Column Color
            </label>
            <select
              value={columnColors[editingColumn?.title]}
              onChange={(e) => {
                setColumnColors({
                  ...columnColors,
                  [editingColumn.title]: e.target.value,
                });
              }}
              className={`w-full p-3 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <option value="bg-gray-200">Gray</option>
              <option value="bg-blue-200">Blue</option>
              <option value="bg-green-200">Green</option>
              <option value="bg-yellow-200">Yellow</option>
              <option value="bg-red-200">Red</option>
              <option value="bg-purple-200">Purple</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => setEditingColumn(null)}
              className={`px-4 py-2 rounded ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                updateColumn(editingColumn.id, {
                  title: editingColumn.title,
                });
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Card Modal */}
      <Modal
        isOpen={!!editingCard}
        onClose={() => setEditingCard(null)}
        title="Edit Card"
      >
        {editingCard && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={editingCard.title}
                onChange={(e) =>
                  setEditingCard({ ...editingCard, title: e.target.value })
                }
                className={`w-full p-3 rounded-lg ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Card title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={editingCard.description}
                onChange={(e) =>
                  setEditingCard({
                    ...editingCard,
                    description: e.target.value,
                  })
                }
                className={`w-full p-3 rounded-lg h-32 ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Add a description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Assignee
                </label>
                <select
                  value={editingCard.assignee}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, assignee: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {MOCK_USERS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editingCard.dueDate}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, dueDate: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Labels (comma-separated)
              </label>
              <input
                type="text"
                value={editingCard.labels.join(", ")}
                onChange={(e) =>
                  setEditingCard({
                    ...editingCard,
                    labels: e.target.value
                      .split(",")
                      .map((l) => l.trim())
                      .filter((l) => l),
                  })
                }
                className={`w-full p-3 rounded-lg ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Design, High Priority, Bug"
              />
            </div>

            <div className="flex justify-between pt-4">
              {canDelete(user.role) && (
                <button
                  onClick={() => deleteCard(editingCard.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => setEditingCard(null)}
                  className={`px-4 py-2 rounded-lg ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateCard(editingCard)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default KanbanBoard;
