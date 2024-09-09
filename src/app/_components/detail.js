"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Film, Tv, Radio, Search, PlayCircle, Clock, Star } from "lucide-react";
import { xtreamClient } from "../global";
import { useState, useEffect, useReducer } from "react";

export function StreamDetail({ selectedStream, category }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreamDetail = async () => {
      setLoading(true);
      try {
        const streamInfo = await xtreamClient.getVODInfo(selectedStream);
        setDetail(streamInfo);
      } catch (error) {
        console.error("Error fetching stream detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamDetail();
  }, [selectedStream]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!detail) {
    return <div></div>;
  }
  return (
    <ScrollArea className="h-[96vh] flex-grow bg-gray-50 dark:bg-black p-6">
      <div className="max-w-xl">
        <h2 className="mb-6 text-lg font-semibold">Movie Details</h2>
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <img
            alt="Movie Poster"
            className="aspect-[2/3] w-full rounded-md object-cover"
            height="450"
            src={detail.info.movie_image}
            width="300"
          />
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">{detail.info.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {detail.info.description}
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <Clock className="h-4 w-4" />
                <span>{detail.info.duration}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <Star className="h-4 w-4" />
                <span>{detail.info.rating}</span>
              </div>
            </div>
            <Button
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                const streamUrl = xtreamClient.getStreamUrl(
                  detail.movie_data.stream_id,
                  detail.movie_data.container_extension,
                  category,
                );
                navigator.clipboard
                  .writeText(streamUrl)
                  .then(() => {
                    alert("Stream URL copied to clipboard!");
                  })
                  .catch((err) => {
                    console.error("Failed to copy: ", err);
                  });
              }}
            >
              Copy Link to Clipboard
            </Button>
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-semibold">Cast</h4>
            <p className="text-gray-600 dark:text-gray-300">
              {detail.info.cast}
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Director</h4>
            <p className="text-gray-600 dark:text-gray-300">
              {detail.info.director}
            </p>
          </div>
          <div className="md:col-span-2">
            <h4 className="mb-2 font-semibold">Synopsis</h4>
            <p className="text-gray-600 dark:text-gray-300">
              {detail.info.plot}
            </p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
