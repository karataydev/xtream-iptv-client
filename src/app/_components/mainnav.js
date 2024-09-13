"use client";
import { Button } from "@/components/ui/button";
import { Categories } from "@/lib/xtream";
import { ArrowLeft, PlusCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { xtreamValues } from "../global";
import { CategoryBreadcrumb } from "./categorybreadcrumb";
import { CategorySelector } from "./categoryselector";
import { StreamDetail } from "./detail";
import { StreamSelector } from "./streamselector";
import { SubCategorySelector } from "./subcategoryselector";

export default function MainNav({ handleLoadXtream, handleNewPlaylist }) {
  const [selectedCategory, setSelectedCategory] = useState(Categories.Movies);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(
    xtreamValues.getSubCategories(Categories.Movies),
  );
  const [selectedStream, setSelectedStream] = useState(null);
  const [streams, setStreams] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState("category");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSubCategory(xtreamValues.getSubCategories(category));
    setSelectedStream(null);
    setStreams(null);
    if (isMobile) setMobileView("subcategory");
  };

  const handleSubCategoryChange = (categoryId) => {
    setSelectedSubCategory(categoryId);
    setStreams(xtreamValues.getStream(categoryId, selectedCategory));
    setSelectedStream(null);
    if (isMobile) setMobileView("stream");
  };

  const handleStreamChange = (streamId) => {
    setSelectedStream(streamId);
    if (isMobile) setMobileView("detail");
  };

  const handleBackButton = () => {
    if (mobileView === "subcategory") {
      setMobileView("category");
    } else if (mobileView === "stream") {
      setMobileView("subcategory");
    } else if (mobileView === "detail") {
      setMobileView("stream");
    }
  };

  const breadCategories = () => {
    var cats = [
      {
        name: selectedCategory,
        onClick: () => {
          setSelectedSubCategory(null);
          setSelectedStream(null);
          if (isMobile) setMobileView("category");
        },
      },
    ];

    if (selectedCategory && selectedSubCategory) {
      var cat = xtreamValues
        .getSubCategories(selectedCategory)
        .find((subCategory) => subCategory.id === selectedSubCategory);
      if (cat) {
        cats.push({
          name: cat.name,
          onClick: () => {
            setSelectedStream(null);
            if (isMobile) setMobileView("subcategory");
          },
        });
      }
    }

    if (selectedCategory && selectedSubCategory && selectedStream) {
      var cat = xtreamValues
        .getStreams(selectedCategory)
        .find((stream) => stream.id === selectedStream);
      if (cat) {
        cats.push({
          name: cat.name,
          onClick: () => {
            if (isMobile) setMobileView("stream");
          },
        });
      }
    }

    return cats;
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="h-[4vh] flex justify-between items-center px-4">
        {isMobile && mobileView !== "category" ? (
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
            onClick={handleBackButton}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        ) : isMobile ? (
          <div></div>
        ) : (
          <CategoryBreadcrumb categories={breadCategories()} />
        )}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-white mr-2"
            onClick={handleLoadXtream}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload Playlist
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
            onClick={handleNewPlaylist}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Playlist
          </Button>
        </div>
      </div>
      <div
        className={`grid h-full bg-white text-gray-900 dark:bg-black dark:text-gray-100 ${isMobile ? "grid-cols-1" : "grid-cols-[250px_minmax(250px,_1fr)_minmax(600px,_2fr)_800px]"} overflow-hidden `}
      >
        {(!isMobile || mobileView === "category") && (
          <CategorySelector
            handleCategoryChange={handleCategoryChange}
            selectedCategory={selectedCategory}
          />
        )}
        {(!isMobile || mobileView === "subcategory") && (
          <SubCategorySelector
            subCategory={subCategory}
            selectedSubCategory={selectedSubCategory}
            handleSubCategoryChange={handleSubCategoryChange}
          />
        )}
        {(!isMobile || mobileView === "stream") && (
          <StreamSelector
            selectedCategory={selectedCategory}
            streams={streams}
            handleStreamChange={handleStreamChange}
          />
        )}
        {(!isMobile || mobileView === "detail") && (
          <StreamDetail
            selectedStream={selectedStream}
            category={selectedCategory}
          />
        )}
      </div>
    </div>
  );
}
