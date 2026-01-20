import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Game } from "@/database/entities/Game";
import { GamePlayer } from "@/database/entities/GamePlayer";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const gameRepo = dataSource.getRepository(Game);
    const games = await gameRepo.find({
      relations: ["firstPick", "secondPick", "winner"],
      order: { gameDate: "DESC" },
    });
    return NextResponse.json(games);
  } catch (error) {
    console.error("Erreur GET games:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { firstPickId, secondPickId, winnerId, gameDate, players } =
      await request.json();

    if (!firstPickId || !secondPickId || !winnerId || !gameDate) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 },
      );
    }

    const dataSource = await getDataSource();
    const gameRepo = dataSource.getRepository(Game);
    const gamePlayerRepo = dataSource.getRepository(GamePlayer);

    const game = gameRepo.create({
      firstPickId,
      secondPickId,
      winnerId,
      gameDate: new Date(gameDate),
    });
    await gameRepo.save(game);

    if (players && Array.isArray(players) && players.length > 0) {
      const gamePlayers = players.map((p: any) =>
        gamePlayerRepo.create({
          gameId: game.id,
          playerId: p.playerId,
          civId: p.civId,
          teamId: p.teamId,
        }),
      );
      await gamePlayerRepo.save(gamePlayers);
    }

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error("Erreur POST game:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 },
    );
  }
}
