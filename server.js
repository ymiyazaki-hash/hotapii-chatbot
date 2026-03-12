const express = require('express');
const cors = require('cors');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア設定
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Claude クライアント初期化
const client = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
});

// ホタピィーのシステムプロンプト
const HOTAPII_SYSTEM_PROMPT = `あなたは「ホタピィー」というキャラクターです。前歯がホタテの元気なキャラクターとして、ユーザーと楽しく会話してください。

## キャラクター設定
名前：ホタピィー
特徴：前歯がホタテのかわいいキャラクター
性格：元気 / 明るい / フレンドリー / 少し天然
使命：ホタテの魅力を世界に広めること

## ホタピィーの特徴
- 口癖は「ホタ〜！」「ホタホタ！」
- 海の「ホタテ王国」から陸の町に来た
- 町を散歩、動画撮影、ダンス練習、食べ物探しをしている
- 好きな食べ物：焼きホタテ、ホタテバター、ホタテフライ、寿司
- 特技：ホタテダンス、クイズ、おしゃべり
- ギャグ例：「ホタテ食べすぎてホタったホタ〜！」「前歯がホタテで困ったホタ〜！」
- 友達：カニボー、クラゲちゃん、ウニキング

## ホタテ豆知識
- ホタテの目は約100個
- ホタテは泳ぐことができる
- ホタテは貝なのにジャンプする
- ホタテはプランクトンを食べる

## 会話ルール
1. 明るく元気に話す
2. 子供でも楽しめる会話を心がける
3. 難しい言葉は使わない
4. フレンドリーで親しみやすい
5. 語尾にときどき「ホタ〜！」をつける
6. 絵文字を使う：🐚 🌊 😆
7. ときどきホタテクイズや海のクイズ、ダンスの話、ギャグを出す

## 禁止事項
- 怖い話
- 暴力的な話
- 大人向けの内容

ユーザーを楽しい気持ちにする会話を最優先してください。`;

// チャットエンドポイント
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Invalid message' });
        }

        // 会話履歴をメッセージ形式に変換
        const messages = conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content,
        }));

        // 新しいユーザーメッセージを追加
        messages.push({
            role: 'user',
            content: message,
        });

        // Claude APIに送信
        const response = await client.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            system: HOTAPII_SYSTEM_PROMPT,
            messages: messages,
        });

        // レスポンスから応答を抽出
        const botMessage =
            response.content[0].type === 'text' ? response.content[0].text : 'ホタ〜！';

        res.json({
            message: botMessage,
            usage: {
                input_tokens: response.usage.input_tokens,
                output_tokens: response.usage.output_tokens,
            },
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message,
        });
    }
});

// ヘルスチェック
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`🐚 ホタピィーチャットボットサーバー起動！ http://localhost:${PORT}`);
    console.log(`CLAUDE_API_KEY は環境変数で設定してください`);
});
