import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Game } from "@/database/entities/Game";
import { Team } from "@/database/entities/Team";

export async function GET() {
  try {
    const dataSource = await getDataSource();
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

    const totalGames = await gameRepo.count();

    const tamarWins = await gameRepo.count({
      where: { winnerId: tamarTeam.id },
    });

    const recentGames = await gameRepo.find({
      relations: [
        "firstPick",
        "secondPick",
        "winner",
        "map",
        "players",
        "players.player",
        "players.civ",
      ],
      order: { gameDate: "DESC" },
      take: 10,
    });

    const gamesWithTamar = await gameRepo.find({
      relations: ["firstPick", "secondPick", "winner"],
    });

    const opponentStats: Record<
      string,
      { played: number; won: number; lost: number; teamName: string }
    > = {};

    gamesWithTamar.forEach((game) => {
      let opponent: { id: number; name: string } | null = null;

      if (game.firstPickId === tamarTeam.id) {
        opponent = game.secondPick;
      } else if (game.secondPickId === tamarTeam.id) {
        opponent = game.firstPick;
      }

      if (opponent) {
        if (!opponentStats[opponent.id]) {
          opponentStats[opponent.id] = {
            played: 0,
            won: 0,
            lost: 0,
            teamName: opponent.name,
          };
        }

        opponentStats[opponent.id].played++;

        if (game.winnerId === tamarTeam.id) {
          opponentStats[opponent.id].won++;
        } else if (game.winnerId === opponent.id) {
          opponentStats[opponent.id].lost++;
        }
      }
    });

    const winRate =
      totalGames > 0 ? ((tamarWins / totalGames) * 100).toFixed(1) : "0";

    return NextResponse.json({
      totalGames,
      tamarWins,
      tamarLosses: totalGames - tamarWins,
      winRate,
      recentGames,
      opponentStats: Object.entries(opponentStats).map(([id, stats]) => ({
        teamId: parseInt(id),
        ...stats,
        winRate:
          stats.played > 0
            ? ((stats.won / stats.played) * 100).toFixed(1)
            : "0",
      })),
    });
  } catch (error) {
    console.error("Erreur GET overview:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 },
    );
  }
}
