'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

function MovieList() {
  const [movieList, setMovieList] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const movieListRef = useRef();

  async function fetchData(page) {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      setError('Failed to fetch movies');
      return [];
    }
  }

  useEffect(() => {
    async function loadMoreMovies() {
      const newMovies = await fetchData(page);
      setMovieList((prevMovies) => [...prevMovies, ...newMovies]);
    }

    const movieListElement = movieListRef.current;

    function handleScroll() {
      if (
        movieListElement.scrollTop + movieListElement.offsetHeight >=
        movieListElement.scrollHeight
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    }

    loadMoreMovies();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [page]);

  return (
    <div className="grid grid-cols-5 gap-6 mx-6" ref={movieListRef}>
      {error && <h3>{error}</h3>}

      {movieList &&
        movieList.map((movie) => (
          <div
            key={`movie-${movie.id}`}
            className="overflow-hidden bg-gray-900 rounded-lg shadow-md"
          >
            <div className="flex justify-center cursor-pointer">
              {movie.poster_path && (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt="IMDB Image"
                  width={200}
                  height={200}
                />
              )}
            </div>
            <div className="p-4">
              <p className="mb-2 font-medium text-center text-medium">
                {movie.title}
              </p>
              <p className="text-sm text-gray-600 line-clamp-3">
                {movie.overview || 'No overview available.'}
              </p>
              <div className="flex justify-between">
                <p className="mt-4 text-sm text-gray-400 line-clamp-3">
                  {movie.release_date &&
                    new Date(movie.release_date).getFullYear()}
                </p>
                {movie.vote_average > 0 ? (
                  <p className="mt-4 text-sm text-gray-400 line-clamp-3">
                    {movie.vote_average.toFixed(1)}
                  </p>
                ) : (
                  <p className="mt-4 text-sm text-gray-400 line-clamp-3">
                    No Rating
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default MovieList;
