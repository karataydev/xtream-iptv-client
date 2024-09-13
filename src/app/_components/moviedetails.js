"use client";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";
import { Categories } from "@/lib/xtream";
import {
    Clock,
    Link,
    Star
} from "lucide-react";
import Image from "next/image";
import { xtreamClient } from "../global";

export function MovieDetails({ detail }) {
  if (!detail) return;
  if (!detail.info) return;
  return (
    <>
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="w-full max-w-[300px]">
          <Image
            alt="Movie Poster"
            className="aspect-[2/3] w-full rounded-md object-cover"
            height="450"
            src={detail.info.movie_image}
            width="300"
          />
        </div>
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
                Categories.Movies,
              );
              copyToClipboard(streamUrl);
            }}
          >
            <Link className="mr-2 h-4 w-4" /> Copy Stream URL
          </Button>
        </div>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="mb-2 font-semibold">Cast</h4>
          <p className="text-gray-600 dark:text-gray-300">{detail.info.cast}</p>
        </div>
        <div>
          <h4 className="mb-2 font-semibold">Director</h4>
          <p className="text-gray-600 dark:text-gray-300">
            {detail.info.director}
          </p>
        </div>
        <div className="md:col-span-2">
          <h4 className="mb-2 font-semibold">Synopsis</h4>
          <p className="text-gray-600 dark:text-gray-300">{detail.info.plot}</p>
        </div>
      </div>
    </>
  );
}
