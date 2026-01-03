import { motion } from "framer-motion";
import logo from '../../assets/logo.png'

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center b-g-main">
      <div className="flex flex-col items-center gap-3">

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <img
            src={logo}   // 👉 replace with your logo path
            alt="Loading Logo"
            className=" h-16  md:h-20 "
          />
        </motion.div>

        {/* Spinner
        <motion.div
          className="w-10 h-10 rounded-full border-2 b-g-accent b-subtle"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        /> */}

        {/* Text */}
         <span className="loading loading-spinner text-warning"></span>

      </div>
    </div>
  );
};

export default Loading;
