'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

function MovieList() {
  const [movieList, setMovieList] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchData(page) {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`
      );
      const data = await response.json();
      setMovieList(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      setError('Failed to fetch movies');
    }
  }

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  console.log(movieList);

  function handlePrevClick() {
    setCurrentPage((prevPage) => prevPage - 1);
  }

  function handleNextClick() {
    setCurrentPage((prevPage) => prevPage + 1);
  }

  function renderPageNumbers() {
    const pageNumbers = [];

    // Add left arrow button if currentPage is greater than 1
    if (currentPage > 1) {
      pageNumbers.push(
        <button
          key={`page-left`}
          className="px-4 py-2 mr-2 text-gray-600 bg-gray-200 rounded-md font-sm hover:text-white focus:outline-none"
          onClick={handlePrevClick}
        >
          {'<'}
        </button>
      );
    }

    // Add page number buttons with ellipsis
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pageNumbers.push(
          <button
            key={`page-${i}`}
            className={`px-4 py-2 font-sm text-gray-600 hover:text-white bg-gray-200 rounded-md mr-2 focus:outline-none ${
              i === currentPage ? 'text-gray-200 bg-amber-500' : ''
            }`}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </button>
        );
      } else if (
        (i === currentPage - 3 && currentPage > 4) ||
        (i === currentPage + 3 && currentPage < totalPages - 3)
      ) {
        pageNumbers.push(
          <span key={`page-${i}`} className="mx-2">
            {'...'}
          </span>
        );
      }
    }

    // Add right arrow button if currentPage is less than totalPages
    if (currentPage < totalPages) {
      pageNumbers.push(
        <button
          key={`page-right`}
          className="px-4 py-2 mr-2 text-gray-600 bg-gray-200 rounded-md font-sm hover:text-white focus:outline-none"
          onClick={handleNextClick}
        >
          {'>'}
        </button>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-2 mt-6">
        {pageNumbers}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-6 mx-6">
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
      <div className="flex justify-center col-span-5 mt-6 mb-12">
        {totalPages > 1 && renderPageNumbers()}
      </div>
    </div>
  );
}

export default MovieList;
