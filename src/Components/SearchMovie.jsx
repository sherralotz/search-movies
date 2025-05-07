import React, { useState, useEffect, useCallback } from "react";
import MovieCard from "./MovieCard";
import axios from "axios";
import { Waypoint } from "react-waypoint";
import ScrollToTopBtn from "./ScrollToTop";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { TMDB_API_KEY } from '../config';

export default function SearchMovie() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doneSearching, setDoneSearching] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || ""; 
  const navigate = useNavigate(); 

  useEffect(() => {
    setQuery(initialQuery); 
  }, [initialQuery]);

  // Debounce the query by 1 second
  useEffect(() => {  
    const handler = setTimeout(() => {
      if (query.trim()) {
        setDebouncedQuery(query.trim());
        setPage(1);  
        setMovies([]);   
      }  else{ 
        clearQuery();   
      }
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

    setLoading(true); 
    try {
      const apiKey = TMDB_API_KEY;
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${debouncedQuery}&page=${page}&include_adult=false`;
      const { data: { results = [], total_results } } = await axios.get(url);

      setMovies((prevMovies) => {
        const updatedMovies = [...prevMovies, ...results];
        setHasNextPage(results.length > 0 && updatedMovies.length < total_results);
        setLoading(false); 
        setDoneSearching(true); 
        return updatedMovies;
      });
   
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      setLoading(false); // Stop loading on error
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
    setDoneSearching(false); 
    const newQueryParams = new URLSearchParams(location.search);
    newQueryParams.delete('q');
    navigate(`/?${newQueryParams.toString()}`, { replace: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    setDebouncedQuery(query.trim());
    setPage(1); 
  };

  return ( 
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            className="input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            name="query"
            placeholder="Search Movies..."
          />
          {query && (
            <button
              type="button"
              className="clear-btn"
              onClick={clearQuery}
            >
              <FaTimes />
            </button>
          )}
        </div>
      </form>

      <div className="moviescontainer">
        {movies.filter((movie) => movie.poster_path).map((movie) => (
           <Link  key={movie.id}
           to={{
             pathname: `/movie/${movie.id}`,
             search: `?q=${query}`,
             state: {
               from: location.pathname + (location.search || ''), // Important: Relative path
             },
           }}
           className="card-link">
          <MovieCard movie={movie}  />
          </Link>
        ))}
      </div>

      {loading && !movies.length ? (
        <h1 style={{ textAlign: "center", color: "#fff" }}>Loading...</h1>
      ) : null}

      {doneSearching && query && !loading && !movies.length ? (
        <h1 style={{ textAlign: "center", color: "#fff" }}>No results found</h1>
      ) : null}

      <Waypoint onEnter={loadMore}>
        {hasNextPage && !loading ? (
          <h1 style={{ textAlign: "center", color: "#fff" }}>Load more...</h1>
        ) : null}
      </Waypoint>

      <ScrollToTopBtn />
    </div>
  );
}
