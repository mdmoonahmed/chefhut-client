import React from "react";
import Hero from "../../components/Hero/Hero";
import MealCard from "../../components/Card/MealCard";
import { useLoaderData } from "react-router-dom";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import useTitles from '../../Hooks/useTitles';
import CustomerReviews from "../../components/CustomerReview/CustomerReview";

const Home = () => {
  useTitles("Home | ChefHut")
  const meals = useLoaderData();
  // console.log(meals);

  return (
    <div className="min-h-screen b-g-main">
      {/* Hero Section */}
      <Hero
        imageSrc="https://static.vecteezy.com/system/resources/previews/024/650/050/non_2x/gourmet-chicken-biryani-with-steamed-basmati-rice-generated-by-ai-free-photo.jpg"
        imageAlt="Delicious chicken biryani in a clay pot"
        ctaPrimary={{ label: "Explore Meals", href: "/meals" }}
        ctaSecondary={{ label: "How it Works", href: "/about" }}
        badge={{ label: "Chef of the Day", sub: "Chef Rahim • 4.9★" }}
      />

      {/* Featured Meals Section */}
      <div className="max-w-7xl border-b pb-16 mx-auto px-4 mt-12">
        {/* Section Title */}
        <h2 className="header-text t-primary text-4xl md:text-5xl font-bold text-center mb-2">
          Today's Special Meals
        </h2>
        <p className="t-muted text-center text-sm md:text-base mb-8">
          Handpicked dishes from our top chefs to delight your taste buds.
        </p>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <MealCard key={meal._id} meal={meal} />
          ))}
        </div>
      </div>
      <WhyChooseUs></WhyChooseUs>
      <CustomerReviews></CustomerReviews>
    </div>
  );
};

export default Home;

