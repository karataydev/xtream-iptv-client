"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Clock,
    Link
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { xtreamClient } from "../global";

function decodeBase64(str) {
  // Decode base64 (convert ascii to binary)
  const binaryString = atob(str);
  // Convert binary string to character-number array
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  // Convert to UTF-8
  return new TextDecoder("utf-8").decode(bytes);
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

export function LiveStreamDetails({ detail }) {
  const [decodedEpg, setDecodedEpg] = useState([]);
  useEffect(() => {
    const getEPG = async () => {
      const x = await xtreamClient.getAllEPGLiveStreams(detail.id);

      if (x && x.epg_listings && Array.isArray(x.epg_listings)) {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const decoded = x.epg_listings
          .filter((item) => new Date(item.start) < tomorrow)
          .map((item) => ({
            ...item,
            title: decodeBase64(item.title),
            description: decodeBase64(item.description),
          }));
        setDecodedEpg(decoded);
      }
    };
    getEPG();
  }, [detail]);

  if (!detail) return;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="w-full max-w-[300px]">
          <Image
            alt="Channel Logo"
            className="aspect-square w-full rounded-md object-cover"
            height="400"
            src={detail.icon}
            width="400"
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold mt-4">{detail.name}</h3>
          <Button
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              const streamUrl = xtreamClient.getStreamUrl(
                detail.stream_id,
                detail.container_extension,
                "live",
              );
              copyToClipboard(streamUrl);
            }}
          >
            <Link className="mr-2 h-4 w-4" /> Copy Stream URL
          </Button>
        </div>
      </div>
      <Card className="w-full bg-white dark:bg-black border-gray-200 dark:border-gray-700 mt-8">
        <CardContent>
          <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            24-Hour Program Guide
          </h4>
          <ScrollArea className="h-[500px] pr-4">
            {decodedEpg.map((program, index) => (
              <div
                key={index}
                className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <h5 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  {program.title}
                </h5>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTime(program.start)} - {formatTime(program.end)}
                  </div>
                </div>
                <Badge variant="secondary" className="mb-2">
                  {program.lang.toUpperCase()}
                </Badge>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {program.description}
                </p>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}
