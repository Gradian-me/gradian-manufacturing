import { NextResponse } from "next/server";
import { getWorkCenters } from "@/lib/data/catalog";

export async function GET() {
  try {
    const workcenters = await getWorkCenters();
    return NextResponse.json({ data: workcenters });
  } catch (error) {
    console.error("Unable to load work centers", error);
    return NextResponse.json(
      { error: "Unable to load work centers" },
      { status: 500 },
    );
  }
}

