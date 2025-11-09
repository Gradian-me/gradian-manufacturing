import { NextResponse } from "next/server";
import { getManufacturingOrders } from "@/lib/data/manufacturing";

export async function GET() {
  try {
    const manufacturingOrders = await getManufacturingOrders();
    return NextResponse.json({ data: manufacturingOrders });
  } catch (error) {
    console.error("Unable to load manufacturing orders", error);
    return NextResponse.json(
      { error: "Unable to load manufacturing orders" },
      { status: 500 },
    );
  }
}

