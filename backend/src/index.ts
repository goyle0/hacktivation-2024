import express from 'express';
import cors from 'cors';
import pool, { initDatabase } from './db';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3003;

// 移動記録を保存するエンドポイント
app.post('/api/routes', async (req, res) => {
    try {
        const { origin, destination, distance, duration } = req.body;

        // 移動手段をWALKINGに固定
        const result = await pool.query(
            'INSERT INTO movements (origin, destination, distance, duration, travel_mode, created_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *',
            [origin, destination, distance, duration || '', 'WALKING']
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error saving movement:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 移動記録を取得するエンドポイント
app.get('/api/routes', async (req, res) => {
    try {
        // 取得時は 'created_at' で並び替えるように変更
        const result = await pool.query(
            'SELECT * FROM movements ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching movements:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const startServer = async () => {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
