import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Map } from "@/database/entities/Map";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const mapRepo = dataSource.getRepository(Map);
    const maps = await mapRepo.find({
      order: { name: "ASC" },
    });
    return NextResponse.json(maps);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const mapRepo = dataSource.getRepository(Map);
    const map = mapRepo.create({ name: name.trim() });
    await mapRepo.save(map);

    return NextResponse.json(map, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 },
    );
  }
}
