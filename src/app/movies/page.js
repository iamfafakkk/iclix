"use client";

import { TMDBAPI } from "@/utils/variable";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDBAPI}`);
      const data = await response.json();
      setGenres(data.genres);
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      const genreParam = selectedGenre ? `&with_genres=${selectedGenre}` : '';
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDBAPI}&page=${currentPage}${genreParam}`
      );
      const data = await response.json();
      setMovies(data.results);
      setTotalPages(Math.min(data.total_pages, 500)); // TMDB limits to 500 pages
      setIsLoading(false);
    };

    fetchMovies();
  }, [currentPage, selectedGenre]);

  return (
    <div className="min-h-screen bg-teal-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Movies</h1>

        {/* Filters */}
        <div className="mb-8">
          <select
            value={selectedGenre}
            onChange={(e) => {
              setSelectedGenre(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-teal-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            {/* Movies Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-teal-800 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-10 relative group"
                >
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/500x750?text=No+Poster+Available"
                      }
                      alt={movie.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/500x750?text=No+Poster+Available";
                      }}
                    />
                    {/* Rating and Quality Badge */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      <div className="bg-black/80 px-2 py-1 rounded text-sm font-semibold text-yellow-400 flex items-center">
                        <span className="mr-1">★</span>
                        {movie.vote_average.toFixed(1)}
                      </div>
                      <div className="bg-black/80 px-2 py-1 rounded text-sm font-semibold text-white">
                        HD
                      </div>
                    </div>
                    {/* Simple overlay for title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors duration-300">
                          {movie.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-teal-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-700 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-teal-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-700 transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 