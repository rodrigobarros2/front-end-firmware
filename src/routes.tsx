import { createBrowserRouter, Navigate } from "react-router-dom";
import { ErrorPage } from "./pages/errorPage";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { LoginForm } from "./pages/Login";
import { Checkout } from "./pages/Checkout";
import { useAuth } from "./hooks/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginForm />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: (
      /*  <ProtectedRoute> */
      <Dashboard />
      /*  </ProtectedRoute> */
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/checkout/:firmwareId",
    element: (
      /*  <ProtectedRoute> */
      <Checkout />
      /*  </ProtectedRoute> */
    ),
    errorElement: <ErrorPage />,
  },
]);
