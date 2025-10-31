import { memo } from "react";

const CollaboratorCursor = memo(({ cursor, isDark }) => {
  const { user, top, left } = cursor;
  const color = `hsl(${hashCode(user.id) % 360}, 70%, 50%)`;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        transform: `translate(${left}px, ${top}px)`,
      }}
    >
      {/* Cursor */}
      <div className="w-0.5 h-5 absolute" style={{ backgroundColor: color }} />

      {/* Label */}
      <div
        className="absolute whitespace-nowrap px-2 py-1 text-xs text-white rounded"
        style={{
          backgroundColor: color,
          top: "-1.5rem",
          left: "0.25rem",
        }}
      >
        {user.name}
      </div>
    </div>
  );
});

// Simple hash function for consistent colors
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

CollaboratorCursor.displayName = "CollaboratorCursor";

export default CollaboratorCursor;
