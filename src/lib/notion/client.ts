import { Client } from "@notionhq/client";

// 環境変数の検証
if (!process.env.NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY が設定されていません");
}

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error("NOTION_DATABASE_ID が設定されていません");
}

// Notion API v2025-09-03 以降はデータソース ID が必要
if (!process.env.NOTION_DATA_SOURCE_ID) {
  console.warn(
    "⚠️  NOTION_DATA_SOURCE_ID が設定されていません。\n" +
      "   Notion API v2025-09-03 以降では必須です。\n" +
      "   取得方法: npm run get-datasource-id を実行してください"
  );
}

// Notion APIクライアントの初期化
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// データベースID（後方互換性のため保持）
export const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// データソース ID（API v2025-09-03 以降で使用）
export const DATA_SOURCE_ID =
  process.env.NOTION_DATA_SOURCE_ID || process.env.NOTION_DATABASE_ID;
