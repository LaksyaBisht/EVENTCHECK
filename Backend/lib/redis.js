const dotenv = require('dotenv');
dotenv.config();
const redis = require('redis');

const client = redis.createClient({
    socket: {
    host:process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
    }
});

client.on('error', (err) => {
    console.error('Redis Client Error', err)
});

(async () => {
    try {
        await client.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
})();

module.exports = client;