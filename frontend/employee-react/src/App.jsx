import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router";
import Guard from "./components/Auth/AuthGuard";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Guard />,
    children: [],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
