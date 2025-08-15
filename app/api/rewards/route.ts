import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "rewards.json");

async function ensurePaths() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([]), "utf-8");
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensurePaths();
    const formData = await req.formData();

    const name = String(formData.get("name") ?? "");
    const description = formData.get("description") ? String(formData.get("description")) : undefined;
    const image_base64 = formData.get("image_base64") ? String(formData.get("image_base64")) : undefined;
    const points_required = Number(formData.get("points_required") ?? 0);
    const stock = Number(formData.get("stock") ?? 0);
    const rules = formData.get("rules") ? String(formData.get("rules")) : undefined;

    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const list = JSON.parse(raw || "[]");
    const newId = (list.at(-1)?.id ?? 0) + 1;

    const record = {
      id: newId,
      name,
      description,
      image_base64,
      points_required,
      stock,
      rules
    };

    list.push(record);
    await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
    return NextResponse.json({ ok: true, record }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return new NextResponse(err?.message || "Internal Error", { status: 500 });
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
    const description = formData.get("description") ? String(formData.get("description")) : current.description;
    const image_base64 = formData.get("image_base64") ? String(formData.get("image_base64")) : current.image_base64;
    const points_required = Number(formData.get("points_required") ?? current.points_required ?? 0);
    const stock = Number(formData.get("stock") ?? current.stock ?? 0);
    const rules = formData.get("rules") ? String(formData.get("rules")) : current.rules;

    const updated = { ...current, name, description, image_base64, points_required, stock, rules };
    list[index] = updated;
    await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
    return NextResponse.json({ ok: true, record: updated }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new NextResponse(err?.message || "Internal Error", { status: 500 });
  }
}


