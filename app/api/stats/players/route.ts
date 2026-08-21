import { NextResponse } from "next/server";
import { getPlayersStats } from "@/lib/stats";

export async function GET() {
  try {
    const stats = await getPlayersStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erreur GET players stats:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 },
    );
  }
}
