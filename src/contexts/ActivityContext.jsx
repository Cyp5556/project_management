import { createContext, useContext, useEffect, useState } from "react";
import { useCollaboration } from "./CollaborationContext";
import { useAuth } from "./AuthContext";
import { generateId } from "../utils/helpers";

const ActivityContext = createContext();

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used within ActivityProvider");
  }
  return context;
};

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const { doc, provider, isOnline } = useCollaboration();
  const { user } = useAuth();

  useEffect(() => {
    if (!doc || !isOnline) {
      console.log("Doc or connection not ready:", { doc: !!doc, isOnline });
      return;
    }

    try {
      // Set up YJS shared array for activities
      const sharedActivities = doc.getArray("activities");

      const observer = (event) => {
        try {
          console.log("Activity update received:", event);
          // Get the updated activities array
          const activityArray = sharedActivities.toArray();
          console.log("Current activities:", activityArray);
          // Update the state with the new activities
          setActivities((prev) => {
            // Only update if the arrays are different
            if (JSON.stringify(prev) !== JSON.stringify(activityArray)) {
              return activityArray;
            }
            return prev;
          });
        } catch (err) {
          console.error("Error in observer:", err);
        }
      };

      // Initial sync
      const initialActivities = sharedActivities.toArray();
      console.log("Initial activities:", initialActivities);
      setActivities(initialActivities);

      // Listen for changes
      sharedActivities.observe(observer);

      return () => {
        try {
          sharedActivities.unobserve(observer);
        } catch (err) {
          console.error("Error cleaning up observer:", err);
        }
      };
    } catch (err) {
      console.error("Error setting up activities:", err);
    }
  }, [doc, isOnline]);

  const addActivity = (activity) => {
    if (!doc || !isOnline) {
      console.log("Cannot add activity: not connected", {
        doc: !!doc,
        isOnline,
      });
      return;
    }

    if (!user) {
      console.log("Cannot add activity: no user logged in");
      return;
    }

    const sharedActivities = doc.getArray("activities");
    const newActivity = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      ...activity,
    };

    console.log("Adding new activity:", newActivity);

    try {
      doc.transact(() => {
        sharedActivities.push([newActivity]);
        // Keep only last 50 activities
        if (sharedActivities.length > 50) {
          sharedActivities.delete(0, sharedActivities.length - 50);
        }
      });
      console.log("Activity added successfully");
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity }}>
      {children}
    </ActivityContext.Provider>
  );
};
