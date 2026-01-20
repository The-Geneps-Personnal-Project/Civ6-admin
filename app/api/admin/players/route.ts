import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Player } from "@/database/entities/Player";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const playerRepo = dataSource.getRepository(Player);
    const players = await playerRepo.find({
      relations: ["team"],
      order: { createdAt: "DESC" },
    });
    return NextResponse.json(players);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération " + error },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, teamId } = await request.json();

    if (!name || !teamId) {
      return NextResponse.json(
        { error: "Le nom et l'équipe sont requis" },
        { status: 400 },
      );
    }

    const dataSource = await getDataSource();
    const playerRepo = dataSource.getRepository(Player);
    const player = playerRepo.create({ name: name.trim(), teamId });
    await playerRepo.save(player);

    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création " + error },
      { status: 500 },
    );
  }
}
