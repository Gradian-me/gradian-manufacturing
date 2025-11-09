import { NextResponse } from "next/server";
import { getLaborGrades } from "@/lib/data/catalog";

export async function GET() {
  try {
    const laborGrades = await getLaborGrades();
    return NextResponse.json({ data: laborGrades });
  } catch (error) {
    console.error("Unable to load labor grades", error);
    return NextResponse.json(
      { error: "Unable to load labor grades" },
      { status: 500 },
    );
  }
}

