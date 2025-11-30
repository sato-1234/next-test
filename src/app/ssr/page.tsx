export const dynamic = "force-dynamic"; // 毎回リクエスト時に生成

export default async function Page() {
  const time = new Date().toISOString();
  return (
    <main>
      <h1>SSR Test Page</h1>
      <p>{time}</p>
      <p>npm run dev：リロードで時間は更新される（SSR）</p>
      <p>npm run start：リロードで時間は更新される（SSR）</p>
      <p>npm run preview：リロードで時間は更新される（SSR）</p>
      <p>npm run deploy：リロードで時間は更新される（SSR）</p>
    </main>
  );
}
