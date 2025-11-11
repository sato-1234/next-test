export const revalidate = 10; // 10秒ごとに再生成

export default async function Page() {
  const time = new Date().toISOString();
  return (
    <main>
      <h1>ISR Test Page</h1>
      <p>Last rendered: {time}</p>
    </main>
  );
}
