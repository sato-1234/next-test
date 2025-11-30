import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  // "fetcher-data" タグのキャッシュを削除
  revalidateTag("fetcher-data");

  // 念のためパスのキャッシュも削除
  //revalidatePath("/isr-f");

  return NextResponse.json({
    message: "fetcher-data削除",
    now: new Date().toISOString(),
  });
}
