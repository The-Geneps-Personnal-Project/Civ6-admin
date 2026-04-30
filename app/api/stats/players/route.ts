import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Player } from "@/database/entities/Player";
import { GamePlayer } from "@/database/entities/GamePlayer";
import { Team } from "@/database/entities/Team";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const playerRepo = dataSource.getRepository(Player);
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

    const tamarPlayers = await playerRepo.find({
      where: { teamId: tamarTeam.id },
      relations: ["team"],
    });

    const playerStats = await Promise.all(
      tamarPlayers.map(async (player) => {
        const gamePlayers = await gamePlayerRepo.find({
          where: { playerId: player.id },
          relations: ["game", "game.winner", "civ"],
        });

        const gamesPlayed = gamePlayers.length;
        const gamesWon = gamePlayers.filter(
          (gp) => gp.game.winnerId === tamarTeam.id,
        ).length;

        const civStats: Record<
          number,
          { civId: number; civName: string; played: number; won: number }
        > = {};

        gamePlayers.forEach((gp) => {
          if (!civStats[gp.civId]) {
            civStats[gp.civId] = {
              civId: gp.civId,
              civName: gp.civ.name,
              played: 0,
              won: 0,
            };
          }
          civStats[gp.civId].played++;
          if (gp.game.winnerId === tamarTeam.id) {
            civStats[gp.civId].won++;
          }
        });

        return {
          playerId: player.id,
          playerName: player.name,
          gamesPlayed,
          gamesWon,
          gamesLost: gamesPlayed - gamesWon,
          winRate:
            gamesPlayed > 0 ? ((gamesWon / gamesPlayed) * 100).toFixed(1) : "0",
          civs: Object.values(civStats).map((civ) => ({
            ...civ,
            winRate:
              civ.played > 0 ? ((civ.won / civ.played) * 100).toFixed(1) : "0",
          })),
        };
      }),
    );

    playerStats.sort((a, b) => b.gamesPlayed - a.gamesPlayed);

    return NextResponse.json({ players: playerStats });
  } catch (error) {
    console.error("Erreur GET players stats:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 },
    );
  }
}
