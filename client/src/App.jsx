import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/Layout/PrivateRoute';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { TodoList } from './components/Todos/TodoList';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/App.css';

/**
 * Main App Component
 * Sets up routing and auth context
 */
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Root - redirect to todos or login */}
            <Route path="/" element={<Navigate to="/todos" replace />} />

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/todos"
              element={
                <PrivateRoute>
                  <TodoList />
                </PrivateRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
