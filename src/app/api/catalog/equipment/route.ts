import { NextResponse } from "next/server";
import { getEquipment } from "@/lib/data/catalog";

export async function GET() {
  try {
    const equipment = await getEquipment();
    return NextResponse.json({ data: equipment });
  } catch (error) {
    console.error("Unable to load equipment", error);
    return NextResponse.json(
      { error: "Unable to load equipment" },
      { status: 500 },
    );
  }
}

