# Next.js Framework Starter での SSG・SSR・ISR 確認

以下はローカルクローンして確認する手順になります。

## パッケージのインストール（npm の場合）

```
cd <クローンしたプロジェクト名>

rm -rf node_modules .open-next .next .wrangler package-lock.json next-env.d.ts # ある場合削除
npm cache clean --force　# npmのキャッシュをクリア

npm install # rclone.jsのエラーになる場合以下のオプションをつけて実行
npm install --ignore-scripts
```

## preview（ローカル）で ISR・SSG・SSR の表示を確認

```
npm run preview
```

ビルド完了後、ターミナルに URL（ポート番号）が表示されるので、それをブラウザで確認します。

- http://localhost:xxxx/ssg → 　リロードしても時間が変更されないか確認
- http://localhost:xxxx/ssr → 　リロードするごとに時間が変更されるか確認
- http://localhost:xxxx/isr → 　 10 秒ごとリロードして時間が変更されるか確認（10 秒未満の場合は変更されないこと）

## 本番にデプロイする場合

こちらの記事を参考してください
XXXX
