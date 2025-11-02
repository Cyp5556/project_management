import React from "react";
import { useCollaboration } from "../../contexts/CollaborationContext";
import { useApp } from "../../contexts/AppContext";

const LiveCursor = ({ containerId }) => {
  const { cursors, updateCursorPosition } = useCollaboration();
  const { currentUser } = useApp();

  React.useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        containerWidth: rect.width,
        containerHeight: rect.height,
      };
      updateCursorPosition(position);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [containerId, updateCursorPosition]);

  return (
    <>
      {Array.from(cursors.entries()).map(([userId, cursor]) => {
        if (userId === currentUser?.id) return null;

        const { position, user } = cursor;
        if (!position) return null;

        const style = {
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          pointerEvents: "none",
          zIndex: 1000,
          transform: "translate(-50%, -50%)",
        };

        return (
          <div key={userId} style={style}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              style={{
                fill: user.color,
                filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.3))",
              }}
            >
              <path d="M0 0L16 8L8 10L6 16L0 0Z" />
            </svg>
            <div
              style={{
                backgroundColor: user.color,
                color: "#fff",
                padding: "2px 6px",
                borderRadius: "3px",
                fontSize: "12px",
                marginTop: "4px",
                whiteSpace: "nowrap",
              }}
            >
              {user.name}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default LiveCursor;
