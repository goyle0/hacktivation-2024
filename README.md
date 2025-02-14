# Route Record DApp

## 概要
Route Record DAppは、ユーザーの移動経路を記録し、ブロックチェーン上に保存するWeb3アプリケーションです。Google Maps APIを利用して経路を可視化し、移動履歴をイーサリアムブロックチェーン上で管理します。

## 主な機能
- 移動経路の記録と表示
- Google Mapsを使用した経路の可視化
- スマートコントラクトによる経路データの永続化
- 移動履歴の閲覧

## 技術スタック
- **フロントエンド**
  - Next.js (App Router)
  - TypeScript
  - Tailwind CSS
- **ブロックチェーン**
  - Solidity
  - Hardhat
  - Ethereum
- **外部サービス**
  - Google Maps API（レート制限実装）

## セットアップ手順

### 前提条件
- Node.js v18.19.1以上
- MetaMaskなどのWeb3ウォレット
- Google Maps APIキー

### インストール

1. リポジトリのクローン
```bash
git clone <repository-url>
cd hacktivation-2024
```

2. 依存関係のインストール
```bash
# スマートコントラクト
npm install

# フロントエンド
cd frontend
npm install
```

3. 環境変数の設定
```bash
# frontend/.env.localファイルを作成
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=あなたのGoogleMapsAPIキー
NEXT_PUBLIC_CONTRACT_ADDRESS=デプロイしたコントラクトのアドレス
```

4. スマートコントラクトのデプロイ
```bash
npx hardhat compile
npx hardhat run scripts/deploy.ts --network <ネットワーク名>
```

5. フロントエンドの起動
```bash
cd frontend
npm run dev
```

## 開発環境
- Node.js v18.19.1
- npm 9.2.0
- pnpm 9.15.4

## プロジェクト構造
```
hacktivation-2024/
├── contracts/           # スマートコントラクト
│   └── RouteRecord.sol
├── frontend/           # フロントエンドアプリケーション
│   ├── src/
│   │   ├── app/       # Next.js ページコンポーネント
│   │   ├── contracts/ # コントラクト型定義
│   │   └── types/     # TypeScript型定義
│   ├── next.config.js
│   └── tailwind.config.js
├── scripts/           # デプロイスクリプト
└── hardhat.config.ts  # Hardhat設定
```

## ライセンス
MIT

## 貢献
プルリクエストやイシューの作成は歓迎します。大きな変更を行う場合は、まずイシューを作成して変更内容を議論してください。
