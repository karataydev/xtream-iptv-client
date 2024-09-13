import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  // Decode the URL from the path parameter
  const encodedUrl = params.slug.join("/");
  console.log("encoded url: " + encodedUrl);
  const url = decodeURIComponent(encodedUrl);
  console.log("decoded url: " + encodedUrl);
  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      // AbortSignal.timeout() is a newer API, you might need to use a polyfill for older environments
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Return the data from the IPTV service
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);

    if (error.name === "AbortError") {
      return NextResponse.json({ error: "Request timed out" }, { status: 504 });
    } else if (error instanceof TypeError) {
      // Network error
      return NextResponse.json(
        { error: "Network error occurred" },
        { status: 503 },
      );
    } else {
      return NextResponse.json(
        { error: "An error occurred while processing your request" },
        { status: 500 },
      );
    }
  }
}
