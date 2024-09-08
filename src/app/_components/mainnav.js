"use client";
import { useState } from "react";
import { xtreamValues } from "../global";
import { CategorySelector } from "./categoryselector";
import { SubCategorySelector } from "./subcategoryselector";
import { StreamSelector } from "./streamselector";
import { StreamDetail } from "./detail";
import { Categories } from "@/lib/xtream";
import { VideoPlayer } from "./videoplayer";

export default function MainNav() {
  const [selectedCategory, setSelectedCategory] = useState(Categories.Movies);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(
    xtreamValues.getSubCategories(Categories.Movies),
  );

  const [selectedStream, setSelectedStream] = useState(null);
  const [streams, setStreams] = useState([]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSubCategory(xtreamValues.getSubCategories(category));
  };

  const handleSubCategoryChange = (categoryId) => {
    setSelectedSubCategory(categoryId);
    setStreams(xtreamValues.getStream(categoryId, selectedCategory));
  };

  const handleStreamChange = (streamId) => {
    setSelectedStream(streamId);
  };

  return (
    <div className="grid h-screen grid-cols-[250px_minmax(250px,_1fr)_minmax(600px,_2fr)_800px] overflow-hidden bg-white text-gray-900 dark:bg-black dark:text-gray-100">
      {/* Left Sidebar - Categories */}
      <CategorySelector
        handleCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />
      <SubCategorySelector
        subCategory={subCategory}
        selectedSubCategory={selectedSubCategory}
        handleSubCategoryChange={handleSubCategoryChange}
      />
      <StreamSelector
        selectedCategory={selectedCategory}
        streams={streams}
        handleStreamChange={handleStreamChange}
      />

      <StreamDetail
        selectedStream={selectedStream}
        category={selectedCategory}
      />
    </div>
  );
}
