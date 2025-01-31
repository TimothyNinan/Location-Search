import React from 'react'
import ReactDOM from 'react-dom/client'
import LandingPage from './LandingPage.jsx'
import Login from './routes/Login.jsx'
import Signup from './routes/Signup.jsx'
import Map from './routes/Map.jsx'
import NotFound from './routes/NotFound.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import AuthProvider from './routes/Authentication.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/map",
    element: <Map />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
