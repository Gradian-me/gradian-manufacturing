import { NextResponse } from "next/server";
import { getOperationLogs } from "@/lib/data/manufacturing";

export async function GET() {
  try {
    const operationLogs = await getOperationLogs();
    return NextResponse.json({ data: operationLogs });
  } catch (error) {
    console.error("Unable to load operation logs", error);
    return NextResponse.json(
      { error: "Unable to load operation logs" },
      { status: 500 },
    );
  }
}

