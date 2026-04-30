import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Civ } from "@/database/entities/Civ";
import { GamePlayer } from "@/database/entities/GamePlayer";
import { Team } from "@/database/entities/Team";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const civRepo = dataSource.getRepository(Civ);
    const gamePlayerRepo = dataSource.getRepository(GamePlayer);
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

    const allCivs = await civRepo.find();

    const civStats = await Promise.all(
      allCivs.map(async (civ) => {
        const gamePlayers = await gamePlayerRepo.find({
          where: { civId: civ.id, teamId: tamarTeam.id },
          relations: ["game", "game.winner", "player"],
        });

        const played = gamePlayers.length;
        const won = gamePlayers.filter(
          (gp) => gp.game.winnerId === tamarTeam.id,
        ).length;

        return {
          civId: civ.id,
          civName: civ.name,
          civDescription: civ.description,
          played,
          won,
          lost: played - won,
          winRate: played > 0 ? ((won / played) * 100).toFixed(1) : "0",
        };
      }),
    );

    const playedCivs = civStats
      .filter((c) => c.played > 0)
      .sort((a, b) => b.played - a.played);

    return NextResponse.json({ civs: playedCivs });
  } catch (error) {
    console.error("Erreur GET civs stats:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 },
    );
  }
}
