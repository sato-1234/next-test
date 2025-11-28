// src/app/sample/page.tsx
import { getSampleData } from "@/lib/sample";

export default async function SamplePage() {
  const data = await getSampleData();
  const renderedAt = new Date().toISOString();

  return (
    <div style={{ padding: "40px", fontFamily: "monospace" }}>
      <h1>SSG + ISR Test</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h3>📦 Cached Data (Notion)</h3>
        <p>
          <strong>Data Fetched At:</strong> {data.fetchedAt}
        </p>
        <p>Title: {data.title}</p>
      </div>

      <div style={{ border: "1px solid #666", padding: "20px" }}>
        <h3>📄 Page Render</h3>
        <p>
          <strong>HTML Generated At:</strong> {renderedAt}
        </p>
      </div>

      <p>※ ビルド後にリロードしても時間は変わらないはずです（SSG）。</p>
      <p>※ APIを叩いた後のリロードで、両方の時間が更新されれば成功です。</p>
    </div>
  );
}
