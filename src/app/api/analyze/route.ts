import { NextRequest, NextResponse } from "next/server";
import { analyzePronunciationAudio } from "@/lib/gemini";

function getStringField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio");
    const targetSound = getStringField(formData, "targetSound");
    const word = getStringField(formData, "word");
    const ageValue = Number(getStringField(formData, "age"));

    if (!(audio instanceof File) || audio.size === 0) {
      return NextResponse.json(
        { error: "Missing required audio file." },
        { status: 400 }
      );
    }

    if (!targetSound || !word) {
      return NextResponse.json(
        { error: "Missing required fields: targetSound and word." },
        { status: 400 }
      );
    }

    const bytes = await audio.arrayBuffer();
    const audioBase64 = Buffer.from(bytes).toString("base64");
    const result = await analyzePronunciationAudio({
      age: Number.isFinite(ageValue) && ageValue > 0 ? ageValue : 6,
      audioBase64,
      mimeType: audio.type || "audio/webm",
      targetSound,
      word,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed.";
    console.error("ANALYZE ERROR:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
