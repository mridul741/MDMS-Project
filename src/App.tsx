
import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";
import { AuthProvider } from "./features/authentication/context/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
