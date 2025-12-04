// src/app/api/sample/route.ts
import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  // "unstable-data" タグのキャッシュを削除
  revalidateTag("unstable-data");

  // 念のためパスのキャッシュも削除
  revalidatePath("/isr-u");

  return NextResponse.json({
    message: "unstable-data削除",
    now: new Date().toISOString(),
  });
}
