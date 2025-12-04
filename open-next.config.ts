import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";
import { purgeCache } from "@opennextjs/cloudflare/overrides/cache-purge/index";

// export default defineCloudflareConfig({
//   incrementalCache: r2IncrementalCache,
// });

/* 
  設定詳細：https://opennext.js.org/cloudflare/caching#automatic-cache-purge

  Cache Purge設定 (Durable Objectを使用 - 安全構成)
  これにより、revalidateTag時にCloudflareのCDNキャッシュ削除リクエストが飛びます

  type: "direct"
  revalidateTag が呼ばれると、即座に Cloudflare API を叩いてCDNキャッシュを消します。
  リスク: もしNotion側で記事を100件一括更新して、APIが100回連続で呼ばれると、Cloudflare APIの制限（レートリミット）に引っかかり、キャッシュ削除が失敗したり、一時的にブロックされたりするリスクがあります。

  type: "durableObject" (今回の設定)
  revalidateTag が呼ばれると、一度 Durable Object という「待機所」にリクエストを送ります。
  待機所は数秒間（デフォルト5秒）リクエストを溜め込み、まとめて1回のAPIコールでキャッシュを消します。
  メリット: どれだけ大量に更新してもAPI制限にかからず、安全に運用できます。

  重要: cachePurgeはカスタムドメイン（zone）でのみ動作します。
  .workers.devドメインでは動作しません。
  また、以下のシークレットが必要です：
  - CACHE_PURGE_API_TOKEN: Cache Purge権限を持つAPIトークン
  - CACHE_PURGE_ZONE_ID: デプロイドメインのゾーンID

  カスタムドメインが設定されていない場合、cachePurgeを無効にしてください。
  この場合、revalidateTagはR2キャッシュとD1タグキャッシュの削除のみを行い、
  Cloudflare CDNキャッシュの削除は行われません。
*/

const config = {
  // 1. R2設定 (Regional Cacheで高速化)
  // withRegionalCacheで、ユーザーに近いCloudflareのエッジサーバー（日本なら東京や大阪のサーバー）のメモリに、R2のデータを一時コピーしてくれます
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    mode: "long-lived",
  }),

  // 2. Queue設定 (ISRの待機列管理)
  queue: doQueue,

  // 3. Tag Cache設定 (D1を使用 - Small Site構成)
  tagCache: d1NextTagCache,

  // 4. ISRページへのアクセスを爆速にする
  // Next.js 14/15 の新機能 PPR (Partial Prerendering) を使う場合のみ、この機能が邪魔になるので falseにする(PPRを使わないならtrue推奨）
  // PPRは「1つのページの中に、静的な部分（SSG）と動的な部分（SSR）を混ぜる技術
  enableCacheInterception: true,

  // カスタムドメインが設定されている場合のみ有効化
  // 環境変数 CACHE_PURGE_ZONE_ID が設定されている場合のみ cachePurge を有効化
  // デバッグ用: directモードでテスト（エラーログが確認しやすい）
  // 本番環境では durableObject モードに戻すことを推奨
  ...(process.env.CACHE_PURGE_ZONE_ID
    ? { cachePurge: purgeCache({ type: "direct" }) }
    : {}),
};

export default defineCloudflareConfig(config);
