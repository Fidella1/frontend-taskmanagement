import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BoardList from './BoardList';

function BoardManager() {
  // State management
  const [boards, setBoards] = useState([]);
  const [formData, setFormData] = useState({ name: '' });
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load boards from localStorage on component mount
  useEffect(() => {
    const savedBoards = localStorage.getItem('taskBoards');
    if (savedBoards) {
      try {
        setBoards(JSON.parse(savedBoards));
      } catch (err) {
        console.error("Error loading boards:", err);
        setError("Failed to load saved boards.");
      }
    }
  }, []);

  // Save boards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('taskBoards', JSON.stringify(boards));
  }, [boards]);

  // Form handlers
  const handleInputChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return; // Don't submit empty names
    }

    if (editingBoardId) {
      // Update existing board
      setBoards(boards.map(board => 
        board.id === editingBoardId 
          ? { ...board, name: formData.name } 
          : board
      ));
      setEditingBoardId(null); // Exit edit mode
    } else {
      // Create new board
      const newBoard = {
        id: Date.now().toString(), // Simple unique ID
        name: formData.name,
        tasks: [],
        createdAt: new Date().toISOString()
      };
      setBoards([...boards, newBoard]);
    }

    // Reset form
    setFormData({ name: '' });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingBoardId(null);
    setFormData({ name: '' });
  };

  // Edit board handler
  const handleEditBoard = (board) => {
    setEditingBoardId(board.id);
    setFormData({ name: board.name });
    
    // Focus the input
    document.querySelector('input[name="boardName"]')?.focus();
  };

  // Delete board handler
  const handleDeleteBoard = (boardId) => {
    setBoards(boards.filter(board => board.id !== boardId));
    
    // If we're editing this board, cancel the edit
    if (editingBoardId === boardId) {
      handleCancelEdit();
    }
  };

  return (
    <div className="board-manager">
      <h1>Task Manager Boards</h1>

      {/* Board creation/editing form */}
      <div className="board-form-container">
        <h2>{editingBoardId ? 'Edit Board' : 'Create New Board'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="boardName">Board Name:</label>
            <input
              type="text"
              id="boardName"
              name="boardName"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter board name..."
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingBoardId ? 'Update Board' : 'Create Board'}
            </button>
            
            {editingBoardId && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Board list */}
      <BoardList
        boards={boards}
        isLoading={isLoading}
        error={error}
        onDelete={handleDeleteBoard}
        onEdit={handleEditBoard}
      />
    </div>
  );
}

export default BoardManager;