#!/usr/bin/env node

/**
 * wrangler.jsonc.templateからwrangler.jsoncを生成するスクリプト
 * 環境変数（process.env）から値を読み込んでwrangler.jsoncを生成します
 */

const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'wrangler.jsonc.template');
const outputPath = path.join(__dirname, '..', 'wrangler.jsonc');

// 環境変数のマッピング
// Cloudflareビルド環境（本番）: ダッシュボードのEnvironment Variablesから設定
// 本番環境では R2_BUCKET_NAME と D1_DATABASE_NAME と D1_DATABASE_ID のみ設定すればOK
// プレビュー環境は Cloudflare が自動的に preview_bucket_name と preview_database_id を使用
const envVars = {
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME || '',
  D1_DATABASE_NAME: process.env.D1_DATABASE_NAME || '',
  D1_DATABASE_ID: process.env.D1_DATABASE_ID || '',
};

// 本番環境用の必須環境変数のチェック
// プレビュー環境用は Cloudflare が自動的に別リソースを使用するため、必須ではない
const missingVars = [];
if (!envVars.R2_BUCKET_NAME) {
  missingVars.push('R2_BUCKET_NAME');
}
if (!envVars.D1_DATABASE_NAME) {
  missingVars.push('D1_DATABASE_NAME');
}
if (!envVars.D1_DATABASE_ID) {
  missingVars.push('D1_DATABASE_ID');
}

if (missingVars.length > 0) {
  console.error(`❌ 以下の環境変数が設定されていません: ${missingVars.join(', ')}`);
  console.error('   Cloudflare: ダッシュボードのEnvironment Variablesに設定してください');
  process.exit(1);
}

// テンプレートファイルを読み込む
let template = fs.readFileSync(templatePath, 'utf8');

// 環境変数を置き換える
Object.entries(envVars).forEach(([key, value]) => {
  const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
  template = template.replace(regex, value);
});

// 未設定の環境変数フィールドを削除（本番環境でプレビュー環境用の環境変数が未設定の場合）
// "preview_bucket_name": "${*}" または "preview_bucket_name": "" のパターンにマッチ
template = template.replace(/"preview_bucket_name":\s*"(\$\{[^}]+\}|)"\s*,?\s*\n\s*/g, '');
template = template.replace(/"preview_database_id":\s*"(\$\{[^}]+\}|)"\s*,?\s*\n\s*/g, '');

// 出力ファイルに書き込む
fs.writeFileSync(outputPath, template, 'utf8');

console.log('✅ wrangler.jsonc generated successfully');


