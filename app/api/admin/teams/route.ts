import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Team } from "@/database/entities/Team";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const teamRepo = dataSource.getRepository(Team);
    const teams = await teamRepo.find({
      order: { createdAt: "DESC" },
    });
    return NextResponse.json(teams);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération" + error },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const teamRepo = dataSource.getRepository(Team);
    const team = teamRepo.create({ name: name.trim() });
    await teamRepo.save(team);

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création" + error },
      { status: 500 },
    );
  }
}
