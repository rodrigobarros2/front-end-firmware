import { ThemeProvider } from "./components/theme-provider";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export function App() {
  return (
    <div>
      <ThemeProvider>
        <ToastContainer />
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}
