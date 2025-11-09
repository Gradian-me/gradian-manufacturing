import { NextResponse } from "next/server";
import { getRoutingDefinitions } from "@/lib/data/process";

export async function GET() {
  try {
    const routing = await getRoutingDefinitions();
    return NextResponse.json({ data: routing });
  } catch (error) {
    console.error("Unable to load routing definitions", error);
    return NextResponse.json(
      { error: "Unable to load routing definitions" },
      { status: 500 },
    );
  }
}

