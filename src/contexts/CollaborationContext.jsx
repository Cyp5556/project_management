import { createContext, useContext, useEffect, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const CollaborationContext = createContext();

export function CollaborationProvider({ children }) {
  const [doc, setDoc] = useState(null);
  const [provider, setProvider] = useState(null);
  const [awareness, setAwareness] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const wsProvider = new WebsocketProvider(
      "ws://localhost:1234",
      "project-management",
      ydoc
    );

    wsProvider.on("status", ({ status }) => {
      setIsOnline(status === "connected");
    });

    setDoc(ydoc);
    setProvider(wsProvider);
    setAwareness(wsProvider.awareness);

    return () => {
      wsProvider.destroy();
      ydoc.destroy();
    };
  }, []);

  const value = {
    doc,
    provider,
    awareness,
    isOnline,
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
