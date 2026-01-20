import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Game } from "@/database/entities/Game";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { firstPickId, secondPickId, winnerId, gameDate } =
      await request.json();
    const id = parseInt(params.id);

    const dataSource = await getDataSource();
    const gameRepo = dataSource.getRepository(Game);

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
  { params }: { params: { id: string } },
) {
  try {
    const id = parseInt(params.id);

    const dataSource = await getDataSource();
    const gameRepo = dataSource.getRepository(Game);

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
