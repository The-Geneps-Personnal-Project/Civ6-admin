import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Civ } from "@/database/entities/Civ";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const civRepo = dataSource.getRepository(Civ);
    const civs = await civRepo.find({
      order: { name: "ASC" },
    });
    return NextResponse.json(civs);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération " + error },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const civRepo = dataSource.getRepository(Civ);
    const civ = civRepo.create({ name: name.trim(), description });
    await civRepo.save(civ);

    return NextResponse.json(civ, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création " + error },
      { status: 500 },
    );
  }
}
