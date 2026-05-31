import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form, setForm] = useState({ title: '', synopsis: '', director: '', releaseYear: '', genre: '', poster: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const res = await API.get('/movies');
    setMovies(res.data);
  };

  const openAdd = () => {
    setEditingMovie(null);
    setForm({ title: '', synopsis: '', director: '', releaseYear: '', genre: '', poster: '' });
    setError(''); setSuccess('');
    setShowForm(true);
  };

  const openEdit = (movie) => {
    setEditingMovie(movie);
    setForm({
      title: movie.title,
      synopsis: movie.synopsis,
      director: movie.director,
      releaseYear: movie.releaseYear,
      genre: movie.genre.join(', '),
      poster: movie.poster || ''
    });
    setError(''); setSuccess('');
    setShowForm(true);
  };

  const handleSubmit = async () => {
    setError(''); setSuccess('');
    if (!form.title || !form.synopsis || !form.director || !form.releaseYear || !form.genre) {
      setError('All fields except poster are required.');
      return;
    }
    try {
      const data = {
        ...form,
        releaseYear: Number(form.releaseYear),
        genre: form.genre.split(',').map((g) => g.trim())
      };
      if (editingMovie) {
        await API.put(`/movies/${editingMovie._id}`, data);
        setSuccess('Movie updated!');
      } else {
        await API.post('/movies', data);
        setSuccess('Movie added!');
      }
      fetchMovies();
      setTimeout(() => { setShowForm(false); setSuccess(''); }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await API.delete(`/movies/${id}`);
      fetchMovies();
    } catch (err) {
      alert('Failed to delete movie');
    }
  };

  const inputStyle = {
    width: '100%', padding: '9px 12px', background: '#1a1a1a',
    border: '1px solid #333', borderRadius: '4px', color: '#e8e8e8',
    fontSize: '14px', fontFamily: 'Arial', marginBottom: '14px'
  };

  const navStyle = {
    background: '#111', padding: '0 32px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderBottom: '1px solid #2a2a2a', height: '56px'
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#e8e8e8' }}>

      {/* Navbar */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ background: '#f5c518', color: '#000', fontWeight: 900, fontSize: '15px', padding: '4px 8px', borderRadius: '4px' }}>MML</div>
          <Link to="/" style={{ color: '#aaa', fontSize: '14px', fontFamily: 'Arial' }}>← Back to Site</Link>
          <Link to="/admin" style={{ color: '#aaa', fontSize: '14px', fontFamily: 'Arial' }}>Dashboard</Link>
          <Link to="/admin/movies" style={{ color: '#f5c518', fontSize: '14px', fontFamily: 'Arial', fontWeight: 600 }}>Movies</Link>
          <Link to="/admin/users" style={{ color: '#aaa', fontSize: '14px', fontFamily: 'Arial' }}>Users</Link>
        </div>
        <span style={{ color: '#aaa', fontSize: '13px', fontFamily: 'Arial' }}>
          Admin: <strong style={{ color: '#f5c518' }}>{user.username}</strong>
        </span>
      </nav>

      <div style={{ padding: '40px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Arial', marginBottom: '4px' }}>Manage Movies</h1>
            <p style={{ color: '#aaa', fontSize: '14px', fontFamily: 'Arial' }}>{movies.length} movies in the catalog</p>
          </div>
          <button onClick={openAdd} style={{ padding: '10px 22px', background: '#f5c518', color: '#000', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', fontFamily: 'Arial' }}>
            ➕ Add Movie
          </button>
        </div>

        {/* Add/Edit Modal */}
        {showForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
            <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '32px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '18px', fontFamily: 'Arial' }}>
                {editingMovie ? '✏️ Edit Movie' : '➕ Add New Movie'}
              </h3>
              {error && <div style={{ background: '#2a1a1a', border: '1px solid #f5c518', color: '#f5c518', padding: '10px', borderRadius: '4px', marginBottom: '14px', fontSize: '13px' }}>{error}</div>}
              {success && <div style={{ background: '#1a2a1a', border: '1px solid #4caf50', color: '#4caf50', padding: '10px', borderRadius: '4px', marginBottom: '14px', fontSize: '13px' }}>{success}</div>}

              {[
                { key: 'title', label: 'Title', placeholder: 'Movie title' },
                { key: 'director', label: 'Director', placeholder: 'Director name' },
                { key: 'releaseYear', label: 'Release Year', placeholder: '2024', type: 'number' },
                { key: 'genre', label: 'Genres', placeholder: 'Action, Drama, Sci-Fi (comma separated)' },
                { key: 'poster', label: 'Poster URL', placeholder: 'https://...' },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px', fontFamily: 'Arial', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
                  <input type={type || 'text'} placeholder={placeholder} value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    style={inputStyle} />
                </div>
              ))}

              <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px', fontFamily: 'Arial', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Synopsis</label>
              <textarea placeholder="Movie synopsis..." value={form.synopsis}
                onChange={(e) => setForm({ ...form, synopsis: e.target.value })}
                style={{ ...inputStyle, height: '90px', resize: 'vertical' }} />

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button onClick={() => setShowForm(false)} style={{ padding: '9px 18px', background: 'transparent', color: '#aaa', border: '1px solid #333', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Arial' }}>Cancel</button>
                <button onClick={handleSubmit} style={{ padding: '9px 22px', background: '#f5c518', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'Arial' }}>
                  {editingMovie ? 'Save Changes' : 'Add Movie'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Movies Table */}
        <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Arial' }}>
            <thead>
              <tr style={{ background: '#0a0a0a', borderBottom: '1px solid #2a2a2a' }}>
                {['Poster', 'Title', 'Director', 'Year', 'Genre', 'Rating', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movies.map((movie, i) => (
                <tr key={movie._id} style={{ borderBottom: '1px solid #1a1a1a', background: i % 2 === 0 ? '#111' : '#0f0f0f' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#111' : '#0f0f0f'}
                >
                  <td style={{ padding: '10px 16px' }}>
                    {movie.poster ? (
                      <img src={movie.poster} alt={movie.title} style={{ width: '40px', height: '55px', objectFit: 'cover', borderRadius: '3px' }} />
                    ) : (
                      <div style={{ width: '40px', height: '55px', background: '#2a2a2a', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🎬</div>
                    )}
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: '14px', fontWeight: 600, color: '#e8e8e8' }}>{movie.title}</td>
                  <td style={{ padding: '10px 16px', fontSize: '13px', color: '#aaa' }}>{movie.director}</td>
                  <td style={{ padding: '10px 16px', fontSize: '13px', color: '#aaa' }}>{movie.releaseYear}</td>
                  <td style={{ padding: '10px 16px', fontSize: '12px', color: '#aaa' }}>{movie.genre.join(', ')}</td>
                  <td style={{ padding: '10px 16px', fontSize: '13px', color: '#f5c518' }}>★ {movie.averageRating}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(movie)} style={{ padding: '5px 12px', background: 'transparent', color: '#f5c518', border: '1px solid #f5c518', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                      <button onClick={() => handleDelete(movie._id, movie.title)} style={{ padding: '5px 12px', background: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminMovies;