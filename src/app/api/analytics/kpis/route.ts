import { NextResponse } from "next/server";
import { getAnalyticsPayload } from "@/lib/data/analytics";

export async function GET() {
  try {
    const analytics = await getAnalyticsPayload();
    return NextResponse.json({ data: analytics });
  } catch (error) {
    console.error("Unable to load analytics", error);
    return NextResponse.json(
      { error: "Unable to load analytics" },
      { status: 500 },
    );
  }
}

