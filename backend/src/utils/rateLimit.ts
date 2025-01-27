import { Request, Response, NextFunction } from 'express';

interface TokenBucket {
    tokens: number;
    lastRefill: number;
    capacity: number;
    refillRate: number;
}

interface RetryConfig {
    attempt: number;
    maxAttempts: number;
    baseDelay: number;
    maxDelay: number;
}

const buckets = new Map<string, TokenBucket>();

export class RateLimiter {
    private readonly defaultCapacity: number;
    private readonly refillRate: number;  // トークンが補充される速度（トークン/秒）
    private readonly maxRequestBuffer: number;

    constructor(capacity: number = 100, refillRate: number = 10) {
        this.defaultCapacity = capacity;
        this.refillRate = refillRate;
        this.maxRequestBuffer = 100;
    }

    private getTokenBucket(key: string): TokenBucket {
        if (!buckets.has(key)) {
            buckets.set(key, {
                tokens: this.defaultCapacity,
                lastRefill: Date.now(),
                capacity: this.defaultCapacity,
                refillRate: this.refillRate
            });
        }
        return buckets.get(key)!;
    }

    private refillTokens(bucket: TokenBucket): void {
        const now = Date.now();
        const timePassed = (now - bucket.lastRefill) / 1000; // 秒単位
        const refillAmount = timePassed * bucket.refillRate;

        bucket.tokens = Math.min(bucket.capacity, bucket.tokens + refillAmount);
        bucket.lastRefill = now;
    }

    private async exponentialBackoff(config: RetryConfig): Promise<void> {
        if (config.attempt >= config.maxAttempts) {
            throw new Error('最大再試行回数を超えました');
        }

        const delay = Math.min(
            config.baseDelay * Math.pow(2, config.attempt),
            config.maxDelay
        );

        await new Promise(resolve => setTimeout(resolve, delay));
    }

    middleware(keyExtractor: (req: Request) => string = req => req.ip) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const key = keyExtractor(req);
            const bucket = this.getTokenBucket(key);

            this.refillTokens(bucket);

            if (bucket.tokens >= 1) {
                bucket.tokens -= 1;

                // レート制限情報をヘッダーに追加
                res.setHeader('X-RateLimit-Limit', bucket.capacity.toString());
                res.setHeader('X-RateLimit-Remaining', Math.floor(bucket.tokens).toString());
                res.setHeader('X-RateLimit-Reset', (bucket.lastRefill + 1000).toString());

                next();
            } else {
                const retryConfig: RetryConfig = {
                    attempt: 0,
                    maxAttempts: 10,
                    baseDelay: 1000,  // 1秒から開始
                    maxDelay: 1200000 // 最大20分
                };

                try {
                    while (bucket.tokens < 1 && retryConfig.attempt < retryConfig.maxAttempts) {
                        await this.exponentialBackoff(retryConfig);
                        this.refillTokens(bucket);
                        retryConfig.attempt++;
                    }

                    if (bucket.tokens >= 1) {
                        bucket.tokens -= 1;
                        next();
                    } else {
                        res.status(429).json({
                            error: 'レート制限を超えました',
                            retryAfter: Math.ceil((1 - bucket.tokens) / bucket.refillRate)
                        });
                    }
                } catch (error) {
                    res.status(429).json({
                        error: 'レート制限を超えました',
                        retryAfter: Math.ceil((1 - bucket.tokens) / bucket.refillRate)
                    });
                }
            }
        };
    }

    async executeBatch<T>(
        requests: (() => Promise<T>)[],
        keyExtractor: () => string
    ): Promise<T[]> {
        const key = keyExtractor();
        const bucket = this.getTokenBucket(key);
        const results: T[] = [];
        const bufferedRequests = requests.slice(0, this.maxRequestBuffer);

        for (const request of bufferedRequests) {
            this.refillTokens(bucket);

            const retryConfig: RetryConfig = {
                attempt: 0,
                maxAttempts: 10,
                baseDelay: 1000,
                maxDelay: 1200000
            };

            while (bucket.tokens < 1 && retryConfig.attempt < retryConfig.maxAttempts) {
                await this.exponentialBackoff(retryConfig);
                this.refillTokens(bucket);
                retryConfig.attempt++;
            }

            if (bucket.tokens >= 1) {
                bucket.tokens -= 1;
                try {
                    const result = await request();
                    results.push(result);
                } catch (error) {
                    throw error;
                }
            } else {
                throw new Error('レート制限を超えました');
            }
        }

        return results;
    }
}

export const rateLimiter = new RateLimiter();
