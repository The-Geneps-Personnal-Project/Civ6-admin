import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Team } from "@/database/entities/Team";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { name } = await request.json();
    const id = parseInt(params.id);

    const dataSource = await getDataSource();
    const teamRepo = dataSource.getRepository(Team);

    const team = await teamRepo.findOneBy({ id });
    if (!team) {
      return NextResponse.json(
        { error: "Équipe non trouvée" },
        { status: 404 },
      );
    }

    team.name = name;
    await teamRepo.save(team);

    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la modification" + error },
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
    const teamRepo = dataSource.getRepository(Team);

    const result = await teamRepo.delete(id);

    if (result.affected === 0) {
      return NextResponse.json(
        { error: "Équipe non trouvée" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression" + error },
      { status: 500 },
    );
  }
}
