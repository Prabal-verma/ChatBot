import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

// Import the layouts
import RootLayout from './layouts/root-layout'
import DashboardLayout from './layouts/dashboard-layout'

// Import the components

import SignInPage from './routes/sign-in'
import App from './App'


const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <App/> },
      { path: "/sign-in/*", element: <SignInPage /> },

    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)