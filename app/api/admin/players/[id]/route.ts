import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Player } from "@/database/entities/Player";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { name, teamId } = await request.json();
    const id = parseInt(params.id);

    const dataSource = await getDataSource();
    const playerRepo = dataSource.getRepository(Player);

    const player = await playerRepo.findOneBy({ id });
    if (!player) {
      return NextResponse.json({ error: "Joueur non trouvé" }, { status: 404 });
    }

    player.name = name;
    player.teamId = teamId;
    await playerRepo.save(player);

    return NextResponse.json(player);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la modification " + error },
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
    const playerRepo = dataSource.getRepository(Player);

    const result = await playerRepo.delete(id);

    if (result.affected === 0) {
      return NextResponse.json({ error: "Joueur non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression " + error },
      { status: 500 },
    );
  }
}
