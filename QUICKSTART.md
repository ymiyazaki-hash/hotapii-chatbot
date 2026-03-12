# 🚀 クイックスタート（5分で始める）

## ステップ1：APIキーを準備

https://console.anthropic.com で Claude APIキーを取得してください

## ステップ2：Node.jsをインストール

https://nodejs.org からダウンロード＆インストール

## ステップ3：セットアップ

```bash
# このフォルダで実行
npm install
```

## ステップ4：環境変数を設定

`.env` ファイルを作成：

```
CLAUDE_API_KEY=sk-ant-あなたのキーをここに貼り付け
PORT=3000
```

## ステップ5：サーバーを起動

```bash
npm start
```

出力：
```
🐚 ホタピィーチャットボットサーバー起動！ http://localhost:3000
```

## ステップ6：ブラウザで開く

http://localhost:3000 を開く

## 完了！🐚

右下の🐚ボタンをクリックしてホタピィーに話しかけてください！

---

## よくある質問

**Q: APIキーはどこで取得するの？**
A: https://console.anthropic.com にログインして、API Keys セクションから取得できます

**Q: "Cannot find module 'express'" と言われた**
A: `npm install` を実行してください

**Q: サーバーが起動しない**
A: ポート3000が他のプログラムで使用中かもしれません
`.env` の `PORT=3001` に変更して試してください

**Q: ホタピィーの返信が遅い**
A: Claude APIのレスポンス待機中です。少し待ってください

---

**ホタ〜！楽しい会話をしようホタ！🐚**
