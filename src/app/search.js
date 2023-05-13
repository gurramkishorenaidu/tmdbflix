import React from 'react';

function Search({ searchQuery, onSearchChange, onClearClick }) {
  return (
    <div className="p-6 bg-gray-800">
      <div className="flex items-center max-w-3xl py-2 mx-auto border-b-2 border-gray-700">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={onSearchChange}
          className="w-full px-4 py-2 mr-4 text-white bg-gray-900 rounded-md"
        />
        {searchQuery && (
          <button
            onClick={onClearClick}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default Search;
