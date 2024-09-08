"use client";
import { Button } from "@/components/ui/button";
import { Film, Tv, Radio } from "lucide-react";
import { Categories } from "@/lib/xtream";

export function CategorySelector({ handleCategoryChange, selectedCategory }) {
  return (
    <div className="border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black p-4">
      <h2 className="mb-4 text-lg font-semibold">:::</h2>
      <nav className="space-y-2">
        <Button
          variant="ghost"
          className={`w-full justify-start hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-white ${selectedCategory === Categories.Movies ? "bg-gray-200 dark:bg-gray-800 dark:text-white" : ""}`}
          onClick={() => handleCategoryChange(Categories.Movies)}
        >
          <Film className="mr-2 h-4 w-4" />
          Movies
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-white ${selectedCategory === Categories.Series ? "bg-gray-200 dark:bg-gray-800 dark:text-white" : ""}`}
          onClick={() => handleCategoryChange(Categories.Series)}
        >
          <Tv className="mr-2 h-4 w-4" />
          TV Shows
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-white ${selectedCategory === Categories.LiveStreams ? "bg-gray-200 dark:bg-gray-800 dark:text-white" : ""}`}
          onClick={() => handleCategoryChange(Categories.LiveStreams)}
        >
          <Radio className="mr-2 h-4 w-4" />
          Live TV
        </Button>
      </nav>
    </div>
  );
}
