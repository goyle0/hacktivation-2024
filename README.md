# ハックデイ 2025/02/01 プロジェクト

## プロジェクト構成

- `frontend/` - フロントエンドアプリケーション
- `backend/` - バックエンドサーバー

## 開発環境のセットアップ

### 必要条件
- Node.js v18.19.1以上
- npm 9.2.0以上

### インストール手順

1. リポジトリのクローン:
```bash
git clone [repository-url]
```

2. フロントエンドのセットアップ:
```bash
cd frontend
npm install
```

3. バックエンドのセットアップ:
```bash
cd backend
npm install
```

## 開発サーバーの起動

### フロントエンド
```bash
cd frontend
npm run dev
```

### バックエンド
```bash
cd backend
npm run dev
```

### 追加情報

#### 技術スタック
- フロントエンド: Next.js (React + TypeScript), Tailwind CSS
- バックエンド: Node.js (TypeScript)
- データベース: PostgreSQL (Docker Composeで起動)

#### Dockerについて
Docker Composeを使用することで簡単にデータベース(PostgreSQL)を起動できます。以下のコマンドでコンテナを立ち上げてください:
```bash
docker-compose up -d
```
デフォルトではホスト側のポート5433がコンテナ内の5432にマッピングされています。

#### その他
- フロントエンドはポート3000、バックエンドはポート3001などを使用している場合があります。環境によってポート設定や環境変数が異なる場合は、`.env` などで適宜設定してください。
- 誤りや不足があれば随時修正・追記をお願いします。
