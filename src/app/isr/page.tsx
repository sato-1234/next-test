export const revalidate = 10; // 10秒ごとに再生成

export default async function Page() {
  const time = new Date().toISOString();
  return (
    <main>
      <h1>ISR Test Page</h1>
      <p>Last rendered: {time}</p>
      <p>npm run dev：リロードで時間は更新される（SSR）</p>
      <p>npm run start：指定時間後のリロードで時間は更新される（ISR）</p>
      <p>npm run preview：指定時間後のリロードで時間は更新される（ISR）</p>
      <p>npm run deploy：指定時間後のリロードで時間は更新される（ISR）</p>
    </main>
  );
}
