import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { TMDB_API_KEY } from '../config';

export default function MoviePage() {
    const { id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const qValue = queryParams.get('q'); 
  const navigate = useNavigate(); 
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [backdropLoaded, setBackdropLoaded] = useState(false);
  

  const handleGoBack = () => {
    if (location.state && location.state.from) {
      const backUrl = new URL(location.state.from, window.location.origin);
      if (qValue) {
        backUrl.searchParams.set('q', qValue);
      }
      navigate(backUrl.toString());
    } else {
      navigate(`/?q=${qValue || ''}`);
    }
  };
  
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const apiKey = TMDB_API_KEY;
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US&append_to_response=credits,videos`
        );
        
        if (!response.ok) {
            console.error('Failed to fetch movie details') 
        }
        
        const data = await response.json(); 
        setMovie(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="movie-page loading">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-page error">
        <h2>Error: {error}</h2>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-page not-found">
        <h2>Movie not found</h2>
      </div>
    );
  }

  // Calculate rating color
  let colorValue = "";
  const rating = movie.vote_average.toFixed(1);
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

  // Format movie runtime to hours and minutes
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="movie-page">
      <div className="movie-backdrop-container">
        <div className={`movie-backdrop-placeholder ${backdropLoaded ? 'fade-out' : ''}`}></div>
        {movie.backdrop_path && (
          <div 
            className={`movie-backdrop ${backdropLoaded ? 'fade-in' : ''}`} 
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
            onLoad={() => setBackdropLoaded(true)}
          ></div>
        )}
      </div>
      <button className="back-button" onClick={handleGoBack}>
        <i className="fa fa-arrow-left"></i> Back
      </button>
      <div className="movie-content">
        <div className="movie-poster">
          <div className={`poster-placeholder ${posterLoaded ? 'fade-out' : ''}`}></div>
          <img
            className={`${posterLoaded ? 'fade-in' : ''}`}
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={`${movie.title} poster`}
            onLoad={() => setPosterLoaded(true)}
          />
        </div>
        
        <div className="movie-details">
          <h1 className="movie-title">{movie.title}</h1>
          
          <div className="movie-meta">
            {movie.release_date && (
              <span className="movie-year">{new Date(movie.release_date).getFullYear()}</span>
            )}
            {movie.runtime > 0 && (
              <span className="movie-runtime">{formatRuntime(movie.runtime)}</span>
            )}
            <span className="movie-rating" style={{ color: colorValue, border: `1px solid ${colorValue}` }}>
              {rating}
            </span>
          </div>
          
          {movie.tagline && <p className="movie-tagline">"{movie.tagline}"</p>}
          
          <div className="movie-overview">
            <h3>Overview</h3>
            <p>{movie.overview}</p>
          </div>
          
          <div className="movie-info">

            {movie.genres && movie.genres.length ?    
            <div className="info-item">
              <h4>Genres</h4>
              <p>{movie.genres.map(genre => genre.name).join(', ')}</p>
            </div> : ''} 
            
            {movie.credits && movie.credits.crew && movie.credits.crew.length ? (
              <div className="info-item">
                <h4>Director</h4>
                <p>
                  {movie.credits.crew
                    .filter(person => person.job === "Director")
                    .map(director => director.name)
                    .join(', ')}
                </p>
              </div>
            ) : ''}
             
            
            {movie.revenue > 0 && (
              <div className="info-item">
                <h4>Revenue</h4>
                <p>{formatCurrency(movie.revenue)}</p>
              </div>
            )}
          </div>
          
          {movie.credits && movie.credits.cast &&  movie.credits.cast.length ? (
            <div className="movie-cast">
              <h3>Top Cast</h3>
              <div className="cast-list">
                {movie.credits.cast.slice(0, 6).map(actor => (
                  <div key={actor.id} className="cast-item">
                    {actor.profile_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} 
                        alt={actor.name} 
                      />
                    ) : (
                      <div className="no-profile">
                        <span>{actor.name.charAt(0)}</span>
                      </div>
                    )}
                    <p className="actor-name">{actor.name}</p>
                    <p className="character-name">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : ''} 
        </div>
      </div>
    </div>
  );
}