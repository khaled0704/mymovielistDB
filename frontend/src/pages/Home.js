import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    API.get('/movies').then((res) => setMovies(res.data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.genre.some((g) => g.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1A3C6E' }}>🎬 MyMovieList</h1>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: '15px' }}>Hello, {user.username}</span>
              <Link to="/my-lists" style={{ marginRight: '15px' }}>My Lists</Link>
              <Link to="/profile" style={{ marginRight: '15px' }}>Profile</Link>
              <button onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
      <input
        type="text"
        placeholder="Search by title or genre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px', fontSize: '16px' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {filteredMovies.map((movie) => (
          <Link to={`/movies/${movie._id}`} key={movie._id} style={{ textDecoration: 'none', color: 'black' }}>
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', cursor: 'pointer' }}>
              {movie.poster ? (
                <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
              ) : (
                <div style={{ width: '100%', height: '200px', background: '#1A3C6E', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: '40px' }}>🎬</span>
                </div>
              )}
              <h3 style={{ marginTop: '10px' }}>{movie.title}</h3>
              <p style={{ color: '#666' }}>{movie.releaseYear} • {movie.genre.join(', ')}</p>
              <p style={{ color: '#f5a623' }}>⭐ {movie.averageRating}/10</p>
            </div>
          </Link>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666' }}>No movies found.</p>
      )}
    </div>
  );
}

export default Home;