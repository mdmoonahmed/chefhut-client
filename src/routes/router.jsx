import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home/Home";
import ErrorPage from "../pages/Error/ErrorPage";
import Root from "../Layout/Root";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PrivateRoutes from "./PrivateRoutes";
import Loading from "../components/Loader/Loader";
import MealDetails from "../pages/Meals/MealDetails";
import MealsPage from "../pages/Meals/MealsPage";
import OrderPage from "../pages/Meals/OrderPage";
import DashboardLayout from "../Layout/DashboardLayout";
import MyProfile from "../pages/Dashboard/ProfileLayout/MyProfile";
import UserOrder from "../pages/Dashboard/User/UserOrder";
import UserFavorite from "../pages/Dashboard/User/UserFavorite";
import UserReview from "../pages/Dashboard/User/UserReview";
import AddMeal from "../pages/Dashboard/Chef/AddMeal";
import MyMeals from "../pages/Dashboard/Chef/MyMeals";
import MealOrders from "../pages/Dashboard/Chef/MealOrders";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import ManageRequest from "../pages/Dashboard/Admin/ManageRequest";
import Statistic from "../pages/Dashboard/Admin/Statistic";
import ChefRoute from "./ChefRoute";
import AdminRoutes from "./AdminRoutes";
import PaymentSuccess from "../pages/Dashboard/Payment/PaymentSuccess";
import PaymentCancel from "../pages/Dashboard/Payment/PaymentCancel";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage />,
    hydrateFallbackElement: <Loading></Loading>,
    children: [
      {
        index: true,
        element: <Home></Home>,
        loader: ()=> fetch('https://chef-hut-indol.vercel.app/featured-meals')
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
    element: <PrivateRoutes><DashboardLayout/></PrivateRoutes>,
    hydrateFallbackElement: <Loading></Loading>,
    children: [
      {
        index:true,
        path: "/dashboard/profile",
        element: <MyProfile></MyProfile>
      },
      {
        path: "/dashboard/my-orders",
        element: <UserOrder></UserOrder>
      },
      {
        path: "/dashboard/favorites",
        element: <UserFavorite></UserFavorite>
      },
      {
        path: "/dashboard/reviews",
        element: <UserReview></UserReview>
      },
      {
        path: "/dashboard/payment-success",
        element: <PaymentSuccess></PaymentSuccess>
      },
      {
        path: "/dashboard/payment-cancel",
        element: <PaymentCancel></PaymentCancel>
      },
          /***Chef****/ 
      {
        path: "/dashboard/add-meal",
        element:<ChefRoute> <AddMeal/></ChefRoute>
      },
      {
        path: "/dashboard/my-meals",
        element: <ChefRoute> <MyMeals/> </ChefRoute>
      },
      {
        path: "/dashboard/meal-orders",
        element: <ChefRoute><MealOrders/></ChefRoute>
      },
            /****Admin****/ 
      {
        path: "/dashboard/manage-users",
        element: <AdminRoutes><ManageUsers/></AdminRoutes>
      },
      {
        path: "/dashboard/manage-request",
        element: <AdminRoutes><ManageRequest/></AdminRoutes>
      },
      {
        path: "/dashboard/statistic",
        element: <AdminRoutes><Statistic/></AdminRoutes>
      }
    ],
  },
]);
