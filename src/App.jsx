import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider } from "./contexts/AppContext";
import { CollaborationProvider } from "./contexts/CollaborationContext";
import router from "./routes/routes";

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <CollaborationProvider>
          <RouterProvider router={router} />
        </CollaborationProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
