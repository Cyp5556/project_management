import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Dashboard from "../components/Dashboard/Dashboard";
import PageView from "../components/Pages/PageView";
import PageList from "../components/Pages/PageList";
import KanbanBoard from "../components/Kanban/KanbanBoard";
import ActivityFeed from "../components/Activity/ActivityFeed";
import Login from "../components/Pages/Login";
import PrivateRoute from "../components/Common/PrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="project/:projectId" element={<Dashboard />} />
        <Route path="project/:projectId/page/:pageId" element={<PageView />} />
        <Route path="project/:projectId/pages" element={<PageList />} />
        <Route
          path="project/:projectId/board/:boardId"
          element={<KanbanBoard />}
        />
        <Route path="activity" element={<ActivityFeed />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
