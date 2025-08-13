import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "app", "dashboard", "pages", "backoffice", "data.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "avatars");

async function ensurePaths() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    await ensurePaths();
    const formData = await req.formData();

    const id = formData.get("id");
    const username = formData.get("username");
    const password = formData.get("password");
    const status = formData.get("status") || "active";
    const name = formData.get("name");
    const photo_url = formData.get("photo_url");
    const department = formData.get("department");
    const position_title = formData.get("position_title");

    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const list = JSON.parse(raw || "[]");

    const newId = id ? Number(id) : (list.at(-1)?.id ?? 0) + 1;
    const record = { id: newId, username, password, status, name, photo_url, department, position_title };

    list.push(record);
    await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");

    return NextResponse.json({ ok: true, record }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return new NextResponse(err?.message || "Internal Error", { status: 500 });
  }
}


