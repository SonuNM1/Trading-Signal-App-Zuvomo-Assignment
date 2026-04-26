// Toaster gives us popup notifications anywhere in the app
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard.jsx';

const App = () => {
  return (
    <>
      {/* Toaster must be at root level to work everywhere */}
      <Toaster position="top-right" />

      {/* Main dashboard page */}
      <Dashboard />
    </>
  );
};

export default App;