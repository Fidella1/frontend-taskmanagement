import React from 'react';
import { useNavigate } from 'react-router-dom';

const BoardItem = ({ board, onDelete, onEdit }) => {
  const navigate = useNavigate();

  const handleOpenBoard = () => {
    navigate(`/board/${board.id}`);
  };

  return (
    <div className="board-card">
      <div className="board-content">
        <h3 className="board-title">{board.name}</h3>
        {board.description && (
          <p className="board-description">{board.description}</p>
        )}
        <div className="board-meta">
          <span className="board-tasks">
            {board.tasks?.length || 0} task{board.tasks?.length === 1 ? '' : 's'}
          </span>
          <span className="board-date">
            Created: {new Date(board.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="board-actions">
        <button
          className="btn btn-primary"
          onClick={handleOpenBoard}
        >
          Open Board
        </button>
        {onEdit && (
          <button
            className="btn btn-secondary"
            onClick={() => onEdit(board)}
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete board "${board.name}"?`)) {
                onDelete(board.id);
              }
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default BoardItem;