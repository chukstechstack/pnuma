import TaskInputError from "../../utils/taskInputError.js";

// Import your newly created database query service worker
import { fetchTaskByOwnership } from "../../services/task/fetchEditPageService.js";

export const getEditPage = async (req, res, next) => {
  const uuid = req.params.uuid;
  const userId = req.user.id;

  try {
    // Execution Layer: Fetch the record using the service layer instead of raw queries
    const taskData = await fetchTaskByOwnership(uuid, userId);

    if (!taskData) {
      return next(new TaskInputError("Post not found", 404));
    }

    return res.json(taskData);
  } catch (err) {
    next(err);
  }
};
