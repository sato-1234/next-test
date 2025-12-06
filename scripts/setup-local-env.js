#!/usr/bin/env node

/**
 * ローカル開発環境用のセットアップスクリプト
 * 1. .envからdev.varsを作成
 * 2. wrangler.jsonc.templateからwrangler.jsoncを作成（.envの環境変数を使用）
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const envPath = path.join(rootDir, '.env');
const devVarsPath = path.join(rootDir, '.dev.vars');
const templatePath = path.join(rootDir, 'wrangler.jsonc.template');
const wranglerConfigPath = path.join(rootDir, 'wrangler.jsonc');

/**
 * .envファイルを読み込んで環境変数のオブジェクトを返す
 */
function loadEnvFile() {
  if (!fs.existsSync(envPath)) {
    console.warn('⚠️  .envファイルが見つかりません。デフォルト値を使用します。');
    return {};
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};

  envContent.split('\n').forEach((line) => {
    // コメント行と空行をスキップ
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return;
    }

    // KEY=VALUE形式をパース
    const match = trimmedLine.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      // クォートを削除
      const unquotedValue = value.replace(/^["']|["']$/g, '');
      envVars[key] = unquotedValue;
    }
  });

  return envVars;
}

/**
 * .envからdev.varsを作成
 */
function generateDevVars(envVars) {
  // .envのすべての環境変数をdev.varsにコピー
  // 空の値は除外
  const devVarsContent = Object.entries(envVars)
    .filter(([_, value]) => value !== '')
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  fs.writeFileSync(devVarsPath, devVarsContent, 'utf8');
  console.log('✅ .dev.vars generated successfully');
}

/**
 * wrangler.jsonc.templateからwrangler.jsoncを生成
 * .envファイルから読み込んだ環境変数で${D1_DATABASE_ID}などを置き換えます
 */
function generateWranglerConfig(envVars) {
  if (!fs.existsSync(templatePath)) {
    console.error('❌ wrangler.jsonc.templateが見つかりません');
    process.exit(1);
  }

  // テンプレートファイルを読み込む
  let template = fs.readFileSync(templatePath, 'utf8');

  // ローカル開発環境では、プレビュー環境用の環境変数のみ使用
  // 本番環境用の環境変数は設定不要（Cloudflare側で設定）
  const requiredVars = {
    R2_PREVIEW_BUCKET_NAME: envVars.R2_PREVIEW_BUCKET_NAME || '', // プレビュー用（ローカルで必須）
    D1_DATABASE_NAME: envVars.D1_DATABASE_NAME || '',
    D1_PREVIEW_DATABASE_ID: envVars.D1_PREVIEW_DATABASE_ID || '', // プレビュー用（ローカルで必須）
  };

  // ローカル開発環境での必須環境変数のチェック
  const missingVars = [];
  if (!envVars.R2_PREVIEW_BUCKET_NAME) {
    missingVars.push('R2_PREVIEW_BUCKET_NAME');
  }
  if (!envVars.D1_DATABASE_NAME) {
    missingVars.push('D1_DATABASE_NAME');
  }
  if (!envVars.D1_PREVIEW_DATABASE_ID) {
    missingVars.push('D1_PREVIEW_DATABASE_ID');
  }

  if (missingVars.length > 0) {
    console.warn(`⚠️  以下の環境変数が設定されていません: ${missingVars.join(', ')}`);
    console.warn('   ローカル開発では、プレビュー環境用の環境変数のみ設定すればOKです');
    console.warn('   デフォルト値（空文字）を使用します。');
  }

  // 環境変数を置き換える
  Object.entries(requiredVars).forEach(([key, value]) => {
    const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
    template = template.replace(regex, value);
  });

  // 未設定の環境変数フィールドを削除（ローカル開発で本番環境用の環境変数が未設定の場合）
  // "bucket_name": "${*}" または "bucket_name": "" のパターンにマッチ
  template = template.replace(/"bucket_name":\s*"(\$\{[^}]+\}|)"\s*,?\s*\n\s*/g, '');
  template = template.replace(/"database_id":\s*"(\$\{[^}]+\}|)"\s*,?\s*\n\s*/g, '');

  // 出力ファイルに書き込む
  fs.writeFileSync(wranglerConfigPath, template, 'utf8');
  console.log('✅ wrangler.jsonc generated successfully');
}

// メイン処理
try {
  console.log('🚀 ローカル環境のセットアップを開始します...\n');

  // .envファイルを読み込む
  const envVars = loadEnvFile();

  // 1. dev.varsを作成
  generateDevVars(envVars);

  // 2. wrangler.jsoncを作成
  generateWranglerConfig(envVars);

  console.log('\n✨ セットアップが完了しました！');
} catch (error) {
  console.error('❌ エラーが発生しました:', error.message);
  process.exit(1);
}

