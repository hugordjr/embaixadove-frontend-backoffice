import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "missions.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

async function ensurePaths() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
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

    const id = formData.get("id");
    const title = formData.get("title");
    const description = formData.get("description");
    const points = Number(formData.get("points") ?? 0);
    const type = formData.get("type");
    const status = formData.get("status");
    const deadline = formData.get("deadline");
    const highlighted = String(formData.get("highlighted") ?? "false") === "true";
    const briefing_objective = formData.get("briefing_objective");
    const briefing_target_audience = formData.get("briefing_target_audience");
    const briefing_main_message = formData.get("briefing_main_message");
    const briefing_value_proposition = formData.get("briefing_value_proposition");
    const instructions = formData.get("instructions");
    const required_hashtags = formData.get("required_hashtags");

    // upload de imagem (opcional)
    let image_base64: string | undefined = undefined;
    const image = formData.get("image");
    if (image && image instanceof File) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const filename = `${Date.now()}_${image.name}`.replace(/[^a-zA-Z0-9_.-]/g, "_");
      const filepath = path.join(UPLOADS_DIR, filename);
      await fs.writeFile(filepath, buffer);
      image_base64 = `/uploads/${filename}`;
    }

    const record = {
      id: id ? Number(id) : Date.now(),
      title,
      description,
      image_base64,
      points,
      type,
      status,
      deadline,
      highlighted,
      briefing_objective,
      briefing_target_audience,
      briefing_main_message,
      briefing_value_proposition,
      instructions,
      required_hashtags
    };

    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const list = JSON.parse(raw || "[]");
    list.push(record);
    await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");

    return NextResponse.json({ ok: true, record }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return new NextResponse(err?.message || "Internal Error", { status: 500 });
  }
}


