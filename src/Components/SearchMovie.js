import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import axios from "axios";
import { Waypoint } from "react-waypoint";
import ScrollToTopBtn from "./ScrollToTop";

// import InfiniteScroll from "react-infinite-scroll-component";

export default function SearchMovie() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    if (query) getData();
  }, [page]);

  const getData = () => {
    if (!hasNextPage || !query) return;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=5dcf7f28a88be0edc01bbbde06f024ab&language=en-US&query=${query}&page=${page}&include_adult=false`;
    axios.get(url).then(({ data: { results, total_results } }) => {
      if (results) {
        if (total_results === movies.length + results.length) {
          setHasNextPage(false);
        }
        setMovies((movies) => [...movies, ...results]);
      }
    });
  };

  const changePage = () => {
    if (movies.length && query) setPage((page) => page + 1);
  };

  const submitForm = (e) => {
    e.preventDefault();
    setMovies([]);
    setHasNextPage(true);
    setPage(1);
  };

  return (
    <div>
      <form className="form" onSubmit={submitForm}>
        <input
          className="input"
          type="search"
          query={query}
          onChange={(e) => setQuery(e.target.value)}
          name="query"
          placeholder="i.e. Pitch Perfect"
        />
        <button className="button" type="submit">
          Search Movie
        </button>
      </form>
      <div className="moviescontainer">
        {movies
          .filter((movie) => movie.poster_path)
          .map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))} 
      </div>
      <div>
        {hasNextPage && query && (
          <Waypoint onEnter={changePage}>
            <h1 style={{ textAlign: "center", color: "#fff" }}>Loading...</h1>
          </Waypoint>
        )}
        <ScrollToTopBtn />
      </div>
    </div>
  );
}
