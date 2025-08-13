import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "influencers.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "avatars");

async function ensurePaths() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([]), "utf-8");
  }
}

export async function GET(req: NextRequest) {
  try {
    await ensurePaths();
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const list = JSON.parse(raw || "[]");
    if (idParam) {
      const id = Number(idParam);
      const item = list.find((it: any) => Number(it.id) === id);
      if (!item) return new NextResponse("Registro não encontrado", { status: 404 });
      return NextResponse.json(item, { status: 200 });
    }
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
    const nickname = formData.get("nickname") ? String(formData.get("nickname")) : undefined;
    const description = formData.get("description") ? String(formData.get("description")) : undefined;

    const level_name = String(formData.get("level_name") ?? "");
    const level_number = Number(formData.get("level_number") ?? 0);

    const current_points = Number(formData.get("current_points") ?? 0);
    const missions_completed_count = Number(formData.get("missions_completed_count") ?? 0);
    const ranking = Number(formData.get("ranking") ?? 0);

    const is_brand = String(formData.get("is_brand") ?? "false") === "true";
    const affiliate_link_url = formData.get("affiliate_link_url")
      ? String(formData.get("affiliate_link_url"))
      : undefined;

    // upload de foto (opcional)
    let photo_url: string | undefined = undefined;
    const photo = formData.get("photo");
    if (photo && photo instanceof File) {
      const arrayBuffer = await photo.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer as ArrayBuffer);
      const filename = `${Date.now()}_${photo.name}`.replace(/[^a-zA-Z0-9_.-]/g, "_");
      const filepath = path.join(UPLOADS_DIR, filename);
      await fs.writeFile(filepath, uint8);
      photo_url = `/uploads/avatars/${filename}`;
    }

    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const list = JSON.parse(raw || "[]");

    const newId = (list.at(-1)?.id ?? 0) + 1;
    const record = {
      id: newId,
      name,
      nickname,
      photo_url,
      description,
      level_name,
      level_number,
      current_points,
      missions_completed_count,
      ranking,
      is_brand,
      affiliate_link_url
    };

    list.push(record);
    await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");

    return NextResponse.json({ ok: true, record }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return new NextResponse(err?.message || "Internal Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensurePaths();
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    if (!idParam) return new NextResponse("id é obrigatório", { status: 400 });
    const id = Number(idParam);

    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const list = JSON.parse(raw || "[]");
    const index = list.findIndex((it: any) => Number(it.id) === id);
    if (index === -1) return new NextResponse("Registro não encontrado", { status: 404 });

    const [removed] = list.splice(index, 1);
    await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");

    return NextResponse.json({ ok: true, removed }, { status: 200 });
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
    const nickname = formData.get("nickname") ? String(formData.get("nickname")) : current.nickname;
    const description = formData.get("description") ? String(formData.get("description")) : current.description;

    const level_name = String(formData.get("level_name") ?? current.level_name ?? "");
    const level_number = Number(formData.get("level_number") ?? current.level_number ?? 0);

    const current_points = Number(formData.get("current_points") ?? current.current_points ?? 0);
    const missions_completed_count = Number(formData.get("missions_completed_count") ?? current.missions_completed_count ?? 0);
    const ranking = Number(formData.get("ranking") ?? current.ranking ?? 0);

    const is_brand = String(formData.get("is_brand") ?? String(current.is_brand ?? "false")) === "true";
    const affiliate_link_url = formData.get("affiliate_link_url")
      ? String(formData.get("affiliate_link_url"))
      : current.affiliate_link_url;

    let photo_url: string | undefined = current.photo_url;
    const photo = formData.get("photo");
    if (photo && photo instanceof File) {
      const arrayBuffer = await photo.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer as ArrayBuffer);
      const filename = `${Date.now()}_${photo.name}`.replace(/[^a-zA-Z0-9_.-]/g, "_");
      const filepath = path.join(UPLOADS_DIR, filename);
      await fs.writeFile(filepath, uint8);
      photo_url = `/uploads/avatars/${filename}`;
    }

    const updated = {
      ...current,
      name,
      nickname,
      photo_url,
      description,
      level_name,
      level_number,
      current_points,
      missions_completed_count,
      ranking,
      is_brand,
      affiliate_link_url
    };

    list[index] = updated;
    await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");

    return NextResponse.json({ ok: true, record: updated }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new NextResponse(err?.message || "Internal Error", { status: 500 });
  }
}


