import { createContext, useContext, useState } from "react";
import { INITIAL_PROJECTS, MOCK_USERS } from "../data/mockData";
import { generateId } from "../utils/helpers";

// Mock version history data structure
const versionHistory = {};

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [currentProject, setCurrentProject] = useState(INITIAL_PROJECTS[0]);
  const [currentUser] = useState(MOCK_USERS[0]);
  const [activities, setActivities] = useState([]);
  const [toast, setToast] = useState(null);
  const [versions, setVersions] = useState({});

  const addActivity = (activity) => {
    setActivities((prev) =>
      [{ ...activity, id: generateId() }, ...prev].slice(0, 50)
    );
  };

  const showToast = (message) => {
    setToast(message);
  };

  const updatePage = (projectId, updatedPage) => {
    setProjects(
      projects.map((proj) =>
        proj.id === projectId
          ? {
              ...proj,
              pages: proj.pages.map((p) =>
                p.id === updatedPage.id ? updatedPage : p
              ),
            }
          : proj
      )
    );
  };

  const updateBoard = (projectId, updatedBoard) => {
    setProjects(
      projects.map((proj) =>
        proj.id === projectId
          ? {
              ...proj,
              boards: proj.boards.map((b) =>
                b.id === updatedBoard.id ? updatedBoard : b
              ),
            }
          : proj
      )
    );
  };

  const getProjectById = (id) => projects.find((p) => p.id === id);
  const getPageById = (projectId, pageId) => {
    const project = getProjectById(projectId);
    return project?.pages.find((p) => p.id === pageId);
  };
  const getBoardById = (projectId, boardId) => {
    const project = getProjectById(projectId);
    return project?.boards.find((b) => b.id === boardId);
  };

  const getVersionHistory = (pageId) => {
    return versions[pageId] || [];
  };

  const saveVersion = (pageId, content) => {
    const newVersion = {
      id: generateId(),
      content,
      timestamp: new Date().toISOString(),
      author: currentUser.name,
    };

    setVersions((prev) => ({
      ...prev,
      [pageId]: [newVersion, ...(prev[pageId] || [])],
    }));

    return newVersion;
  };

  const compareVersions = (versionId1, versionId2) => {
    // Simple line-by-line diff implementation
    const version1 = versions[versionId1]?.content.split("\n") || [];
    const version2 = versions[versionId2]?.content.split("\n") || [];

    const diff = [];
    const maxLength = Math.max(version1.length, version2.length);

    for (let i = 0; i < maxLength; i++) {
      if (i >= version1.length) {
        diff.push(`+ ${version2[i]}`);
      } else if (i >= version2.length) {
        diff.push(`- ${version1[i]}`);
      } else if (version1[i] !== version2[i]) {
        diff.push(`- ${version1[i]}`);
        diff.push(`+ ${version2[i]}`);
      } else {
        diff.push(`  ${version1[i]}`);
      }
    }

    return diff;
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        setProjects,
        currentProject,
        setCurrentProject,
        currentUser,
        activities,
        addActivity,
        toast,
        setToast,
        showToast,
        updatePage,
        updateBoard,
        getProjectById,
        getPageById,
        getBoardById,
        getVersionHistory,
        saveVersion,
        compareVersions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
