// src/components/Home/CustomerReviewsCarousel.jsx
import React, { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from "react-icons/fa";
import useAxios from "../../Hooks/useAxios";

const ReviewCard = ({ r }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      className="b-g-surface b-subtle rounded-xl p-5 flex flex-col h-full"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={r.reviewerImage || "/default-user.png"}
            alt={r.reviewerName || "Reviewer"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <h4 className="t-primary text-sm font-semibold">
              {r.reviewerName || "Anonymous"}
            </h4>
            <div className="t-muted text-sm">{r.rating} ⭐</div>
          </div>
          <p className="t-muted text-xs mt-1">
            {r.date ? new Date(r.date).toLocaleDateString() : ""}
          </p>
        </div>
      </div>

      <div className="mt-4 flex-1">
        <p className="t-muted text-sm leading-relaxed">{r.comment}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="t-accent text-sm font-semibold">Verified customer</div>
        <span className="text-xs t-muted">•</span>
      </div>
    </motion.article>
  );
};

const CustomerReviewsCarousel = () => {
  const api = useAxios();
  const scrollerRef = useRef(null);
  const autoplayRef = useRef(null);

  // fetch recent reviews for home
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["homeReviews"],
    queryFn: async () => {
      const res = await api.get(`/reviews/home?limit=8`);
      return res.data || [];
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
  // console.log(reviews);

  // scroll helper
  const scrollByPage = (direction = "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const offset = Math.round(el.clientWidth * 0.8);
    const left = direction === "next" ? offset : -offset;
    el.scrollBy({ left, behavior: "smooth" });
  };

  // autoplay
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const startAutoplay = () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      autoplayRef.current = setInterval(() => {
        // if near end, scroll back to start smoothly
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollByPage("next");
        }
      }, 3000);
    };

    startAutoplay();

    // pause on hover
    const handleEnter = () => clearInterval(autoplayRef.current);
    const handleLeave = () => startAutoplay();

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      clearInterval(autoplayRef.current);
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [reviews.length]);

  return (
    <section className=" px-4 b-g-main">
      <div className="max-w-7xl py-16 border-t mx-auto">
        {/* header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-md b-g-surface">
              <FaQuoteLeft className="t-accent" />
            </div>
            <div>
              <h2 className="header-text t-primary text-2xl md:text-3xl font-semibold">
                What Customers Say
              </h2>
              <p className="t-muted max-w-xl">
                Real reviews from customers who enjoyed homemade meals from our
                chefs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="Previous reviews"
              onClick={() => scrollByPage("prev")}
              className="b-g-surface b-subtle t-accent rounded-full p-2 hover:brightness-105 transition"
            >
              <FaChevronLeft />
            </button>
            <button
              aria-label="Next reviews"
              onClick={() => scrollByPage("next")}
              className="b-g-surface t-accent b-subtle rounded-full p-2 hover:brightness-105 transition"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* scroller */}
        <div
          ref={scrollerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 px-2"
          style={{ scrollbarWidth: "none" }}
        >
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-w-[260px] sm:min-w-[320px] md:min-w-[360px] flex-shrink-0 rounded-xl b-g-surface b-subtle p-5 animate-pulse"
              />
            ))
          ) : reviews.length > 0 ? (
            reviews.map((r) => (
              <div
                key={r._id || r.date}
                className="min-w-[260px] sm:min-w-[320px] md:min-w-[360px] flex-shrink-0 snap-center"
              >
                <ReviewCard r={r} />
              </div>
            ))
          ) : (
            <div className="min-w-full b-g-surface b-subtle rounded-xl p-6 text-center">
              <p className="t-muted">
                No reviews yet — be the first to leave one!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewsCarousel;
