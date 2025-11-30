const WORKER_URL = process.env.API_WORKER_URL;
const SECRET = process.env.SERVICE_SECRET;

export type WorkerResponse = {
  title: string;
  fetchedAt: string;
};

/**
 * Hono Worker から記事データを取得する
 */
export async function getFromWorker(
  slug?: string
): Promise<WorkerResponse | null> {
  // URLの構築
  const url = new URL(`${WORKER_URL}/api`);
  if (slug) url.searchParams.set("slug", slug);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "x-service-secret": SECRET || "",
      },
      // Worker側ではなく、Next.js側でキャッシュ時間を管理します（ISR）
      next: {
        tags: ["fetcher-data"],
        revalidate: 3600,
      },
    });

    if (!res.ok) {
      console.error(`Worker Error: ${res.status} ${res.statusText}`);
      // エラー時はnullを返すかエラーを投げる
      return null;
    }

    const data = await res.json();
    return data as WorkerResponse;
  } catch (error) {
    console.error("Fetch failed:", error);
    // ビルド時にWorkerが起動していないとここで落ちるので、
    // 必要に応じてダミーデータを返すなどの対策も可能です
    return null;
  }
}
