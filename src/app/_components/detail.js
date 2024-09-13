"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Categories } from "@/lib/xtream";
import { useEffect, useState } from "react";
import { xtreamClient, xtreamValues } from "../global";
import { LiveStreamDetails } from "./livestreamdetails";
import { MovieDetails } from "./moviedetails";
import { SeriesDetails } from "./seriesdetails";

export function StreamDetail({ selectedStream, category }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStreamInfo = (category, selectedStream) => {
    switch (category) {
      case Categories.Movies:
        return xtreamClient.getVODInfo(selectedStream);
      case Categories.LiveStreams:
        return xtreamValues.liveTvStreams.find((t) => t.id === selectedStream);
      case Categories.Series:
        return xtreamClient.getSeriesInfo(selectedStream);
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchStreamDetail = async () => {
      setLoading(true);
      try {
        setDetail(null);
        if (selectedStream && category) {
          const streamInfo = await getStreamInfo(category, selectedStream);
          setDetail(streamInfo);
        }
      } catch (error) {
        console.error("Error fetching stream detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamDetail();
  }, [category, selectedStream]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!detail) {
    return <div></div>;
  }
  return (
    <ScrollArea className="h-[96vh] flex-grow bg-gray-50 dark:bg-black p-6">
      <div className="max-w-2xl">
        <h2 className="mb-6 text-lg font-semibold">Details</h2>
        {category === Categories.Movies && <MovieDetails detail={detail} />}
        {category === Categories.Series && <SeriesDetails detail={detail} />}
        {category === Categories.LiveStreams && (
          <LiveStreamDetails detail={detail} />
        )}
      </div>
    </ScrollArea>
  );
}
