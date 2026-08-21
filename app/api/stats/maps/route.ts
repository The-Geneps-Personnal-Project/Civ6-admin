import { NextResponse } from "next/server";
import { getMapsStats } from "@/lib/stats";

export async function GET() {
  try {
    const stats = await getMapsStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erreur GET maps stats:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 },
    );
  }
}
