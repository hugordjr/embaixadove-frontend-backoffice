import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "levels.json");

async function ensurePaths() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([]), "utf-8");
  }
}

export async function GET() {
  try {
    await ensurePaths();
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const list = JSON.parse(raw || "[]");
    return NextResponse.json(list, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new NextResponse(err?.message || "Internal Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensurePaths();
    const formData = await req.formData();

    const name = String(formData.get("name") ?? "");
    const level_number = Number(formData.get("level_number") ?? 0);
    const min_points = Number(formData.get("min_points") ?? 0);
    const max_points = Number(formData.get("max_points") ?? 0);

    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const list = JSON.parse(raw || "[]");
    const newId = (list.at(-1)?.id ?? 0) + 1;

    const record = { id: newId, name, level_number, min_points, max_points };
    list.push(record);
    await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
    return NextResponse.json({ ok: true, record }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return new NextResponse(err?.message || "Internal Error", { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await ensurePaths();
    const formData = await req.formData();
    const idParam = formData.get("id");
    if (!idParam) return new NextResponse("id é obrigatório", { status: 400 });
    const id = Number(idParam);

    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const list = JSON.parse(raw || "[]");
    const index = list.findIndex((it: any) => Number(it.id) === id);
    if (index === -1) return new NextResponse("Registro não encontrado", { status: 404 });

    const current = list[index];
    const name = String(formData.get("name") ?? current.name ?? "");
    const level_number = Number(formData.get("level_number") ?? current.level_number ?? 0);
    const min_points = Number(formData.get("min_points") ?? current.min_points ?? 0);
    const max_points = Number(formData.get("max_points") ?? current.max_points ?? 0);

    const updated = { ...current, name, level_number, min_points, max_points };
    list[index] = updated;
    await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
    return NextResponse.json({ ok: true, record: updated }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new NextResponse(err?.message || "Internal Error", { status: 500 });
  }
}


