import TaskInputError from "../../utils/taskInputError.js";

// Import your newly created named database service workers
import { 
  fetchPostIdByUuid, 
  checkExistingLike, 
  removeLikeRecord, 
  createLikeRecord 
} from "../../services/task/toggleLikeService.js";

export const toggleLike = async (req, res, next) => {
  const { uuid } = req.params;
  const user_id = req.user.id;
  
  try {
    // 1. Run UUID text conversion lookup service handler
    const post_id = await fetchPostIdByUuid(uuid);
    if (!post_id) {
      return next(new TaskInputError("Post not found", 404));
    }

    // 2. Run interaction mapping check verification handler
    const hasLiked = await checkExistingLike(post_id, user_id);
    
    if (hasLiked) {
      // 3. Delete matching connection record
      await removeLikeRecord(post_id, user_id);
      return res.json({ liked: false });
    } else {
      // 4. Create new connection record
      await createLikeRecord(post_id, user_id);
      return res.json({ liked: true });
    }
  } catch (err) {
    return next(err);
  }
};
