"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";

export function StreamSelector({
  streams,
  selectedCategory,
  handleStreamChange,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSearchTerm("");
  }, [selectedCategory]);

  const filteredStreams =
    streams && streams.length > 0
      ? streams.filter((stream) =>
          stream.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : [];

  return (
    <div className="h-[96vh] flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="border-b border-gray-200 dark:border-gray-800 p-4">
        <h1 className="mb-4 text-lg font-semibold">{selectedCategory}</h1>
        <form className="relative" onSubmit={(e) => e.preventDefault()}>
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-8 bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>
      <ScrollArea className="flex-1">
        <div className="grid gap-2 p-4">
          {filteredStreams && filteredStreams.length > 0 ? (
            filteredStreams.map((item, i) => (
              <Button
                key={i}
                variant="ghost"
                className="h-auto justify-start py-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
                onClick={() => handleStreamChange(item.id)}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.rating} • {item.type}
                  </span>
                </div>
              </Button>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              {searchTerm
                ? "No matching streams"
                : selectedCategory
                  ? "Select category"
                  : "No streams available"}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
