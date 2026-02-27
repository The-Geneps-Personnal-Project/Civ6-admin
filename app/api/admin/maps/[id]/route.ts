import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Map } from "@/database/entities/Map";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { name } = await request.json();
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const dataSource = await getDataSource();
    const mapRepo = dataSource.getRepository(Map);

    const map = await mapRepo.findOneBy({ id });
    if (!map) {
      return NextResponse.json({ error: "Carte non trouvée" }, { status: 404 });
    }

    map.name = name;
    await mapRepo.save(map);

    return NextResponse.json(map);
  } catch (error) {
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
    const mapRepo = dataSource.getRepository(Map);

    const result = await mapRepo.delete(id);

    if (result.affected === 0) {
      return NextResponse.json({ error: "Carte non trouvée" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 },
    );
  }
}
