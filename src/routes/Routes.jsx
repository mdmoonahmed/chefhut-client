import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home/Home";
import ErrorPage from "../pages/Error/ErrorPage";
import UserDashboard from "../pages/Dashboard/UserDashboard";
import Root from "../Layout/Root";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PrivateRoutes from "./PrivateRoutes";
import Loading from "../components/Loader/Loader";
import MealDetails from "../pages/Meals/MealDetails";
import MealsPage from "../pages/Meals/MealsPage";
import OrderPage from "../pages/Meals/OrderPage";
import DashboardLayout from "../Layout/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage />,
    hydrateFallbackElement: <Loading></Loading>,
    children: [
      {
        path: "/",
        index: true,
        element: <Home></Home>,
        loader: ()=> fetch('http://localhost:3000/featured-meals')
      },
      {
        path: "/meals",
        element: <MealsPage></MealsPage>
      },
      {
        path: "/mealDetails/:id",
        element: <PrivateRoutes><MealDetails/></PrivateRoutes>,
      },
      {
        path: "/order",
        element: <PrivateRoutes><OrderPage></OrderPage></PrivateRoutes>
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout></DashboardLayout>,
    children: [
      {
        
      }
    ],
  },
]);
