import { createContext, useContext, useEffect, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useApp } from "./AppContext";

const CollaborationContext = createContext();

export function CollaborationProvider({ children }) {
  const { currentUser } = useApp();
  const [doc, setDoc] = useState(null);
  const [provider, setProvider] = useState(null);
  const [cursors, setCursors] = useState(new Map());
  const [isOnline, setIsOnline] = useState(false);
  const [awareness, setAwareness] = useState(new Map());

  useEffect(() => {
    const ydoc = new Y.Doc();
    const ws = new WebSocket("ws://localhost:3001");

    let connected = false;

    ws.onopen = () => {
      console.log("WebSocket Connected");
      setIsOnline(true);
      connected = true;

      // Request initial state
      ws.send(JSON.stringify({ type: "sync" }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "sync" || message.type === "update") {
          Y.applyUpdate(ydoc, new Uint8Array(message.data));
        } else if (message.type === "cursor") {
          setCursors((prev) => {
            const newCursors = new Map(prev);
            if (message.data) {
              newCursors.set(message.userId, {
                position: message.data.position,
                user: message.data.user,
              });
            } else {
              newCursors.delete(message.userId);
            }
            return newCursors;
          });
        }
      } catch (err) {
        console.error("Error processing message:", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
      setIsOnline(false);
      connected = false;
    };

    setDoc(ydoc);
    setProvider(ws);
    setAwareness(new Map());

    console.log("CollaborationContext initialized");

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      ydoc.destroy();
    };
  }, []);

  const updateCursorPosition = (position) => {
    if (provider && provider.readyState === WebSocket.OPEN && currentUser) {
      provider.send(
        JSON.stringify({
          type: "cursor",
          userId: currentUser.id,
          data: {
            position,
            user: {
              name: currentUser.name,
              color: currentUser.color,
            },
          },
        })
      );
    }
  };

  const value = {
    doc,
    provider,
    cursors,
    isOnline,
    updateCursorPosition,
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
}

export function useCollaboration() {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error(
      "useCollaboration must be used within a CollaborationProvider"
    );
  }
  return context;
}
