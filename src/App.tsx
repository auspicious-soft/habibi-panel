import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Panel from "./components/Panel";
import { useEffect, useState } from "react";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    setIsAuthenticated(!!token);
  }, []);

  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="text-gray-300 text-lg">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

// Public Route Component (redirects to panel if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    setIsAuthenticated(!!token);
  }, []);

  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="text-gray-300 text-lg">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/panel" replace /> : <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route - Login */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected Route - Panel */}
        <Route
          path="/panel"
          element={
            <ProtectedRoute>
              <Panel />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;