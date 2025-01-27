import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { rateLimiter } from "./utils/rateLimit";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// ミドルウェアの設定
app.use(helmet());
app.use(cors());
app.use(express.json());

// レート制限の適用
// デフォルトでIPアドレスベースの制限を適用
app.use(rateLimiter.middleware());

// バッチリクエスト用のエンドポイント例
app.post("/api/batch", async (req, res) => {
    try {
        const requests = req.body.requests as (() => Promise<any>)[];
        const results = await rateLimiter.executeBatch(
            requests,
            () => req.ip || "unknown"
        );
        res.json({ results });
    } catch (error) {
        if (error instanceof Error) {
            res.status(429).json({ error: error.message });
        } else {
            res.status(500).json({ error: "不明なエラーが発生しました" });
        }
    }
});

// テスト用エンドポイント
app.get("/api/test", (req, res) => {
    res.json({ message: "レート制限テスト", timestamp: new Date().toISOString() });
});

app.listen(port, () => {
    console.log(`サーバーが起動しました - http://localhost:${port}`);
});
