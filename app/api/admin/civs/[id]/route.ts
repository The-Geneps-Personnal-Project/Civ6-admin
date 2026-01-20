import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Civ } from "@/database/entities/Civ";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { name, description } = await request.json();
    const id = parseInt(params.id);

    const dataSource = await getDataSource();
    const civRepo = dataSource.getRepository(Civ);

    const civ = await civRepo.findOneBy({ id });
    if (!civ) {
      return NextResponse.json(
        { error: "Civilisation non trouvée" },
        { status: 404 },
      );
    }

    civ.name = name;
    civ.description = description;
    await civRepo.save(civ);

    return NextResponse.json(civ);
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
    const civRepo = dataSource.getRepository(Civ);

    const result = await civRepo.delete(id);

    if (result.affected === 0) {
      return NextResponse.json(
        { error: "Civilisation non trouvée" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression " + error },
      { status: 500 },
    );
  }
}
