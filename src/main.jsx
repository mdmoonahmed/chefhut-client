import { StrictMode } from 'react'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from './routes/router.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from 'react-hot-toast';
import { createRoot } from 'react-dom/client';
import AuthProvider from './Context/AuthProvider.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.dataset.theme = savedTheme;


const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>

   <QueryClientProvider client={queryClient}>
       <AuthProvider>
          <RouterProvider router={router} />
      </AuthProvider>
   </QueryClientProvider>
  <ToastContainer position="top-right" autoClose={2000} />
  <Toaster position="top-right" toastOptions={{ duration: 2500 }} />

  </StrictMode>,
)



