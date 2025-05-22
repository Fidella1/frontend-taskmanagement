import React, { useState } from "react";
import api from "../../services/api";

const TaskForm = ({ boardId, onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/tasks", {
        title,
        description,
        boardId,
      });
      onTaskCreated(res.data);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error creating task", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Create Task</h4>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
