import { NextResponse } from "next/server";
import { getCivsStats } from "@/lib/stats";

export async function GET() {
  try {
    const stats = await getCivsStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erreur GET civs stats:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 },
    );
  }
}
