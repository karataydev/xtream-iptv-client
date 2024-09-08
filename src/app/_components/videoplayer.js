"use client";

import React, { useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VideoPlayer({ videoUrl, setVideoUrl }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoUrl]);

  const handleLoadedMetadata = () => {
    console.log("Video metadata loaded");
    console.log("Duration:", videoRef.current.duration);
    console.log("Video width:", videoRef.current.videoWidth);
    console.log("Video height:", videoRef.current.videoHeight);
  };

  const handleError = (e) => {
    console.error("Video error:", e);
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          autoPlay
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleError}
        >
          <source src={videoUrl} type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <Button
          onClick={() => setVideoUrl(null)}
          variant="ghost"
          className="absolute top-2 left-2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity z-10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    </div>
  );
}
