export const dynamic = "force-static"; // 明示的にSSGを指定（build時に生成）

export default async function Page() {
  return (
    <main>
      <h1>SSG・SSR・ISR 確認</h1>
      <ul>
        <li>
          <a href="/ssg">SSG確認</a>
        </li>
        <li>
          <a href="/ssr">SSR確認</a>
        </li>
        <li>
          <a href="/isr">ISR確認</a>
        </li>
      </ul>
    </main>
  );
}
