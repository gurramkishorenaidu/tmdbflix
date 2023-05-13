'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

function MovieList() {
  const [movieList, setMovieList] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  async function fetchData() {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${currentPage}`
      );
      const data = await response.json();
      setMovieList(data.results);
    } catch (error) {
      setError('Failed to fetch movies');
    }
  }

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  console.log(movieList);

  function handlePrevClick() {
    setCurrentPage((prevPage) => prevPage - 1);
  }

  function handleNextClick() {
    setCurrentPage((prevPage) => prevPage + 1);
  }

  return (
    <div className="grid grid-cols-5 gap-6 mx-6" key={currentPage}>
      {error && <h3>{error}</h3>}

      {movieList &&
        movieList.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-900 rounded-lg overflow-hidden shadow-md"
          >
            <div className="flex justify-center cursor-pointer">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt="IMDB Image"
                width={200}
                height={200}
              />
            </div>
            <div className="p-4">
              <p className="text-medium font-medium mb-2 text-center">
                {movie.title}
              </p>
              <p className="text-gray-600 text-sm line-clamp-3">
                {movie.overview}
              </p>
              <div className="flex justify-between">
                <p className="text-gray-400 text-sm line-clamp-3 mt-4">
                  {new Date(movie.release_date).getFullYear()}
                </p>
                {movie.vote_average > 0 ? (
                  <p className="text-gray-400 text-sm line-clamp-3 mt-4">
                    {movie.vote_average.toFixed(1)}
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm line-clamp-3 mt-4">
                    No Rating
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      <div className="col-span-5 flex justify-center mt-6 mb-12">
        <button
          onClick={handlePrevClick}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-800 hover:bg-gray-700'
          } text-white px-4 py-2 rounded-l-md focus:outline-none`}
        >
          Prev
        </button>
        <button
          onClick={handleNextClick}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-r-md focus:outline-none"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default MovieList;
