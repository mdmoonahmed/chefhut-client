// src/components/Hero.jsx
import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const Hero = ({
  title = "Home Cooked. Hand Delivered.",
  subtitle = "Daily menus from trusted local chefs — fresh, healthy, and made with care.",
  ctaPrimary = { label: "Explore Today", href: "/meals" },
  ctaSecondary = { label: "How it Works", href: "/about" },
  imageSrc = "/hero-food.jpg", // replace with your image path
  imageAlt = "Chef Rahim serving biryani in a clay pot",
  badge = { label: "Chef of the Day", sub: "Chef Rahim • 4.9★" },
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Motion variants
  const container = {
    visible: { transition: { staggerChildren: 0.12 } },
    hidden: {},
  };

  const itemUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.18, 0.9, 0.32, 1.0] },
    },
  };

  const imageVariant = {
    hidden: { opacity: 0, x: 40, scale: 0.995 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.9, ease: [0.2, 0.8, 0.2, 1.0] },
    },
  };

  // If user prefers reduced motion, use no motion (render static)
  const variants = useMemo(() => {
    if (shouldReduceMotion) {
      return {
        container: { visible: {}, hidden: {} },
        itemUp: { hidden: {}, visible: {} },
        imageVariant: { hidden: {}, visible: {} },
      };
    }
    return { container, itemUp, imageVariant };
  }, [shouldReduceMotion]);

  // CTA render helper (supports href or onClick)
  const renderCTA = (cta, primary = false) => {
    if (!cta) return null;
    const baseClasses = primary
      ? "rounded-md px-6 py-2 font-semibold shadow-md transition transform"
      : "rounded-md px-4 py-2 font-medium transition";
    const primaryClasses = "b-g-accent  hover:brightness-105";
    const secondaryClasses = "bg-transparent t-accent font-semibold border border-transparent text-current hover:underline";

    if (cta.onClick) {
      return (
        <button
          onClick={cta.onClick}
          className={`${baseClasses} ${primary ? primaryClasses : secondaryClasses}`}
          aria-label={cta.label}
        >
          {cta.label}
        </button>
      );
    }

    // href
    return (
      <a
        href={cta.href}
        className={`${baseClasses} ${primary ? primaryClasses : secondaryClasses}`}
        aria-label={cta.label}
      >
        {cta.label}
      </a>
    );
  };

  return (
    <header className="w-full b-g-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants.container}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-20 lg:py-28"
        >
          {/* Left column: text & CTAs */}
          <motion.div
            variants={variants.itemUp}
            className="lg:col-span-6"
          >
            <h1
              className="header-text text-4xl sm:text-5xl lg:text-6xl leading-tight font-display t-primary"
              style={{ letterSpacing: "0.02em" }}
            >
              {title}
            </h1>

            <motion.p
              variants={variants.itemUp}
              className="mt-6 max-w-xl text-lg sm:text-xl t-muted"
            >
              {subtitle}
            </motion.p>

            <motion.div
              variants={variants.itemUp}
              className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center"
            >
              <div>{renderCTA(ctaPrimary, true)}</div>
              {/* {ctaSecondary && (
                <div>{renderCTA(ctaSecondary, false)}</div>
              )} */}
            </motion.div>

            {/* Trust / micro-row */}
            <motion.div
              variants={variants.itemUp}
              className="mt-6 flex flex-wrap items-center gap-4 text-sm"
            >
              <span className="inline-flex items-center gap-2 t-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 2v6" stroke="#C9A24D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 12H4" stroke="#C9A24D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="t-primary">Trusted chefs</span>
              </span>

              <span className="t-muted">•</span>

              <span className="t-muted">Daily menus</span>
              <span className="t-muted">•</span>
              <span className="t-muted">Secure payments</span>
            </motion.div>
          </motion.div>

          {/* Right column: image */}
          <motion.div
            variants={variants.imageVariant}
            className="lg:col-span-6 relative flex justify-center lg:justify-end"
            aria-hidden={false}
          >
            <div className="w-full max-w-[520px] b-g-surface rounded-2xl overflow-hidden shadow-lg  b-subtle">
              {/* image with aspect ratio */}
              <div className="relative" style={{ paddingBottom: "66.66%" /* 3:2 */ }}>
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="absolute animate-zoomImg inset-0 w-full h-full object-cover"
                  loading="lazy"
                  width="1200"
                  height="800"
                />
              </div>
              {/* overlay small badge */}
              {badge && (
                <div className="absolute left-6 top-6">
                  <div className="b-g-accent px-3 py-1 rounded-md shadow-sm">
                    <div className="text-xs font-semibold t-g-main">{badge.label}</div>
                    {badge.sub && <div className="text-[11px] t-primary mt-0.5">{badge.sub}</div>}
                  </div>
                </div>
              )}
            </div>

            {/* Decorative floating badge */}
            <motion.div
              aria-hidden
              className="hidden md:block absolute -right-6 bottom-4"
              animate={shouldReduceMotion ? {} : { y: [0, -9, 0], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ pointerEvents: "none" }}
            >
              <div className="b-g-accent px-3 py-2 rounded-lg shadow-sm">
                <div className="text-xs font-semibold t-g-main">Fresh Today</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* divider */}
        <div className="w-full border-t mt-8" style={{ borderColor: "var(--b-subtle)" }} />
      </div>
    </header>
  );
};

export default Hero;

