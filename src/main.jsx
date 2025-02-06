import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import 'bootstrap/dist/css/bootstrap.min.css';
// import "./CSS/main.scss"
import "./CSS/dashboard.scss";
import 'bootstrap';

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import Login from './Pages/Login.jsx';
import Signup from './Pages/Signup.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import { Provider } from 'react-redux';

import { store, persistor } from "./store/store.js";
import { PersistGate } from 'redux-persist/integration/react';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    children: [
      {
        path: "/hom",
        element: (
          // <Home />
          <> <h1>this is a home </h1></>
        )
      },
    ]
  },
  {
    path: "*",
    element: <h1>404 Not Found</h1>
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
    path: "/dashboard",
    element: <Dashboard />
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    </PersistGate>
  </Provider>
)
