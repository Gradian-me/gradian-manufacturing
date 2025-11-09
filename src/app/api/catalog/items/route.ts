import { NextResponse } from "next/server";
import { getCatalogItems } from "@/lib/data/catalog";

export async function GET() {
  try {
    const items = await getCatalogItems();
    return NextResponse.json({ data: items });
  } catch (error) {
    console.error("Unable to load catalog items", error);
    return NextResponse.json(
      { error: "Unable to load catalog items" },
      { status: 500 },
    );
  }
}

