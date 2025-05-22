import React, { useState } from "react";
import api from "../../services/api";

const BoardForm = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/boards", { name, description });
      onCreate(res.data);
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Error creating board", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <span className="form-title">Create Board</span>
      <input
        className="input"
        type="text"
        placeholder="Board Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="input"
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit" className="button">
        Add Board
      </button>
    </form>
  );
};

export default BoardForm;
