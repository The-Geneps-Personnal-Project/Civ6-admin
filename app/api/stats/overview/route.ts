import { NextResponse } from "next/server";
import { getOverviewStats } from "@/lib/stats";

export async function GET() {
  try {
    const stats = await getOverviewStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erreur GET overview:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 },
    );
  }
}
