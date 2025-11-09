import { NextResponse } from "next/server";
import { getOpcDataset } from "@/lib/data/process";

export async function GET() {
  try {
    const dataset = await getOpcDataset();
    return NextResponse.json({ data: dataset });
  } catch (error) {
    console.error("Unable to load OPC graph", error);
    return NextResponse.json(
      { error: "Unable to load OPC graph" },
      { status: 500 },
    );
  }
}

