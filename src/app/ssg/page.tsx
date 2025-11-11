export const dynamic = "force-static"; // 明示的にSSGを指定（build時に生成）

export default async function Page() {
  const time = new Date().toISOString();
  return (
    <main>
      <h1>SSG Test Page</h1>
      <p>{time}</p>
    </main>
  );
}
