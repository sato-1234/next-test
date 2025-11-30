export const dynamic = "force-static"; // 明示的にSSGを指定（build時に生成）

export default async function Page() {
  return (
    <main>
      <h1 style={{ margin: "20px" }}>SSG・SSR・ISR 表示確認</h1>
      <ul style={{ margin: "20px" }}>
        <li>
          <a style={{ lineHeight: "20px", color: "blue" }} href="/ssg">
            SSG確認
          </a>
        </li>
        <li>
          <a style={{ lineHeight: "20px", color: "blue" }} href="/ssr">
            SSR確認
          </a>
        </li>
        <li>
          <a style={{ lineHeight: "20px", color: "blue" }} href="/isr">
            ISR確認（revalidate）
          </a>
        </li>
        <li>
          <a style={{ lineHeight: "20px", color: "blue" }} href="/isr-f">
            ISR確認（fetch、revalidateTag、revalidatePath）
          </a>
        </li>
        <li>
          <a style={{ lineHeight: "20px", color: "blue" }} href="/isr-u">
            ISR確認（unstable_cache、revalidateTag、revalidatePath）
          </a>
        </li>
      </ul>
    </main>
  );
}
