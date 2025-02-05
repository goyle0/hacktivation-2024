import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'movement_db',
    password: 'postgres',
    port: 5433,
});

export const initDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS movements (
                id SERIAL PRIMARY KEY,
                origin TEXT NOT NULL,
                destination TEXT NOT NULL,
                distance TEXT NOT NULL,
                duration TEXT NOT NULL,
                travel_mode TEXT NOT NULL DEFAULT 'DRIVING',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                verified BOOLEAN DEFAULT FALSE,
                pending_approval BOOLEAN DEFAULT FALSE,
                tx_hash TEXT,
                wallet_address TEXT
            );

            -- 既存のテーブルに新しいカラムを追加（エラーを無視）
            DO $$
            BEGIN
                BEGIN
                    ALTER TABLE movements ADD COLUMN verified BOOLEAN DEFAULT FALSE;
                EXCEPTION
                    WHEN duplicate_column THEN
                        NULL;
                END;

                BEGIN
                    ALTER TABLE movements ADD COLUMN pending_approval BOOLEAN DEFAULT FALSE;
                EXCEPTION
                    WHEN duplicate_column THEN
                        NULL;
                END;

                BEGIN
                    ALTER TABLE movements ADD COLUMN tx_hash TEXT;
                EXCEPTION
                    WHEN duplicate_column THEN
                        NULL;
                END;

                BEGIN
                    ALTER TABLE movements ADD COLUMN wallet_address TEXT;
                EXCEPTION
                    WHEN duplicate_column THEN
                        NULL;
                END;
            END $$;
        `);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
};

export default pool;
