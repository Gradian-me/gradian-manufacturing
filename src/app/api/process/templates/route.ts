import { NextResponse } from "next/server";
import { getDeviceTemplates } from "@/lib/data/process";

export async function GET() {
  try {
    const templates = await getDeviceTemplates();
    return NextResponse.json({ data: templates });
  } catch (error) {
    console.error("Unable to load device templates", error);
    return NextResponse.json(
      { error: "Unable to load device templates" },
      { status: 500 },
    );
  }
}

