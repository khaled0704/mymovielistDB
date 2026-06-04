import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [genreFilter, setGenreFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    API.get("/movies").then((res) => setMovies(res.data));
  }, []);

  useEffect(() => {
    if (featuredMovies.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [movies]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredMovies = movies.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.genre.some((g) => g.toLowerCase().includes(search.toLowerCase()));
    const matchesGenre = genreFilter ? m.genre.includes(genreFilter) : true;
    const matchesYear = yearFilter
      ? m.releaseYear === Number(yearFilter)
      : true;
    return matchesSearch && matchesGenre && matchesYear;
  });

  const featuredMovies = movies.filter((m) => m.poster).slice(0, 6);
  const featured = featuredMovies[currentSlide];
  const allGenres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "Western",
  ];
  const allYears = Array.from({ length: 2025 - 1900 + 1 }, (_, i) => 2025 - i);

  return (
    <div
      style={{ minHeight: "100vh", background: "#1a1a1a", color: "#e8e8e8" }}
    >
      {/* Navbar */}
      <nav
        style={{
          background: "#111",
          padding: "0 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #2a2a2a",
          height: "56px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              background: "#f5c518",
              color: "#000",
              fontWeight: 900,
              fontSize: "15px",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            MML
          </div>
          <Link
            to="/"
            style={{
              color: "#f5c518",
              fontSize: "14px",
              fontFamily: "Arial",
              fontWeight: 600,
            }}
          >
            Movies
          </Link>
          <Link
            to="/my-lists"
            style={{ color: "#aaa", fontSize: "14px", fontFamily: "Arial" }}
          >
            My Lists
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {user ? (
            <>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#f5c518",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: "#000",
                  }}
                >
                  {user.username[0].toUpperCase()}
                </div>
                <Link
                  to="/profile"
                  style={{
                    color: "#e8e8e8",
                    fontSize: "14px",
                    fontFamily: "Arial",
                  }}
                >
                  {user.username}
                </Link>
              </div>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  style={{
                    color: "#f5c518",
                    fontSize: "14px",
                    fontFamily: "Arial",
                    fontWeight: "bold",
                  }}
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                style={{
                  padding: "5px 14px",
                  background: "transparent",
                  color: "#e8e8e8",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  fontSize: "13px",
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{ color: "#aaa", fontSize: "14px", fontFamily: "Arial" }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                style={{
                  padding: "5px 14px",
                  background: "#f5c518",
                  color: "#000",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  fontFamily: "Arial",
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Carousel */}
      {featured && !search && (
        <div
          style={{ position: "relative", height: "480px", overflow: "hidden" }}
        >
          {featuredMovies.map((movie, i) => (
            <div
              key={movie._id}
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${movie.poster})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                filter: "brightness(0.3)",
                opacity: i === currentSlide ? 1 : 0,
                transition: "opacity 0.8s ease-in-out",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(17,17,17,0.97) 35%, rgba(17,17,17,0.2) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "100px",
              background: "linear-gradient(to top, #1a1a1a, transparent)",
            }}
          />

          {/* Content */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              padding: "60px 48px",
              maxWidth: "580px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "6px",
                marginBottom: "14px",
                flexWrap: "wrap",
              }}
            >
              {featured.genre.map((g) => (
                <span
                  key={g}
                  style={{
                    background: "rgba(245,197,24,0.15)",
                    color: "#f5c518",
                    padding: "2px 10px",
                    borderRadius: "3px",
                    fontSize: "12px",
                    fontFamily: "Arial",
                    border: "1px solid rgba(245,197,24,0.3)",
                  }}
                >
                  {g}
                </span>
              ))}
            </div>
            <h2
              style={{
                fontSize: "38px",
                fontWeight: 700,
                marginBottom: "10px",
                fontFamily: "Arial",
                lineHeight: 1.2,
              }}
            >
              {featured.title}
            </h2>
            <p
              style={{
                color: "#aaa",
                fontSize: "14px",
                marginBottom: "10px",
                fontFamily: "Arial",
              }}
            >
              {featured.releaseYear} &nbsp;•&nbsp; {featured.director}
            </p>
            <p
              style={{
                color: "#777",
                fontSize: "14px",
                marginBottom: "28px",
                fontFamily: "Arial",
                lineHeight: 1.7,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {featured.synopsis}
            </p>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Link
                to={`/movies/${featured._id}`}
                style={{
                  padding: "10px 26px",
                  background: "#f5c518",
                  color: "#000",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontFamily: "Arial",
                  fontWeight: "bold",
                }}
              >
                View Film
              </Link>
              {featured.averageRating > 0 && (
                <span
                  style={{
                    color: "#f5c518",
                    fontSize: "15px",
                    fontFamily: "Arial",
                  }}
                >
                  ★ {featured.averageRating}/10
                </span>
              )}
            </div>
          </div>

          {/* Dots */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "48px",
              display: "flex",
              gap: "8px",
              zIndex: 3,
            }}
          >
            {featuredMovies.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                style={{
                  width: i === currentSlide ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: i === currentSlide ? "#f5c518" : "#444",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={() =>
              setCurrentSlide(
                (prev) =>
                  (prev - 1 + featuredMovies.length) % featuredMovies.length,
              )
            }
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.6)",
              color: "#f5c518",
              border: "1px solid #333",
              borderRadius: "50%",
              width: "38px",
              height: "38px",
              fontSize: "20px",
              cursor: "pointer",
              zIndex: 3,
            }}
          >
            ‹
          </button>
          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % featuredMovies.length)
            }
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.6)",
              color: "#f5c518",
              border: "1px solid #333",
              borderRadius: "50%",
              width: "38px",
              height: "38px",
              fontSize: "20px",
              cursor: "pointer",
              zIndex: 3,
            }}
          >
            ›
          </button>
        </div>
      )}

      {/* Search + Movies */}
      <div style={{ padding: "30px 48px" }}>
        {/* Search + Filters */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          {/* Search input */}
          <div style={{ display: "flex", flex: 1, minWidth: "260px" }}>
            <input
              type="text"
              placeholder="Search movies by title or genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 16px",
                background: "#2a2a2a",
                border: "1px solid #f5c518",
                borderRight: "none",
                borderRadius: "4px 0 0 4px",
                color: "#e8e8e8",
                fontSize: "14px",
                fontFamily: "Arial",
              }}
            />
            <button
              style={{
                padding: "10px 16px",
                background: "#f5c518",
                border: "none",
                borderRadius: "0 4px 4px 0",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              🔍
            </button>
          </div>

          {/* Genre filter */}
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            style={{
              padding: "10px 14px",
              background: "#2a2a2a",
              border: "1px solid #444",
              borderRadius: "4px",
              color: "#e8e8e8",
              fontSize: "14px",
              fontFamily: "Arial",
              cursor: "pointer",
            }}
          >
            <option value="">All Genres</option>
            {allGenres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* Year filter */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            style={{
              padding: "10px 14px",
              background: "#2a2a2a",
              border: "1px solid #444",
              borderRadius: "4px",
              color: "#e8e8e8",
              fontSize: "14px",
              fontFamily: "Arial",
              cursor: "pointer",
            }}
          >
            <option value="">All Years</option>
            {allYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Clear filters button — only shows when filters are active */}
          {(genreFilter || yearFilter || search) && (
            <button
              onClick={() => {
                setSearch("");
                setGenreFilter("");
                setYearFilter("");
              }}
              style={{
                padding: "10px 16px",
                background: "transparent",
                color: "#aaa",
                border: "1px solid #444",
                borderRadius: "4px",
                fontSize: "13px",
                fontFamily: "Arial",
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>
        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "3px",
              height: "22px",
              background: "#f5c518",
              borderRadius: "2px",
            }}
          />
          <h3
            style={{
              fontSize: "18px",
              fontFamily: "Arial",
              fontWeight: 700,
              color: "#e8e8e8",
            }}
          >
            All Movies{" "}
            <span style={{ color: "#aaa", fontWeight: 400, fontSize: "15px" }}>
              ({filteredMovies.length})
            </span>
          </h3>
        </div>

        {filteredMovies.length === 0 ? (
          <p
            style={{
              color: "#555",
              textAlign: "center",
              marginTop: "80px",
              fontFamily: "Arial",
            }}
          >
            No movies found.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredMovies.map((movie) => (
              <Link
                to={`/movies/${movie._id}`}
                key={movie._id}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{ cursor: "pointer", transition: "transform 0.15s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-4px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  <div
                    style={{
                      position: "relative",
                      borderRadius: "4px",
                      overflow: "hidden",
                      marginBottom: "8px",
                      border: "1px solid #2a2a2a",
                    }}
                  >
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        style={{
                          width: "100%",
                          height: "220px",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "220px",
                          background: "#2a2a2a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: "40px" }}>🎬</span>
                      </div>
                    )}
                    {movie.averageRating > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "6px",
                          left: "6px",
                          background: "rgba(0,0,0,0.85)",
                          padding: "2px 6px",
                          borderRadius: "3px",
                          fontSize: "12px",
                          color: "#f5c518",
                          fontFamily: "Arial",
                        }}
                      >
                        ★ {movie.averageRating}
                      </div>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#e8e8e8",
                      marginBottom: "3px",
                      fontFamily: "Arial",
                    }}
                  >
                    {movie.title}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#777",
                      fontFamily: "Arial",
                    }}
                  >
                    {movie.releaseYear} · {movie.genre.join(", ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
