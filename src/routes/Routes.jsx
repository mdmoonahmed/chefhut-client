import React from 'react';
import { createBrowserRouter } from "react-router-dom";

import Home from '../pages/Home/Home';
import ErrorPage from '../pages/Error/ErrorPage';
import Meals from '../pages/Meals/Meals';
import UserDashboard from '../pages/Dashboard/UserDashboard';
import Root from '../Layout/Root';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';



export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        index: true,
        element: <Home></Home>,
      },
      {
        path: '/meals',
        element: <Meals></Meals>,
      },
      {
        path: '/dashboard',
        element: <UserDashboard></UserDashboard>
      },
      {
        path: 'login',
        Component: Login
      },
      {
        path: 'register',
        Component: Register 
      }
    ]
  },
]);
