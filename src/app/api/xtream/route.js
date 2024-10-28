import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Add more headers to mimic a browser request
    const response = await fetch(body.url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Origin: "null",
        Referer: "null",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      // Add cache control
      cache: "no-store",
      credentials: "omit",
    });

    if (!response.ok) {
      console.error("Xtream API error:", {
        status: response.status,
        statusText: response.statusText,
        url: body.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 },
    );
  }
}
