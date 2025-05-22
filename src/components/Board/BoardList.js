import React, { useEffect, useState } from "react";
import api, {
  deleteBoard,
  updateBoard,
  deleteTask,
  updateTask,
} from "../../services/api";
import { useNavigate } from "react-router-dom";

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [tasksByBoard, setTasksByBoard] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoardsAndTasks = async () => {
      try {
        const boardRes = await api.get("/boards");
        setBoards(boardRes.data);

        // Fetch tasks for each board
        const tasksResByBoard = {};
        for (const board of boardRes.data) {
          const taskRes = await api.get(`/tasks/${board._id}`);
          tasksResByBoard[board._id] = taskRes.data;
        }
        setTasksByBoard(tasksResByBoard);
      } catch (err) {
        console.error("Error fetching boards or tasks:", err);
      }
    };

    fetchBoardsAndTasks();
  }, []);

  const handleDeleteBoard = async (id) => {
    if (!window.confirm("Delete this board?")) return;
    try {
      await deleteBoard(id);
      setBoards((prev) => prev.filter((b) => b._id !== id));
      const updatedTasks = { ...tasksByBoard };
      delete updatedTasks[id];
      setTasksByBoard(updatedTasks);
    } catch (err) {
      console.error("Delete board failed:", err);
    }
  };

  const handleEditBoard = async (board) => {
    const newName = prompt("Edit board name", board.name);
    const newDesc = prompt("Edit board description", board.description);
    if (newName === null || newDesc === null) return;

    try {
      const res = await updateBoard(board._id, {
        name: newName,
        description: newDesc,
      });
      setBoards((prev) =>
        prev.map((b) => (b._id === board._id ? res.data : b))
      );
    } catch (err) {
      console.error("Update board failed:", err);
    }
  };

  const handleDeleteTask = async (boardId, taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(taskId);
      setTasksByBoard((prev) => ({
        ...prev,
        [boardId]: prev[boardId].filter((t) => t._id !== taskId),
      }));
    } catch (err) {
      console.error("Delete task failed:", err);
    }
  };

  const handleEditTask = async (boardId, task) => {
    const newTitle = prompt("Edit title", task.title);
    const newDesc = prompt("Edit description", task.description);
    const newStatus = prompt(
      "Edit status (todo, in-progress, done)",
      task.status
    );

    if (!newTitle || !newStatus) return;

    try {
      const res = await updateTask(task._id, {
        title: newTitle,
        description: newDesc,
        status: newStatus,
        boardId,
      });

      setTasksByBoard((prev) => ({
        ...prev,
        [boardId]: prev[boardId].map((t) =>
          t._id === task._id ? res.data : t
        ),
      }));
    } catch (err) {
      console.error("Update task failed:", err);
    }
  };

  return (
    <div>
      <h3 className="heading">All Boards</h3>
      <ul className="board-list">
        {boards.map((board) => (
          <li key={board._id} className="board-item">
            <div
              onClick={() => navigate(`/boards/${board._id}`)}
              style={{ cursor: "pointer" }}
            >
              <strong>{board.name}</strong>: {board.description}
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <button
                className="button-edit-boardd"
                onClick={() => handleEditBoard(board)}
              >
                Edit
              </button>
              <button
                className="button-delete-boardd"
                onClick={() => handleDeleteBoard(board._id)}
              >
                Delete
              </button>
            </div>

            {tasksByBoard[board._id] && (
              <ul className="task-list" style={{ marginTop: "1rem" }}>
                {tasksByBoard[board._id].map((task) => (
                  <li key={task._id} className="task-item">
                    <div className="task-title">{task.title}</div>
                    <div className="task-status">{task.status}</div>
                    <div className="task-desc">{task.description}</div>
                    <button
                      className="button-edit-board"
                      onClick={() => handleEditTask(board._id, task)}
                    >
                      Edit
                    </button>
                    <button
                      className="button-delete-board"
                      onClick={() => handleDeleteTask(board._id, task._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardList;
