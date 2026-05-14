import redisClient from "../../config/redis.js";

// Import your newly created database service infrastructure
import { fetchGlobalTasksFeed } from "../../services/task/getTaskService.js";

export const getTask = async (req, res, next) => {
  const user_id = req.user?.id;
  const cacheKey = `tasks_feed:${user_id || 'guest'}`;

  try {
    // 1. Cache Check Pipeline
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("⚡ Redis Hit: Serving feed from cache");
      return res.json(JSON.parse(cachedData));
    }

    console.log("🐢 Redis Miss: Fetching from Postgres");
    
    // 2. Execution Layer: Delegate database work to our service function
    const tasksFeed = await fetchGlobalTasksFeed(user_id);

    const responseData = { tasks: tasksFeed, currentUserId: user_id };

    // 3. Cache Storage Pipeline
    await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 600 });
    
    return res.json(responseData);
  } catch (err) {
    next(err);
  }
};
