import React from "react";

export default function MovieCard(props) {
  const { movie } = props;
  let colorValue = "",
    rating = movie.vote_average.toFixed(1);
  if (rating <= 2) {
    colorValue = "#f71425";
  } else if (rating <= 4) {
    colorValue = "#ff8812";
  } else if (rating <= 6) {
    colorValue = "#ffe718";
  } else if (rating <= 8) {
    colorValue = "#77d133";
  } else {
    colorValue = "#3ab54a";
  }
  const styles = {
    color: colorValue,
    border: "1px solid " + colorValue,
  };

  return (
    <div className="card">
      <img
        className="card__cover"
        src={`https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster_path}`}
        alt={movie.title + " poster"}
      />
      <div className="card__details">
        <div className="card__title" title={movie.title}>
          {movie.title}
        </div>

        {movie.release_date && (
          <div className="card__year">
            {new Date(movie.release_date).getFullYear()}
          </div>
        )}

        {rating && (
          <div className="card__rating" style={styles}>
            {rating}
          </div>
        )}
      </div>
    </div>
  );
}
/* <div className="card--content">
    <h3 className="card--title">{movie.title}</h3>
    <p>
        <small>RELEASE DATE: {movie.release_date}</small>
    </p>
    <p>
        <small>RATING: {movie.vote_average}</small>
    </p>
    <p className="card--desc">{movie.overview}</p>
    </div> */
