import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider }  from './contexts/ThemeContext';
import { AuthProvider }   from './contexts/AuthContext';
import AuthModalManager   from './components/AuthModalManager';
import DashboardLayout    from './components/DashboardLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
        <AuthProvider>
          <AuthModalManager />
          <DashboardLayout />
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar
            newestOnTop
            closeOnClick
          />
        </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
