// src/lib/sample.ts
import { unstable_cache } from "next/cache";
import { notion, DATA_SOURCE_ID } from "@/lib/notion/client";

// キャッシュされる関数
const fetchFromNotion = async (slug?: string) => {
  const response = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
    filter: {
      and: [
        {
          property: "Title",
          title: {
            is_not_empty: true,
          },
        },
        {
          property: "Slug",
          rich_text: slug ? { equals: slug } : { is_not_empty: true },
        },
        {
          property: "Status",
          select: {
            equals: "published", // 公開記事のみ取得
          },
        },
        {
          property: "Category",
          select: { is_not_empty: true },
        },
        {
          property: "PublishedAt",
          date: {
            is_not_empty: true,
          },
        },
      ],
    },
    sorts: [
      {
        property: "PublishedAt",
        direction: "descending",
      },
    ],
  });

  if (response.results.length === 0) {
    console.error("取得記事は0件です");
    return {
      title: "取得記事は0件です",
      fetchedAt: new Date().toISOString(),
    };
  }
  console.log(response.results.length);

  const firstItem = response.results[0];
  // 一旦簡易的に取得
  const title =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (firstItem as any).properties.Title.title[0].plain_text || "No Title";

  return {
    title: title,
    fetchedAt: new Date().toISOString(),
  };
};

// unstable_cache でラップ
export const getSampleData = unstable_cache(
  async (slug?: string) => fetchFromNotion(slug),
  ["unstable-data-key"], // 内部キャッシュキー
  {
    tags: ["unstable-data"], // ISR用タグ
    revalidate: false, // 時間経過では更新しない（ISRのみにする場合）
  }
);
