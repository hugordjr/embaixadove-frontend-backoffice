import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "coupons.json");

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

    const code = String(formData.get("code") ?? "");
    const description = formData.get("description") ? String(formData.get("description")) : undefined;
    const category = formData.get("category") ? String(formData.get("category")) : undefined;
    const valid_until = formData.get("valid_until") ? String(formData.get("valid_until")) : undefined;
    const max_uses = Number(formData.get("max_uses") ?? 0);
    const current_uses = Number(formData.get("current_uses") ?? 0);
    const active = String(formData.get("active") ?? "false") === "true";
    const affiliate_user_id = formData.get("affiliate_user_id")
      ? Number(formData.get("affiliate_user_id"))
      : undefined;

    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const list = JSON.parse(raw || "[]");
    const newId = (list.at(-1)?.id ?? 0) + 1;
    const record = {
      id: newId,
      code,
      description,
      category,
      valid_until,
      max_uses,
      current_uses,
      active,
      affiliate_user_id
    };
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

    const code = String(formData.get("code") ?? current.code ?? "");
    const description = formData.get("description") ? String(formData.get("description")) : current.description;
    const category = formData.get("category") ? String(formData.get("category")) : current.category;
    const valid_until = formData.get("valid_until") ? String(formData.get("valid_until")) : current.valid_until;
    const max_uses = Number(formData.get("max_uses") ?? current.max_uses ?? 0);
    const current_uses = Number(formData.get("current_uses") ?? current.current_uses ?? 0);
    const active = String(formData.get("active") ?? String(current.active ?? "false")) === "true";
    const affiliate_user_id = formData.get("affiliate_user_id")
      ? Number(formData.get("affiliate_user_id"))
      : current.affiliate_user_id;

    const updated = {
      ...current,
      code,
      description,
      category,
      valid_until,
      max_uses,
      current_uses,
      active,
      affiliate_user_id
    };

    list[index] = updated;
    await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
    return NextResponse.json({ ok: true, record: updated }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new NextResponse(err?.message || "Internal Error", { status: 500 });
  }
}


