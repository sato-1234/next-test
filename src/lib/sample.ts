// src/lib/sample.ts
import { unstable_cache } from "next/cache";
import { notion, DATA_SOURCE_ID } from "@/lib/notion/client";

// キャッシュされる関数
const fetchFromNotion = async () => {
  console.log("Notion API実行"); // 再取得時にログが出る

  // 負荷をかけないよう1件だけ取得
  const response = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
    page_size: 1,
  });

  return {
    id: response.results[0]?.id || "no-item",
    title:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (response.results[0] as any).properties?.Name?.title?.[0]?.plain_text ||
      "No Title",
    fetchedAt: new Date().toISOString(),
  };
};

// unstable_cache でラップ
export const getSampleData = unstable_cache(
  async () => fetchFromNotion(),
  ["sample-data-key"], // 内部キャッシュキー
  {
    tags: ["sample-tag"], // ISR用タグ
    revalidate: false, // 時間経過では更新しない（ISRのみにする場合）
  }
);
