import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Components/movieindex.scss";
import MovieApp from "./Components/MovieApp";
import MoviePage from "./Components/MoviePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MovieApp />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/search-movies" element={<MovieApp />} />
      </Routes>
    </Router>
  );
}

export default App; // Add this line to export App as default