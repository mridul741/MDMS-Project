import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../features/end-user/pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
]);
