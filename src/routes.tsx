import { createBrowserRouter } from "react-router-dom";

import { Home } from "./pages/home";

import { ErrorPage } from "./pages/errorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [{ path: "/", element: <Home /> }],
  },
]);
