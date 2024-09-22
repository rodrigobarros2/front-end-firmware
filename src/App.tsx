import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { router } from "./routes";
import AuthProvider from "./hooks/AuthContext";

function App() {
  return (
    <ThemeProvider>
      <ToastContainer />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
