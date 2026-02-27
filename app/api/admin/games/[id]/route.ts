import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Game } from "@/database/entities/Game";
import { GamePlayer } from "@/database/entities/GamePlayer";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const dataSource = await getDataSource();
    const gameRepo = dataSource.getRepository(Game);

    const game = await gameRepo.findOne({
      where: { id },
      relations: [
        "firstPick",
        "secondPick",
        "winner",
        "players",
        "players.player",
        "players.civ",
        "players.team",
      ],
    });

    if (!game) {
      return NextResponse.json(
        { error: "Partie non trouvée" },
        { status: 404 },
      );
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("Erreur GET game:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { firstPickId, secondPickId, winnerId, gameDate, players } =
      await request.json();
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const dataSource = await getDataSource();
    const gameRepo = dataSource.getRepository(Game);
    const gamePlayerRepo = dataSource.getRepository(GamePlayer);

    const game = await gameRepo.findOneBy({ id });
    if (!game) {
      return NextResponse.json(
        { error: "Partie non trouvée" },
        { status: 404 },
      );
    }

    game.firstPickId = firstPickId;
    game.secondPickId = secondPickId;
    game.winnerId = winnerId;
    game.gameDate = new Date(gameDate);
    await gameRepo.save(game);

    if (players && Array.isArray(players)) {
      await gamePlayerRepo.delete({ gameId: id });

      if (players.length > 0) {
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
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("Erreur PUT game:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const dataSource = await getDataSource();
    const gameRepo = dataSource.getRepository(Game);
    const gamePlayerRepo = dataSource.getRepository(GamePlayer);

    await gamePlayerRepo.delete({ gameId: id });

    const result = await gameRepo.delete(id);

    if (result.affected === 0) {
      return NextResponse.json(
        { error: "Partie non trouvée" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE game:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 },
    );
  }
}
