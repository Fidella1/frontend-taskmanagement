import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BoardForm from "./components/Board/BoardForm";
import BoardList from "./components/Board/BoardList";
import BoardPage from "./pages/BoardPage";

function App() {
  return (
    <Router>
      <div className="App">
        <h1 className="heading">Task Manager</h1>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <BoardForm onCreate={() => window.location.reload()} />
                <BoardList />
              </>
            }
          />
          <Route path="/boards/:id" element={<BoardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
