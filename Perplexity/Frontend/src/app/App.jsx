import { RouterProvider } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../features/auth/hooks/useAuth.js";
import router from "./app.routes";

function App() {

  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;