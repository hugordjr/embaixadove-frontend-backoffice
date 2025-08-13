import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "posts.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "posts");

async function ensurePaths() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
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

    const author_id = Number(formData.get("author_id"));
    const content = String(formData.get("content") ?? "");
    const type = formData.get("type") ? String(formData.get("type")) : undefined;
    const posted_at = formData.get("posted_at") ? String(formData.get("posted_at")) : undefined;
    const likes_count = Number(formData.get("likes_count") ?? 0);
    const comments_count = Number(formData.get("comments_count") ?? 0);

    let media_url: string | undefined = formData.get("media_url") ? String(formData.get("media_url")) : undefined;

    const media = formData.get("media");
    if (media && media instanceof File) {
      const arrayBuffer = await media.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer as ArrayBuffer);
      const filename = `${Date.now()}_${media.name}`.replace(/[^a-zA-Z0-9_.-]/g, "_");
      const filepath = path.join(UPLOADS_DIR, filename);
      await fs.writeFile(filepath, uint8);
      media_url = `/uploads/posts/${filename}`;
    }

    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const list = JSON.parse(raw || "[]");
    const newId = (list.at(-1)?.id ?? 0) + 1;

    const record = {
      id: newId,
      author_id,
      content,
      media_url,
      type,
      posted_at,
      likes_count,
      comments_count
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

    const author_id = formData.get("author_id") ? Number(formData.get("author_id")) : current.author_id;
    const content = String(formData.get("content") ?? current.content ?? "");
    const type = formData.get("type") ? String(formData.get("type")) : current.type;
    const posted_at = formData.get("posted_at") ? String(formData.get("posted_at")) : current.posted_at;
    const likes_count = Number(formData.get("likes_count") ?? current.likes_count ?? 0);
    const comments_count = Number(formData.get("comments_count") ?? current.comments_count ?? 0);

    let media_url: string | undefined = formData.get("media_url") ? String(formData.get("media_url")) : current.media_url;
    const media = formData.get("media");
    if (media && media instanceof File) {
      const arrayBuffer = await media.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer as ArrayBuffer);
      const filename = `${Date.now()}_${media.name}`.replace(/[^a-zA-Z0-9_.-]/g, "_");
      const filepath = path.join(UPLOADS_DIR, filename);
      await fs.writeFile(filepath, uint8);
      media_url = `/uploads/posts/${filename}`;
    }

    const updated = {
      ...current,
      author_id,
      content,
      media_url,
      type,
      posted_at,
      likes_count,
      comments_count
    };

    list[index] = updated;
    await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
    return NextResponse.json({ ok: true, record: updated }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new NextResponse(err?.message || "Internal Error", { status: 500 });
  }
}


