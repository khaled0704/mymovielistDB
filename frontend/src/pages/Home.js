import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

const styles = {
  root: {
    minHeight: "100vh",
    background: "#121212",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: "#fff",
  },
  nav: {
    background: "#000",
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "56px",
    position: "sticky",
    top: 0,
    zIndex: 200,
    borderBottom: "1px solid #2a2a2a",
  },
  navLeft: { display: "flex", alignItems: "center", gap: "24px" },
  logo: {
    background: "#F5C518",
    color: "#000",
    fontWeight: 900,
    fontSize: "20px",
    padding: "4px 8px",
    borderRadius: "4px",
    letterSpacing: "-0.5px",
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
  navLink: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: 500,
    textDecoration: "none",
    padding: "4px 0",
    borderBottom: "2px solid transparent",
    transition: "border-color 0.15s",
  },
  navUser: { color: "#aaa", fontSize: "14px" },
  signInBtn: {
    background: "#F5C518",
    color: "#000",
    border: "none",
    padding: "6px 16px",
    borderRadius: "4px",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
  },
  logoutBtn: {
    background: "transparent",
    color: "#aaa",
    border: "1px solid #444",
    padding: "5px 14px",
    borderRadius: "4px",
    fontSize: "13px",
    cursor: "pointer",
  },
  hero: {
    background: "linear-gradient(to bottom, #1a1a1a 0%, #121212 100%)",
    padding: "48px 40px 40px",
    borderBottom: "1px solid #2a2a2a",
  },
  heroTitle: {
    fontSize: "30px",
    fontWeight: 800,
    marginBottom: "6px",
    letterSpacing: "-0.5px",
  },
  heroSub: { color: "#aaa", fontSize: "15px", marginBottom: "24px" },
  searchWrap: {
    display: "flex",
    maxWidth: "600px",
    background: "#fff",
    borderRadius: "4px",
    overflow: "hidden",
    border: "2px solid #F5C518",
  },
  searchInput: {
    flex: 1,
    padding: "10px 16px",
    fontSize: "15px",
    border: "none",
    background: "#fff",
    color: "#111",
    outline: "none",
    fontFamily: "inherit",
  },
  searchBtn: {
    background: "#F5C518",
    border: "none",
    padding: "10px 20px",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: 700,
    color: "#000",
  },
  content: { padding: "32px 40px" },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: 700,
    borderLeft: "4px solid #F5C518",
    paddingLeft: "12px",
    letterSpacing: "-0.3px",
  },
  sectionCount: { color: "#888", fontSize: "14px", fontWeight: 400 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#1a1a1a",
    borderRadius: "4px",
    overflow: "hidden",
    border: "1px solid #2a2a2a",
    transition:
      "transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
    textDecoration: "none",
    display: "block",
    cursor: "pointer",
  },
  cardImg: {
    width: "100%",
    height: "260px",
    objectFit: "cover",
    display: "block",
  },
  cardImgFallback: {
    width: "100%",
    height: "260px",
    background: "#222",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
  },
  cardBody: { padding: "10px 12px 14px" },
  cardTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#fff",
    marginBottom: "4px",
    lineHeight: 1.3,
  },
  cardMeta: { color: "#888", fontSize: "12px", marginBottom: "6px" },
  cardRating: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#F5C518",
  },
  empty: {
    color: "#555",
    textAlign: "center",
    padding: "80px 0",
    fontSize: "16px",
  },
};

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    API.get("/movies").then((res) => setMovies(res.data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredMovies = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.genre.some((g) => g.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div style={styles.root}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <span style={styles.logo}>MML</span>
          <Link
            to="/"
            style={{
              ...styles.navLink,
              color: "#F5C518",
              borderBottomColor: "#F5C518",
            }}
          >
            Movies
          </Link>
          <Link to="/my-lists" style={styles.navLink}>
            My Lists
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {user ? (
            <>
              <span style={styles.navUser}>
                👤 <strong style={{ color: "#fff" }}>{user.username}</strong>
              </span>
              <Link to="/profile" style={styles.navLink}>
                Profile
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navLink}>
                Sign In
              </Link>
              <Link to="/register">
                <button style={styles.signInBtn}>Register</button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>MyMovieList</h1>
        <p style={styles.heroSub}>
          Rate movies, write reviews, and build your personal watchlists.
        </p>
        <div style={styles.searchWrap}>
          <input
            type="text"
            placeholder="Search movies by title or genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button style={styles.searchBtn}>🔍</button>
        </div>
      </div>

      {/* Grid */}
      <div style={styles.content}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            All Movies{" "}
            <span style={styles.sectionCount}>({filteredMovies.length})</span>
          </h2>
        </div>

        {filteredMovies.length === 0 ? (
          <p style={styles.empty}>No movies found matching "{search}"</p>
        ) : (
          <div style={styles.grid}>
            {filteredMovies.map((movie) => (
              <Link
                to={`/movies/${movie._id}`}
                key={movie._id}
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "#F5C518";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#2a2a2a";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    style={styles.cardImg}
                  />
                ) : (
                  <div style={styles.cardImgFallback}>🎬</div>
                )}
                <div style={styles.cardBody}>
                  <p style={styles.cardTitle}>{movie.title}</p>
                  <p style={styles.cardMeta}>
                    {movie.releaseYear} · {movie.genre.join(", ")}
                  </p>
                  <div style={styles.cardRating}>
                    ⭐ {movie.averageRating}
                    <span style={{ color: "#888", fontWeight: 400 }}>/10</span>
                  </div>
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
