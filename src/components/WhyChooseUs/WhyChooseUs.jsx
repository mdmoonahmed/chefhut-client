import React from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaTruck, FaSmile } from "react-icons/fa";
import { ChefHat, ChefHatIcon } from "lucide-react";

const features = [
  {
    icon: <FaLeaf size={32} className="t-accent" />,
    title: "Fresh Ingredients",
    description: "Top-quality, locally sourced ingredients in every meal.",
  },
  {
    icon: <ChefHat size={32} className="fill-[#C9A24D]" />,
    title: "Expert Chefs",
    description: "Cooked by experienced chefs who care about taste.",
  },
  {
    icon: <FaTruck size={32} className="t-accent" />,
    title: "Fast Delivery",
    description: "Hot meals delivered on time, every time.",
  },
  {
    icon: <FaSmile size={32} className="t-accent" />,
    title: "Satisfaction Guaranteed",
    description: "We prioritize quality and customer happiness.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="b-g-main  py-16 px-4">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <motion.h2
          className="header-text t-primary text-3xl md:text-4xl mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Why Choose <span className="t-accent">Chef Hut?</span>
        </motion.h2>
        <motion.p
          className="t-muted text-lg md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Fresh, Fast, and Crafted by Experts
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="b-g-surface b-subtle p-6 rounded-xl shadow-md text-center flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="t-primary text-xl font-semibold mb-2">
              {feature.title}
            </h3>
            <p className="t-muted text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
