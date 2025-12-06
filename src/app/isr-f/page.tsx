import { getFromWorker } from "@/lib/fetcher";

export default async function Page() {
  // Hono Worker を叩く
  const data = await getFromWorker();
  const renderedAt = new Date().toISOString();

  return (
    <div style={{ padding: "40px", fontFamily: "monospace" }}>
      <h1>Microservice（fetch） ISR Test</h1>
      <p>
        Fetching from: <code>{process.env.API_WORKER_URL}</code>
      </p>

      <div
        style={{
          border: "1px solid #0070f3",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>🤖 Data from Hono Worker</h2>
        {data ? (
          <>
            <p>
              <strong>Title:</strong> {data.title}
            </p>
            <p>
              <strong>Fetched At (Worker Time):</strong> {data.fetchedAt}
            </p>
          </>
        ) : (
          <p style={{ color: "red" }}>Failed to fetch from Worker</p>
        )}
      </div>

      <div style={{ border: "1px solid #666", padding: "20px" }}>
        <h2>📄 Next.js Page Render</h2>
        <p>
          <strong>Rendered At:</strong> {renderedAt}
        </p>
      </div>

      <p style={{ margin: "20px" }}>
        ※ fetch先は「Honoで構成されたNotionAPI」仕様
        <br />
        ※ Next.js側の fetch キャッシュ
        <br />
      </p>

      <div style={{ margin: "20px" }}>
        <p>
          npm run dev：リロードでRendered
          Atのみ時間は更新され、指定API「http://localhost:3000/api/fetcher」実行でFetched
          Atも更新される（SSR+ISR）
        </p>
        <p>
          npm run
          start：指定API「http://localhost:3000/api/fetcher」実行で時間は更新される（ISR）
        </p>
        <p>
          npm run
          preview：指定API「http://localhost:8787/api/fetcher」実行で時間は更新される（ISR）
        </p>
        <p>
          npm run
          deploy：指定API「https://カスタムドメイン/api/fetcher」実行で時間は更新される（ISR）
        </p>
        <p>
          ※cloudflareで「revalidateTag」「revalidatePath」を利用してCDNキャッシュを削除する場合、カスタムドメインと適切な設定（ゾーンやAPIトークン）が必要みたいです。
        </p>
        <a
          style={{ color: "blue", textDecoration: "underline" }}
          href="https://opennext.js.org/cloudflare/caching#automatic-cache-purge"
          target="_blank"
        >
          詳細は公式に記載されています。
        </a>
      </div>
    </div>
  );
}
