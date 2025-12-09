import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";
import MealCard from "../../components/Card/MealCard";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { FaArrowAltCircleRight, FaFacebook } from "react-icons/fa";

const MealsPage = () => {
  const api = useAxios();

  const [currentPage, setCurrentPage] = useState(0);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const limit = 9;

  const { data } = useQuery({
    queryKey: ["meals", currentPage, sort, order, search],
    queryFn: async () => {
      const res = await api.get(
        `/meals?limit=${limit}&skip=${currentPage * limit}&sort=${sort}&order=${order}&search=${search}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });


  const meals = data?.meals || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <div className="min-h-screen b-g-main px-4 py-10">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h2 className="header-text t-primary text-3xl md:text-4xl mb-2">
          Daily Meals 
        </h2>
        <p className="t-muted text-sm">
          Fresh meals cooked by local chefs
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-row sm:flex-row gap-4 justify-between max-w-6xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search meals..."
          value={search}
          onChange={(e) => {
            setCurrentPage(0);
            setSearch(e.target.value);
          }}
          className="b-g-surface b-subtle t-primary px-4 py-2 rounded-md w-full sm:w-1/2"
        />
      
        <div className="flex gap-2">
             <select
             onChange={(e) => setSort(e.target.value)}
             className="b-g-surface b-subtle t-primary px-2 sm:px-4 py-2 rounded-md"
           >
             <option value="createdAt">Newest</option>
             <option value="price">Price</option>
             <option value="rating">Rating</option>
           </select>
           
           <select
             onChange={e=> setOrder(e.target.value)}
             className="b-g-surface b-subtle text-white px-1 py-2 rounded-md"
           >
               <option value="desc">▼</option>
               <option value="asc">▲</option>
           </select>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {meals.map((meal) => (
          <MealCard key={meal._id} meal={meal} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-10">
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentPage === page
                ? "b-g-accent text-black"
                : "b-g-surface t-muted b-subtle"
            }`}
          >
            {page + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MealsPage;
