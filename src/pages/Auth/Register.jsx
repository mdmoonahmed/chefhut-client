import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure"; 

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const { createUser, updateUserProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordValue = watch("password", "");

  const handleRegistration = async (data) => {
    setServerError("");
    setLoading(true);

    const { name, email, address, password, photoUrl } = data;

    try {
      // 1) create user
      await createUser(email, password);

      // 2) prepare user object for DB
      const userInfo = {
        email,
        displayName: name,
        photoURL: photoUrl || "",
        address: address || "",
        role: "user",
        status: "active",
      };

      // 3) save user to  backend
      const res = await axiosSecure.post("/users", userInfo);

      //  check server response
      if (res?.data?.insertedId || res?.data?.acknowledged) {
        // 4) update profile in auth (Firebase)
        const userProfile = {
          displayName: name,
          photoURL: photoUrl || "",
        };

        await updateUserProfile(userProfile);

        // 5) navigate to previous location or home/dashboard
        const dest =
          (location.state && location.state.from) || "/dashboard";
        navigate(dest, { replace: true });
      } else {
        setServerError("Failed to create user in the database.");
      }
    } catch (err) {
      // Show user-friendly message
      const msg =
        err?.response?.data?.message || err?.message || "Registration failed. Try again.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center b-g-main px-4">
      <div className="w-full max-w-md b-g-surface b-subtle rounded-2xl shadow-lg p-8">
        {/* Heading */}
        <h2 className="header-text t-primary text-3xl mb-2">Create your account</h2>
        <p className="t-muted text-sm mb-6">
          Join LocalChefBazaar and enjoy fresh home-cooked meals.
        </p>

        <form onSubmit={handleSubmit(handleRegistration)} noValidate>
          {/* Name */}
          <div className="mb-4">
            <label className="block t-muted text-sm mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Enter your full name" },
              })}
              placeholder="Ariana Sultana"
              aria-invalid={errors.name ? "true" : "false"}
              className="w-full bg-transparent b-subtle t-primary px-4 py-2 rounded-md focus:outline-none"
            />
            {errors.name && <p className="t-accent text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block t-muted text-sm mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
              })}
              placeholder="you@example.com"
              aria-invalid={errors.email ? "true" : "false"}
              className="w-full bg-transparent b-subtle t-primary px-4 py-2 rounded-md focus:outline-none"
            />
            {errors.email && <p className="t-accent text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block t-muted text-sm mb-2" htmlFor="address">
              Address
            </label>
            <input
              id="address"
              type="text"
              {...register("address", {
                required: "Address is required",
                minLength: { value: 3, message: "Enter a valid address" },
              })}
              placeholder="Mirpur, Dhaka"
              aria-invalid={errors.address ? "true" : "false"}
              className="w-full bg-transparent b-subtle t-primary px-4 py-2 rounded-md focus:outline-none"
            />
            {errors.address && (
              <p className="t-accent text-xs mt-1">{errors.address.message}</p>
            )}
          </div>

          {/* Image URL */}
          <div className="mb-4">
            <label className="block t-muted text-sm mb-2" htmlFor="photoUrl">
              Profile Image URL
            </label>
            <input
              id="photoUrl"
              type="url"
              {...register("photoUrl", {
                required: "Profile image URL is required",
                // pattern: {
                //   value:
                //     /^(https?:\/\/.*\.(?:png|jpg|jpeg|webp|gif|svg|bmp|avif))(?:\?.*)?$/i,
                //   message: "Enter a valid image URL (png/jpg/webp/gif)",
                // },
              })}
              placeholder="https://i.ibb.co/your-photo.jpg"
              aria-invalid={errors.photoUrl ? "true" : "false"}
              className="w-full bg-transparent b-subtle t-primary px-4 py-2 rounded-md focus:outline-none"
            />
            {errors.photoUrl && <p className="t-accent text-xs mt-1">{errors.photoUrl.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block t-muted text-sm mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              placeholder="Minimum 6 characters"
              aria-invalid={errors.password ? "true" : "false"}
              className="w-full bg-transparent b-subtle t-primary px-4 py-2 rounded-md focus:outline-none"
            />
            {errors.password && (
              <p className="t-accent text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block t-muted text-sm mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", {
                required: "Confirm your password",
                validate: (value) => value === passwordValue || "Passwords do not match",
              })}
              placeholder="Re-enter password"
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              className="w-full bg-transparent b-subtle t-primary px-4 py-2 rounded-md focus:outline-none"
            />
            {errors.confirmPassword && (
              <p className="t-accent text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Server error */}
          {serverError && <p className="t-accent text-sm mb-4">{serverError}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || isSubmitting}
            className={`w-full ${
              loading || isSubmitting ? "opacity-70 pointer-events-none" : ""
            } b-g-accent text-black font-semibold py-3 rounded-md transition hover:opacity-90`}
          >
            {loading || isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="t-muted text-sm mt-6 text-center">
          Already have an account?{" "}
          <a href="/login" className="t-accent hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;

