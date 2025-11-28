// src/app/api/sample/route.ts
import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // "sample-tag" のキャッシュを削除
    revalidateTag("sample-tag");
    revalidatePath("/sample");

    return NextResponse.json({
      message: "Revalidation triggered",
      tag: "sample-tag",
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
