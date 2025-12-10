// src/layouts/DashboardDrawer.jsx
import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";
import logo from '../assets/logo.png';

/**
 * DashboardDrawer
 * - DaisyUI drawer with collapsed-icon mode
 * - Initially closed, icons visible and functional
 * - Toggle using the navbar button (label for checkbox)
 *
 * Usage:
 * <DashboardDrawer>
 *   <YourPageContent />
 * </DashboardDrawer>
 */

const IconHome = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    strokeLinejoin="round"
    strokeLinecap="round"
    strokeWidth="2"
    fill="none"
    stroke="currentColor"
    className="my-1.5 inline-block size-4"
  >
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
  </svg>
);

const IconMeals = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    strokeLinejoin="round"
    strokeLinecap="round"
    strokeWidth="2"
    fill="none"
    stroke="currentColor"
    className="my-1.5 inline-block size-4"
  >
    <path d="M12 2v20"></path>
    <path d="M5 12h14"></path>
  </svg>
);

const IconOrders = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    strokeLinejoin="round"
    strokeLinecap="round"
    strokeWidth="2"
    fill="none"
    stroke="currentColor"
    className="my-1.5 inline-block size-4"
  >
    <path d="M3 7h18"></path>
    <path d="M6 7v10"></path>
    <path d="M18 7v10"></path>
  </svg>
);

const IconUsers = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    strokeLinejoin="round"
    strokeLinecap="round"
    strokeWidth="2"
    fill="none"
    stroke="currentColor"
    className="my-1.5 inline-block size-4"
  >
    <circle cx="12" cy="8" r="3"></circle>
    <path d="M5.5 20a6.5 6.5 0 0 1 13 0"></path>
  </svg>
);

const DashboardDrawer = ({ children }) => {
  const checkboxId = "dashboard-drawer-toggle";
  const checkboxRef = useRef(null);
  const { user } = useAuth();
  const { role } = useRole();
  return (
    <div className="drawer lg:drawer-open">
      {/* hidden checkbox controls drawer */}
      <input
        id={checkboxId}
        ref={checkboxRef}
        type="checkbox"
        className="drawer-toggle"
      />

      {/* main content area */}
      <div className="drawer-content min-h-screen b-g-main">
        {/* Navbar */}
        <nav className="navbar b-g-surface b-subtle px-4">
          {/* toggle button - label toggles the checkbox */}
          <label
            htmlFor={checkboxId}
            aria-label="open sidebar"
            className="btn btn-square btn-link t-primary lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
            {/* Big toggle for larger screens too */}
            <label
              htmlFor={checkboxId}
              className="btn btn-link t-primary btn-square hidden lg:inline-flex"
              aria-label="toggle sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
                className="my-1.5 inline-block size-4"
              >
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                <path d="M9 4v16"></path>
                <path d="M14 10l2 2l-2 2"></path>
              </svg>
            </label>
          <div className="px-4 header-text t-primary text-lg">Dashboard</div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:block t-muted text-sm">
              Welcome{user?.displayName ? `, ${user.displayName}` : ""}
            </div>
           
          </div>
        </nav>

        {/* page content */}
        <div className="p-4">{children}</div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label
          htmlFor={checkboxId}
          className="drawer-overlay"
          aria-label="close sidebar"
        ></label>

        <div className="flex min-h-full flex-col items-start b-g-surface is-drawer-close:w-14 is-drawer-open:w-64">
          {/* top logo area */}
          <div className="w-full px-3 py-4 flex items-center gap-3">
            {/* <div className="w-10 h-10 rounded-md b-g-accent flex items-center justify-center text-black font-bold"> */}
              <img className="h-10" src={logo} alt="" />
            {/* </div> */}
            <div className="is-drawer-close:hidden">
              <div className="header-text t-accent">ChefHut</div>
              <div className="t-muted text-xs">{role || 'user'}</div>
            </div>
          </div>

          {/* nav */}
          <ul className="menu w-full t-primary grow px-1">
            {/* ===== COMMON ===== */}
            <li>
              <NavLink
                to="/dashboard"
               
              >
                <IconHome />
                <span className=" is-drawer-close:hidden">Overview</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/profile">
                <IconUsers />
                <span className=" is-drawer-close:hidden">My Profile</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/my-orders">
                <IconOrders />
                <span className=" is-drawer-close:hidden">My Orders</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/favorites">
                <IconMeals />
                <span className=" is-drawer-close:hidden">Favorites</span>
              </NavLink>
            </li>

            {/* ===== USER ===== */}
            {role === "user" && (
              <>
                <li>
                  <NavLink to="/dashboard/order-history">
                    <IconOrders />
                    <span className=" is-drawer-close:hidden">
                      Order History
                    </span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/reviews">
                    <IconMeals />
                    <span className=" is-drawer-close:hidden">My Reviews</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* ===== CHEF ===== */}
            {role === "chef" && (
              <>
                <li className="menu-title  is-drawer-close:hidden">
                  <span>Chef Panel</span>
                </li>

                <li>
                  <NavLink to="/dashboard/add-meal">
                    <IconMeals />
                    <span className=" is-drawer-close:hidden">Add Meal</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/my-meals">
                    <IconMeals />
                    <span className=" is-drawer-close:hidden">My Meals</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/meal-orders">
                    <IconOrders />
                    <span className=" is-drawer-close:hidden">Meal Orders</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/earnings">
                    💰
                    <span className=" is-drawer-close:hidden">Earnings</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* ===== ADMIN ===== */}
            {role === "admin" && (
              <>
                <li className="menu-title  is-drawer-close:hidden">
                  <span>Admin Panel</span>
                </li>

                <li>
                  <NavLink to="/dashboard/manage-users">
                    <IconUsers />
                    <span className=" is-drawer-close:hidden">Manage Users</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/manage-meals">
                    <IconMeals />
                    <span className=" is-drawer-close:hidden">Manage Meals</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/manage-orders">
                    <IconOrders />
                    <span className=" is-drawer-close:hidden">
                      Manage Orders
                    </span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard/site-reviews">
                    ⭐
                    <span className=" is-drawer-close:hidden">Site Reviews</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* bottom area */}
          <div className="w-full px-3 py-4">
            <div className="is-drawer-close:hidden t-muted text-xs mb-2">
              Logged in as
            </div>
            <div className="flex items-center gap-3">
              <img
                src={user?.photoURL || "/default-user.png"}
                alt={user?.displayName || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="is-drawer-close:hidden">
                <div className="t-primary text-sm">
                  {user?.displayName || user?.email}
                </div>
                <div className="t-muted text-xs">{role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDrawer;
