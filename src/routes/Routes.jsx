import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import Root from '../Root/Root';
import Home from '../pages/Home/Home';
import ErrorPage from '../pages/Error/ErrorPage';
import Meals from '../pages/Meals/Meals';
import UserDashboard from '../pages/Dashboard/UserDashboard';



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
      }
    ]
  },
]);
