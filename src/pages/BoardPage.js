import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { deleteTask, updateTask, updateBoard } from "../services/api";
import TaskForm from "../components/Board/TaskForm";

const BoardPage = () => {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await api.get(`/boards/${id}`);
        setBoard(res.data);
      } catch (err) {
        console.error("Error fetching board:", err);
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchBoard();
    fetchTasks();
  }, [id]);

  const handleNewTask = (task) => {
    setTasks((prev) => [...prev, task]);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleEditTask = async (task) => {
    const newTitle = prompt("Edit title:", task.title);
    const newDesc = prompt("Edit description:", task.description);
    const newStatus = prompt("Edit status (todo, in-progress, done):", task.status);

    if (!newTitle || !newStatus) return;

    try {
      const res = await updateTask(task._id, {
        title: newTitle,
        description: newDesc,
        status: newStatus,
        boardId: id, // maintain board link
      });

      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? res.data : t))
      );
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleEditBoard = async () => {
    const newName = prompt("Edit board name:", board.name);
    const newDesc = prompt("Edit board description:", board.description);

    if (!newName) return;

    try {
      const res = await updateBoard(id, {
        name: newName,
        description: newDesc,
      });
      setBoard(res.data);
    } catch (err) {
      console.error("Failed to update board:", err);
    }
  };

  return (
    <div className="app">
      <h2 className="heading">Board: {board?.name}</h2>
      <p className="task-desc">{board?.description}</p>

      <button className="button-edit" onClick={handleEditBoard}>
        Edit Board
      </button>

      <TaskForm boardId={id} onTaskCreated={handleNewTask} />

      <h3 className="subheading">Tasks</h3>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            <div className="task-title">{task.title}</div>
            <div className="task-status">{task.status}</div>
            <div className="task-desc">{task.description}</div>

            <button
              className="button-edit-board"
              onClick={() => handleEditTask(task)}
            >
              Edit
            </button>
            <button
              className="button-delete-board"
              onClick={() => handleDeleteTask(task._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardPage;
