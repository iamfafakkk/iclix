"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import VideoPlayer from "../../components/VideoPlayer";
import { BASEURL, LK21API, TMDBAPI } from "@/utils/variable";

const MovieDetail = ({ params }) => {
  const resolvedParams = use(params);
  const [movie, setMovie] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);
  const [urlVideo, SetUrlVideo] = useState(null);
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(LK21API + "movies/" + resolvedParams.id);
        const data = await response.json();

        setMovie({
          id: data._id,
          title: data.title,
          description: data.synopsis,
          year: new Date(data.releaseDate).getFullYear(),
          duration: data.duration,
          rating: data.rating,
          genres: data.genres.map((genre) => genre),
          cast: data.casts.map((actor) => actor),
          director: data.directors.map((director) => director),
          thumbnail: data.posterImg,
          poster: data.posterImg,
        });
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchServers = async () => {
      const response = await fetch(
        LK21API + "movies/" + resolvedParams.id + "/streams"
      );
      const data = await response.json();
      // console.log(data);
      if (data?.[0]?.url.includes("cloud.hownetwork")) {
        data.shift(); // Remove the first element if it contains cloud.hownetwork
      }
      // console.log(data)
      setServers(data);
      setSelectedServer(data?.[0]);
    };

    fetchMovieDetails();
    fetchServers();
  }, [resolvedParams.id]);

  useEffect(() => {
    if (selectedServer) {
      SetUrlVideo(null)
      const proxyIframe = async () => {
        try {
          const response = await fetch(
            BASEURL + "api/movies/streams?url=" + selectedServer.url
          );
          const data = await response.json();
          console.log(data);
          SetUrlVideo(data);
        } catch (error) {
          console.error("Error fetching stream:", error);
        }
      };
      if (selectedServer.provider == "TURBOV") {
        proxyIframe();
      }
    }
  }, [selectedServer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-2xl">Movie not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Video Player */}
      <div className="relative">
        {urlVideo?.type ? (
          <VideoPlayer
            title={movie.title}
            thumbnail={movie.thumbnail}
            url={urlVideo?.url}
          />
        ) : (
          <iframe
            src={`${BASEURL}api/movies/streams?url=${encodeURIComponent(
              selectedServer?.url
            )}`}
            scrolling="no"
            frameBorder={0}
            allowFullScreen
            style={{ width: "100%", height: "72vh", border: "none" }}
          />
        )}
        {/* {selectedServer?.url && (
          <iframe
            src={`${BASEURL}api/movies/streams?url=${encodeURIComponent(
              selectedServer.url
            )}`}
            scrolling="no"
            frameBorder={0}
            allowFullScreen
            style={{ width: "100%", height: "80vh", border: "none" }}
          />
        )} */}

        {/* Server Selection Buttons */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4">
            {servers.map((server, index) => (
              <button
                key={index}
                className={`${
                  selectedServer === server ? "bg-red-600" : "bg-gray-800"
                } hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors`}
                onClick={() => setSelectedServer(server)}
              >
                SERVER {index + 1} {server.provider == 'TURBOV' && 'No Ads'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Movie Information */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Title and Basic Info */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.duration}</span>
              <span>•</span>
              <span>{movie.rating}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className={`text-gray-300 ${!showMore && "line-clamp-3"}`}>
              {movie.description}
            </p>
            <button
              onClick={() => setShowMore(!showMore)}
              className="text-red-600 hover:text-red-500 mt-2"
            >
              {showMore ? "Show Less" : "Show More"}
            </button>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Cast</h2>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((actor, index) => (
                  <span
                    key={index}
                    className="bg-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="bg-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Director */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Director</h2>
            <p className="text-gray-300">{movie.director}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
