"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Categories } from "@/lib/xtream";
import { copyToClipboard } from "@/lib/utils";
import {
    ChevronDown,
    ChevronUp,
    Clock,
    Link,
    Star
} from "lucide-react";
import { useState } from "react";
import { xtreamClient } from "../global";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
export function SeriesDetails({ detail }) {
  const [selectedSeason, setSelectedSeason] = useState("1");
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  if (!detail || !detail.info || !detail.episodes) {
    return null; // or you could return a loading indicator or error message
  }

  const copyStreamUrl = (streamId, containerExtension) => {
    const streamUrl = xtreamClient.getStreamUrl(
      streamId,
      containerExtension,
      Categories.Series,
    );
    copyToClipboard(streamUrl);
  };

  const getPlotContent = (plot) => {
    return plot && plot.trim() !== ""
      ? plot
      : "No plot description available for this episode.";
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="w-full max-w-[300px]">
          <img
            alt="Movie Poster"
            className="aspect-[2/3] w-full rounded-md object-cover"
            height="450"
            src={detail.info.cover}
            width="300"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">{detail.info.name}</h3>
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
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Clock className="h-4 w-4" />
              <span>{detail.info.episode_run_time}m</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Star className="h-4 w-4" />
              <span>{detail.info.rating}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <h4 className="mb-2 font-semibold">Synopsis</h4>
          <p className="text-gray-600 dark:text-gray-300">{detail.info.plot}</p>
        </div>
      </div>
      <div className="mt-8">
        <h4 className="mb-2 font-semibold">Seasons and Episodes</h4>
        <div className="flex space-x-4 mb-4">
          <Select
            onValueChange={setSelectedSeason}
            defaultValue={selectedSeason}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(detail.episodes).map((season) => (
                <SelectItem key={season} value={season}>
                  Season {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {detail.episodes[selectedSeason]?.map((episode) => (
            <div key={episode.id} className="p-2 mb-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
              {episode.info.movie_image && (
                <img
                  src={episode.info.movie_image}
                  alt={`Episode ${episode.episode_num}`}
                  width={120}
                  height={68}
                  className="rounded-md object-cover"
                />
              )}
                </div>
                <div className="flex-grow flex flex-col">
                  <div className="font-semibold">
                    Episode {episode.episode_num}: {episode.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Duration: {episode.info.duration}
                  </div>
                  {selectedEpisode === episode.id && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex-grow">
                      {getPlotContent(episode.info.plot)}
                    </p>
                  )}
                  <div className="mt-2 space-x-2 flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedEpisode(
                          selectedEpisode === episode.id ? null : episode.id,
                        )
                      }
                    >
                      {selectedEpisode === episode.id ? (
                        <>
                          <ChevronUp className="mr-2 h-4 w-4" /> Hide Plot
                        </>
                      ) : (
                        <>
                          <ChevronDown className="mr-2 h-4 w-4" /> Show Plot
                        </>
                      )}
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                      onClick={() =>
                        copyStreamUrl(episode.id, episode.container_extension)
                      }
                    >
                      <Link className="mr-2 h-4 w-4" /> Copy Stream URL
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </>
  );
}
