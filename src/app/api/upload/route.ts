import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage.from("kindling-kiosk").upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data } = supabase.storage.from("kindling-kiosk").getPublicUrl(filename);

    return NextResponse.json({ url: data.publicUrl }, { status: 200 });
}
