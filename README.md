# ハックデイ 2025/02/01 プロジェクト

## プロジェクトの概要
このプロジェクトは、ユーザーの移動記録を管理し、移動距離に応じてETHを報酬として獲得できるWeb3アプリケーションです。

### 主な機能
- 移動記録の登録と管理
- 移動履歴の表示
- MetaMask連携によるウォレット接続
- 移動距離に応じたETH報酬の獲得

## プロジェクト構成

### フロントエンド (`frontend/`)
- `src/app/` - Next.js 13のApp Routerを使用したページコンポーネント
  - `page.tsx` - トップページ
  - `record/page.tsx` - 移動記録登録ページ
  - `history/page.tsx` - 移動履歴表示ページ
- `src/components/` - 再利用可能なUIコンポーネント
- `src/lib/` - ユーティリティ関数
- `src/types/` - TypeScript型定義

### バックエンド (`backend/`)
- `src/` - サーバーサイドのソースコード
  - `index.ts` - メインサーバーファイル
  - `db.ts` - データベース接続と操作
  - `utils/` - ユーティリティ関数

## 技術スタック

### フロントエンド
- Next.js 13 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui (UIコンポーネントライブラリ)
- ethers.js (Ethereum接続)

### バックエンド
- Node.js
- Express
- TypeScript
- PostgreSQL

### ブロックチェーン連携
- MetaMask
- Ethereum Smart Contract (移動記録と報酬管理)

## 開発環境のセットアップ

### 必要条件
- Node.js v18.19.1以上
- npm 9.2.0以上
- Docker (PostgreSQL用)
- MetaMask

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

### データベース
```bash
docker-compose up -d
```
PostgreSQLが起動します(ポート5433:5432)

### フロントエンド
```bash
cd frontend
npm run dev
```
http://localhost:3000 でアクセス可能

### バックエンド
```bash
cd backend
npm run dev
```
http://localhost:3003 でAPIサーバーが起動

## 環境変数の設定

### フロントエンド (.env)
```
NEXT_PUBLIC_CONTRACT_ADDRESS=<スマートコントラクトのアドレス>
```

### バックエンド (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5433/dbname
```

## 最新の技術的更新

### 2025/02/01
- 移動履歴の日時表示を日本標準時(JST)に対応
  - `toLocaleString`メソッドと`timeZone: 'Asia/Tokyo'`オプションを使用
  - すべての日時表示で一貫したタイムゾーン処理を実装

## 注意事項
- MetaMaskのインストールと設定が必要です
- スマートコントラクトのデプロイと設定が必要です
- 開発環境では適切なテストネットワークを使用してください

## コントリビューション
1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス
このプロジェクトはMITライセンスの下で公開されています。
