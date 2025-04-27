import React, { useState, useEffect, useCallback } from "react";
import MovieCard from "./MovieCard";
import axios from "axios";
import { Waypoint } from "react-waypoint";
import ScrollToTopBtn from "./ScrollToTop";
import { FaTimes } from "react-icons/fa";

export default function SearchMovie() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Debounce the query by 2 seconds
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1); // Reset page when new query starts
      setMovies([]);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Fetch data when debouncedQuery or page changes
  useEffect(() => {
    if (debouncedQuery) {
      fetchMovies();
    }
  }, [debouncedQuery, page]);

  const fetchMovies = useCallback(async () => {
    if (!debouncedQuery) return;
  
    try {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=5dcf7f28a88be0edc01bbbde06f024ab&language=en-US&query=${debouncedQuery}&page=${page}&include_adult=false`;
      const { data: { results = [], total_results } } = await axios.get(url);
  
      setMovies((prevMovies) => {
        const updatedMovies = [...prevMovies, ...results];
        setHasNextPage(results.length > 0 && updatedMovies.length < total_results);
        return updatedMovies;
      });
  
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    }
  }, [debouncedQuery, page]);
  

  const loadMore = () => {
    if (hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const clearQuery = () => {
    setQuery("");
    setPage(1);  
    setMovies([]);
    setHasNextPage(false);
  };

  return (
    <div>
     <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="input-wrapper ">
          <input
            className="input"
            type="text" // <-- changed "input" to "text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            name="query"
            placeholder="i.e. Pitch Perfect"
          />
          {query && (
            <button 
              className="clear-btn"
              onClick={clearQuery}
            >
              <FaTimes />
            </button>
          )}
        </div>
      </form>

      <div className="moviescontainer">
        {movies
          .filter((movie) => movie.poster_path)
          .map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
      </div>

      {hasNextPage && (
        <Waypoint onEnter={loadMore}>
          <h1 style={{ textAlign: "center", color: "#fff" }}>Loading...</h1>
        </Waypoint>
      )}

      <ScrollToTopBtn />
    </div>
  );
}
