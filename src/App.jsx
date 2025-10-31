import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import router from './routes/routes';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;