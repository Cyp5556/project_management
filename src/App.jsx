import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import { CollaborationProvider } from "./contexts/CollaborationContext";
import { ActivityProvider } from "./contexts/ActivityContext";
import AppRoutes from "./routes/routes";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          {/* AppProvider must wrap Collaboration + Activity */}
          <AppProvider>
            <CollaborationProvider>
              <ActivityProvider>
                <AppRoutes />
              </ActivityProvider>
            </CollaborationProvider>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
