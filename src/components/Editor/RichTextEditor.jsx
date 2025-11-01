import { useState, useEffect, useRef, useMemo } from "react";
import * as Y from "yjs";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Link as LinkIcon,
  Heading1,
  Heading2,
  CheckSquare,
  Table,
  Image,
  AtSign,
  Type,
  FileText,
  CalendarDays,
  MessageCircle,
  Users,
  Clock,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useApp } from "../../contexts/AppContext";
import { useCollaboration } from "../../contexts/CollaborationContext";
import VersionControl from "./VersionControl";

const RichTextEditor = ({ pageId, content, onChange, readOnly = false }) => {
  const [editorContent, setEditorContent] = useState(content);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [mentionSearch, setMentionSearch] = useState("");
  const [showVersions, setShowVersions] = useState(false);
  const [activeCursors, setActiveCursors] = useState({});
  const editorRef = useRef(null);
  const { isDark } = useTheme();
  const { users, currentUser, saveVersion, getVersionById } = useApp();
  const { doc, awareness, isOnline } = useCollaboration();

  // Track cursor position for mentions and slash commands
  const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });

  // Set up collaboration
  useEffect(() => {
    if (!doc || !awareness) return;

    const ytext = doc.getText("content");
    const undoManager = new Y.UndoManager(ytext);

    // Initialize content
    if (ytext.toString() === "") {
      ytext.insert(0, content);
    }

    // Listen for changes
    const observer = (event) => {
      const newContent = ytext.toString();
      setEditorContent(newContent);
      onChange?.(newContent);
    };

    ytext.observe(observer);

    // Set up awareness
    awareness.setLocalState({
      user: currentUser,
      cursor: null,
    });

    const awarenessObserver = (changes) => {
      const cursors = {};
      awareness.getStates().forEach((state, clientId) => {
        if (state.cursor && clientId !== awareness.clientID) {
          cursors[clientId] = {
            ...state.cursor,
            user: state.user,
          };
        }
      });
      setActiveCursors(cursors);
    };

    awareness.on("change", awarenessObserver);

    // Clean up
    return () => {
      ytext.unobserve(observer);
      awareness.off("change", awarenessObserver);
    };
  }, [doc, awareness, currentUser]);

  useEffect(() => {
    setEditorContent(content);
  }, [content]);

  const handleChange = (e) => {
    const newContent = e.target.value;
    const textarea = e.target;
    const cursorPos = textarea.selectionStart;

    if (doc) {
      const ytext = doc.getText("content");
      ytext.delete(0, ytext.length);
      ytext.insert(0, newContent);
    } else {
      setEditorContent(newContent);
      onChange?.(newContent);
    }

    // Update cursor position for collaboration
    if (awareness) {
      const rect = textarea.getBoundingClientRect();
      const position = getCaretCoordinates(textarea, cursorPos);
      awareness.setLocalState({
        user: currentUser,
        cursor: {
          start: textarea.selectionStart,
          end: textarea.selectionEnd,
          top: position.top,
          left: position.left,
        },
      });
    }

    // Check for slash command trigger
    if (newContent[cursorPos - 1] === "/") {
      const rect = textarea.getBoundingClientRect();
      const position = getCaretCoordinates(textarea, cursorPos);
      setSlashMenuPosition({
        top: rect.top + position.top + 20,
        left: rect.left + position.left,
      });
      setShowSlashMenu(true);
    } else if (showSlashMenu && newContent[cursorPos - 1] === " ") {
      setShowSlashMenu(false);
    }

    // Autosave version periodically
    const debounceTimer = setTimeout(() => {
      if (pageId) {
        saveVersion(pageId, newContent);
      }
    }, 5000);

    return () => clearTimeout(debounceTimer);

    // Check for mentions
    if (newContent[cursorPos - 1] === "@") {
      setMentionSearch("");
    } else if (mentionSearch !== null) {
      const lastAtSymbol = newContent.lastIndexOf("@", cursorPos - 1);
      if (lastAtSymbol !== -1) {
        const searchText = newContent.substring(lastAtSymbol + 1, cursorPos);
        setMentionSearch(searchText);
      }
    }

    setCursorPosition({
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowSlashMenu(false);
      setMentionSearch("");
    }
  };

  const insertTable = () => {
    const tableTemplate = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;
    insertFormatting(tableTemplate);
  };

  const insertCodeBlock = () => {
    insertFormatting("\n```\n", "\n```\n");
  };

  const handleImageUpload = () => {
    // In a real implementation, this would open a file picker and upload to a server
    insertFormatting("![Image description](image-url)");
  };

  const insertComment = () => {
    const timestamp = new Date().toISOString();
    const commentTemplate = `\n:comment[${currentUser.name}|${timestamp}]\nAdd your comment here\n:end-comment\n`;
    insertFormatting(commentTemplate);
  };

  const insertTemplate = (type) => {
    let template = "";
    if (type === "meeting") {
      template = `# Meeting Notes - ${new Date().toLocaleDateString()}

## Attendees
- [ ] @${currentUser.name}

## Agenda
1. 
2. 
3. 

## Discussion Points

## Action Items
- [ ] 

## Next Steps
`;
    }
    insertFormatting(template);
  };

  const insertFormatting = (prefix, suffix = "") => {
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    const before = editorContent.substring(0, start);
    const after = editorContent.substring(end);
    const newText = before + prefix + selectedText + suffix + after;
    setEditorContent(newText);
    onChange?.(newText);

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const slashCommands = useMemo(
    () => [
      {
        icon: Type,
        label: "Text",
        action: () => insertFormatting(""),
        command: "text",
      },
      {
        icon: Heading1,
        label: "Heading 1",
        action: () => insertFormatting("# "),
        command: "h1",
      },
      {
        icon: Heading2,
        label: "Heading 2",
        action: () => insertFormatting("## "),
        command: "h2",
      },
      {
        icon: Table,
        label: "Table",
        action: () => insertTable(),
        command: "table",
      },
      {
        icon: CheckSquare,
        label: "Todo List",
        action: () => insertFormatting("- [ ] "),
        command: "todo",
      },
      {
        icon: List,
        label: "Bullet List",
        action: () => insertFormatting("- "),
        command: "list",
      },
      {
        icon: ListOrdered,
        label: "Numbered List",
        action: () => insertFormatting("1. "),
        command: "numbered",
      },
      {
        icon: FileText,
        label: "Code Block",
        action: () => insertCodeBlock(),
        command: "code",
      },
      {
        icon: Image,
        label: "Image",
        action: () => handleImageUpload(),
        command: "image",
      },
      {
        icon: MessageCircle,
        label: "Comment",
        action: () => insertComment(),
        command: "comment",
      },
      {
        icon: CalendarDays,
        label: "Meeting Template",
        action: () => insertTemplate("meeting"),
        command: "meeting",
      },
    ],
    []
  );

  const toolbarButtons = [
    {
      icon: Heading1,
      action: () => insertFormatting("# "),
      label: "Heading 1",
      shortcut: "# ",
    },
    {
      icon: Heading2,
      action: () => insertFormatting("## "),
      label: "Heading 2",
      shortcut: "## ",
    },
    {
      icon: Bold,
      action: () => insertFormatting("**", "**"),
      label: "Bold",
      shortcut: "**text**",
    },
    {
      icon: Italic,
      action: () => insertFormatting("_", "_"),
      label: "Italic",
      shortcut: "_text_",
    },
    {
      icon: List,
      action: () => insertFormatting("- "),
      label: "Bullet List",
      shortcut: "- ",
    },
    {
      icon: ListOrdered,
      action: () => insertFormatting("1. "),
      label: "Numbered List",
      shortcut: "1. ",
    },
    {
      icon: CheckSquare,
      action: () => insertFormatting("- [ ] "),
      label: "Checklist",
      shortcut: "- [ ] ",
    },
    {
      icon: Code,
      action: () => insertFormatting("`", "`"),
      label: "Inline Code",
      shortcut: "`code`",
    },
    {
      icon: Table,
      action: () => insertTable(),
      label: "Table",
      shortcut: "/table",
    },
    {
      icon: Image,
      action: () => handleImageUpload(),
      label: "Image",
      shortcut: "/image",
    },
    {
      icon: AtSign,
      action: () => insertFormatting("@"),
      label: "Mention User",
      shortcut: "@user",
    },
    {
      icon: LinkIcon,
      action: () => insertFormatting("[", "](url)"),
      label: "Link",
      shortcut: "[text](url)",
    },
  ];

  return (
    <div className="flex flex-col h-full relative">
      {!readOnly && (
        <>
          <div
            className={`flex flex-wrap items-center justify-between gap-1 p-2 border-b ${
              isDark
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex flex-wrap gap-1">
              {toolbarButtons.map((btn, idx) => (
                <button
                  key={idx}
                  onClick={btn.action}
                  className={`p-2 rounded hover:bg-opacity-80 transition-colors ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  }`}
                  title={`${btn.label} (${btn.shortcut})`}
                >
                  <btn.icon size={18} />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {/* Collaboration Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-gray-500">
                  {isOnline ? "Connected" : "Offline"}
                </span>
              </div>

              {/* Active Users */}
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-500" />
                <div className="flex -space-x-2">
                  {Object.values(activeCursors).map((cursor, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs border-2 border-white"
                      title={cursor.user.name}
                    >
                      {cursor.user.name[0]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Version History Button */}
              <button
                onClick={() => setShowVersions((v) => !v)}
                className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <Clock size={14} />
                History
              </button>
            </div>
          </div>

          {/* Version History Panel */}
          {showVersions && (
            <div className="border-b">
              <VersionControl
                pageId={pageId}
                currentContent={editorContent}
                onRestore={(versionId) => {
                  // Handle version restore
                  const version = getVersionById(versionId);
                  if (version) {
                    setEditorContent(version.content);
                    onChange?.(version.content);
                  }
                  setShowVersions(false);
                }}
              />
            </div>
          )}
        </>
      )}
      <div className="relative flex-1">
        <textarea
          ref={editorRef}
          value={editorContent}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          className={`w-full h-full p-6 font-mono text-sm resize-none focus:outline-none ${
            isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
          }`}
          placeholder="Start writing... Use / for commands or @ to mention users"
        />

        {/* Collaborator Cursors */}
        {Object.entries(activeCursors).map(([clientId, cursor]) => (
          <CollaboratorCursor key={clientId} cursor={cursor} isDark={isDark} />
        ))}
      </div>

      {/* Slash Command Menu */}
      {showSlashMenu && (
        <div
          className={`absolute z-50 w-64 rounded-lg shadow-lg ${
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
          style={{ top: slashMenuPosition.top, left: slashMenuPosition.left }}
        >
          <div className="p-2">
            <input
              type="text"
              placeholder="Search commands..."
              className={`w-full px-3 py-2 rounded ${
                isDark
                  ? "bg-gray-700 text-gray-100"
                  : "bg-gray-100 text-gray-900"
              }`}
              autoFocus
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {slashCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => {
                  cmd.action();
                  setShowSlashMenu(false);
                }}
                className={`w-full px-3 py-2 flex items-center gap-2 hover:bg-opacity-80 ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <cmd.icon size={16} />
                <span className="flex-1 text-left">{cmd.label}</span>
                <span className="text-xs text-gray-500">/{cmd.command}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mentions Menu */}
      {mentionSearch !== null && mentionSearch !== "" && (
        <div
          className={`absolute z-50 w-64 rounded-lg shadow-lg ${
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
          style={{ top: slashMenuPosition.top, left: slashMenuPosition.left }}
        >
          <div className="max-h-64 overflow-y-auto">
            {users
              .filter((user) =>
                user.name.toLowerCase().includes(mentionSearch.toLowerCase())
              )
              .map((user, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const textarea = editorRef.current;
                    const start = textarea.value.lastIndexOf(
                      "@",
                      cursorPosition.start
                    );
                    const before = textarea.value.substring(0, start);
                    const after = textarea.value.substring(cursorPosition.end);
                    const newText = before + "@" + user.name + after;
                    setEditorContent(newText);
                    onChange?.(newText);
                    setMentionSearch(null);
                  }}
                  className={`w-full px-3 py-2 flex items-center gap-2 hover:bg-opacity-80 ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <AtSign size={16} />
                  <span className="flex-1 text-left">{user.name}</span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
