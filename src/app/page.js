"use client";

import { TMDBAPI, LK21API } from "@/utils/variable";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);

  const topRatedRef = useRef(null);
  const latestRef = useRef(null);

  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: -300,
        behavior: "smooth",
        duration: 500,
      });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: 300,
        behavior: "smooth",
        duration: 500,
      });
    }
  };

  const handleMovieClick = (movieId) => {
    router.push(`/movie/${movieId}`);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      const apiKey = TMDBAPI;
      const baseUrl = "https://api.themoviedb.org/3";

      // Fetch Top Rated Movies
      const topRatedResponse = await fetch(`${LK21API}popular/movies?page=1`);
      const topRatedData = await topRatedResponse.json();
      setTopRatedMovies(
        topRatedData?.map((movie) => ({
          id: movie._id,
          title: movie.title,
          image: movie.posterImg,
          resolution: movie.resolution || "HD",
          rating: movie.rating || "N/A"
        }))
      );

      // Fetch Latest Movies
      const latestResponse = await fetch(
        `${LK21API}recent-release/movies?page=1`
      );
      const latestData = await latestResponse.json();
      setLatestMovies(
        latestData?.map((movie) => ({
          id: movie._id,
          title: movie.title,
          image: movie.posterImg,
          resolution: movie.resolution || "HD",
          rating: movie.rating || "N/A"
        }))
      );
    };

    fetchMovies();

    // Add smooth scroll behavior to all movie containers
    const containers = [topRatedRef, latestRef];
    containers.forEach((ref) => {
      if (ref.current) {
        ref.current.style.scrollBehavior = "smooth";
        ref.current.style.overscrollBehavior = "contain";
      }
    });

    // Add scroll event listener for banner fade effect
    const handleScroll = () => {
      const bannerContainer = document.getElementById('banner-container');
      if (bannerContainer) {
        const scrollPosition = window.scrollY;
        const fadeStart = 0;
        const fadeEnd = 800;
        const opacity = Math.max(0, Math.min(1, 1 - (scrollPosition - fadeStart) / (fadeEnd - fadeStart)));
        bannerContainer.style.opacity = opacity;
        bannerContainer.style.transform = `scale(${1 + (opacity * 0.05)})`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Banner */}
      <div className="relative h-[80vh] overflow-hidden">
        {latestMovies[0] && (
          <>
            <div className="fixed inset-0 px-5 transition-all duration-700 ease-in-out" id="banner-container">
              <img
                src={latestMovies[0].image}
                alt={latestMovies[0].title}
                className="w-full h-full object-cover transform scale-105 transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/50 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl z-10">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-2 text-white drop-shadow-lg">
                  {latestMovies[0].title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-2xl">
                  Watch the latest blockbuster movies here! Experience the best
                  in entertainment with our curated collection of films.
                </p>
                <div className="flex gap-4">
                  <button
                    className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 cursor-pointer"
                    onClick={() => handleMovieClick(latestMovies[0].id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Play Now
                  </button>
                  <button
                    className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 cursor-pointer"
                    onClick={() => handleMovieClick(latestMovies[0].id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    More Info
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Movie Rows */}
      <div className="p-8 mx-auto">
        <h2 className="text-2xl font-bold mt-8 mb-4 text-center">Top Rated Movies</h2>
        <div className="flex items-center justify-center relative group">
          <button
            onClick={() => scrollLeft(topRatedRef)}
            className="absolute left-0 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-1/2 hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none"></div>
          <div
            // ref={topRatedRef}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-5 gap-4 overflow-x-auto py-4 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth w-full"
          >
            {topRatedMovies?.map((movie) => (
              <div
                key={movie.id}
                className="w-full transition-all duration-300 hover:scale-110 hover:z-10 relative group"
                onClick={() => handleMovieClick(movie.id)}
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-auto object-cover aspect-[2/3]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-between p-3">
                    <div className="flex items-center justify-between text-xs text-gray-300">
                      <span className="bg-gradient-to-r bg-sky-700 px-2 py-0.5 rounded">{movie.resolution}</span>
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{movie.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-white text-sm font-semibold line-clamp-2">{movie.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none"></div>
          <button
            onClick={() => scrollRight(topRatedRef)}
            className="absolute right-0 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-1/2 hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-center">Movie Terbaru</h2>
        <div className="flex items-center justify-center relative group">
          <button
            onClick={() => scrollLeft(latestRef)}
            className="absolute left-0 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-1/2 hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none"></div>
          <div
            // ref={latestRef}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 overflow-x-auto py-4 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth w-full"
          >
            {latestMovies.map((movie) => (
              <div
                key={movie.id}
                className="w-full transition-all duration-300 hover:scale-110 hover:z-10 relative group cursor-pointer"
                onClick={() => handleMovieClick(movie.id)}
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-auto object-cover aspect-[2/3]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-between p-3">
                    <div className="flex items-center justify-between text-xs text-gray-300">
                      <span className="bg-gradient-to-r bg-sky-700 px-2 py-0.5 rounded">{movie.resolution}</span>
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{movie.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-white text-sm font-semibold line-clamp-2">{movie.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none"></div>
          <button
            onClick={() => scrollRight(latestRef)}
            className="absolute right-0 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-1/2 hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
