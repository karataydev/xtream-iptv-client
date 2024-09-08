"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SubCategorySelector({
  handleSubCategoryChange,
  subCategory,
  selectedSubCategory,
}) {
  return (
    <div className="flex flex-col h-screen border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
      <h2 className="mb-4 text-lg font-semibold">Categories</h2>
      <ScrollArea className="flex-1">
        <div className="grid gap-2">
          {subCategory.map((item, i) => (
            <Button
              key={i}
              variant="ghost"
              className={`h-auto justify-start py-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white ${selectedSubCategory === item.id ? "bg-gray-200 dark:bg-gray-800 dark:text-white" : ""}`}
              onClick={() => handleSubCategoryChange(item.id)}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">{item.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
