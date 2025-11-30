// src/app/sample/page.tsx
import { getSampleData } from "@/lib/unstable";

export default async function SamplePage() {
  const data = await getSampleData();
  const renderedAt = new Date().toISOString();

  return (
    <div style={{ padding: "40px", fontFamily: "monospace" }}>
      <h1>unstable_cache ISR Test</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>📦 Cached Data (Notion)</h2>
        <p>Title: {data.title}</p>
        <p>
          <strong>Data Fetched At:</strong> {data.fetchedAt}
        </p>
      </div>

      <div style={{ border: "1px solid #666", padding: "20px" }}>
        <h2>📄 Page Render</h2>
        <p>
          <strong>HTML Generated At:</strong> {renderedAt}
        </p>
      </div>

      <p style={{ margin: "20px" }}>
        ※ Next.js内でAPIを実装してデータを取得
        <br />
        ※ Next.js内の unstable_cacheで キャッシュ
        <br />
      </p>

      <div style={{ margin: "20px" }}>
        <p>
          npm run dev：リロードでRendered
          Atのみ時間は更新され、指定API「http://localhost:3000/api/unstable」実行でFetched
          Atも更新される（SSR+ISR）
        </p>
        <p>
          npm run
          start：指定API「http://localhost:3000/api/unstable」実行で時間は更新される（ISR）
        </p>
        <p style={{ color: "red" }}>
          npm run
          preview：指定API「http://localhost:8787/api/unstable」実行で時間は更新されない。
        </p>
        <p>
          npm run
          deploy：指定API「https://カスタムドメイン/api/unstable」実行で時間は更新される（ISR）
        </p>
        <p>
          ※cloudflareで「revalidateTag」「revalidatePath」を利用してキャッシュを削除する場合、カスタムドメインと適切な設定が必要みたいです。
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
