import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Map } from "@/database/entities/Map";
import { Game } from "@/database/entities/Game";
import { Team } from "@/database/entities/Team";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const mapRepo = dataSource.getRepository(Map);
    const gameRepo = dataSource.getRepository(Game);
    const teamRepo = dataSource.getRepository(Team);

    const tamarTeam = await teamRepo.findOne({
      where: { name: "TamarLaPote" },
    });

    if (!tamarTeam) {
      return NextResponse.json(
        { error: "Équipe TamarLaPote non trouvée" },
        { status: 404 },
      );
    }

    const allMaps = await mapRepo.find();

    const mapStats = await Promise.all(
      allMaps.map(async (map) => {
        const games = await gameRepo.find({
          where: { mapId: map.id },
          relations: ["winner", "firstPick", "secondPick"],
        });

        const tamarGames = games.filter(
          (g) =>
            g.firstPickId === tamarTeam.id || g.secondPickId === tamarTeam.id,
        );

        const played = tamarGames.length;
        const won = tamarGames.filter(
          (g) => g.winnerId === tamarTeam.id,
        ).length;

        return {
          mapId: map.id,
          mapName: map.name,
          played,
          won,
          lost: played - won,
          winRate: played > 0 ? ((won / played) * 100).toFixed(1) : "0",
        };
      }),
    );

    const playedMaps = mapStats
      .filter((m) => m.played > 0)
      .sort((a, b) => b.played - a.played);

    return NextResponse.json({ maps: playedMaps });
  } catch (error) {
    console.error("Erreur GET maps stats:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 },
    );
  }
}
