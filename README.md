# salon-review-tool

美容サロン向けの口コミ返信サポートツールです。HotPepper Beauty の口コミを自動収集し、Claude API で返信文の下書きを生成、ブラウザ上で確認できます。

## 概要

サロン運営者が抱える「口コミへの返信が追いつかない」「毎回文面を考えるのが大変」という課題を解決するために作成しました。Selenium で口コミを収集し、Anthropic Claude API に渡して、サロンのトーンに合わせた返信案を自動生成します。

> **注意:** 本ツールは返信文を**自動投稿するものではありません**。HotPepper Beauty の利用規約に配慮し、生成した返信案はあくまで下書きとして確認・編集する運用を想定しています。

## 主な機能

- HotPepper Beauty の指定サロンページから口コミを収集(Selenium)
- 収集した口コミを Claude API に渡して返信文の下書きを生成
- Flask バックエンド + React/Tailwind フロントエンドで一覧表示
- 口コミ本文とAI生成の返信案を並べて確認可能

## 使用技術

| 領域 | 技術 |
|------|------|
| スクレイピング | Python, Selenium |
| AI 返信生成 | Anthropic Claude API (`anthropic` パッケージ) |
| バックエンド | Flask |
| フロントエンド | React, Tailwind CSS |
| 環境変数管理 | python-dotenv |

## ディレクトリ構成

```
salon-review-tool/
├── backend/
│   ├── app.py              # Flask エントリーポイント
│   ├── scraper.py          # Selenium スクレイパー
│   ├── ai_reply.py         # Claude API 呼び出し
│   └── requirements.txt
├── frontend/
│   ├── src/
│   └── package.json
├── .env.example
└── README.md
```

## セットアップ

### 前提

- Python 3.10 以上
- Node.js 18 以上
- Google Chrome(Selenium 用)
- Anthropic API キー

### バックエンド

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

`.env` ファイルを作成し、API キーを設定します。

```
ANTHROPIC_API_KEY=your_api_key_here
```

起動:

```bash
python app.py
```

### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

## 使い方

1. バックエンドとフロントエンドを起動
2. ブラウザで `http://localhost:5173`(など)にアクセス
3. 対象サロンのURLを入力して口コミを取得
4. 各口コミに対して生成された返信案を確認
5. 必要に応じて編集し、実際の返信時の参考にする

## 工夫したポイント

- **プロンプト設計**: サロンのトーン(丁寧・親しみやすい)を指定できるよう、プロンプトに変数を持たせた
- **エラーハンドリング**: スクレイピング時の要素取得失敗や API エラーを個別に処理し、1件の失敗で全体が止まらないようにした
- **責任ある設計**: 自動投稿機能はあえて実装せず、あくまで人間の確認を前提とした下書き生成ツールとして設計

## 今後の拡張予定

- Google マップの口コミ対応
- 複数店舗の一括管理
- 返信トーンのカスタマイズUI
- CSV エクスポート機能

## ライセンス

個人ポートフォリオ用途。商用利用時は HotPepper Beauty の利用規約を確認してください。

## 作者

和史 — Python 開発者(フリーランス活動中)
