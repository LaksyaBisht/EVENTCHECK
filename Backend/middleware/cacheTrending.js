import { client } from '../lib/redis.js';

export const cacheTrending = async (req, res, next) => {
    try {
        const cacheKey = 'trendingEvents';
        const cachedData = await client.get(cacheKey);

        if (cachedData) {
            console.log('Cache hit for trending events');
            return res.status(200).json({ success: true, trendingEvents: JSON.parse(cachedData) });
        }
        else {
            console.log('Cache miss');
            next();
        }
    } catch (err) {
        console.err('Redis cache error:', err);
        next();
    }
};