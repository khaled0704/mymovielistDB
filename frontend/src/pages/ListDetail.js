import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

const NAV_HEIGHT = '56px';

function ListDetail() {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    API.get(`/lists/${id}`)
      .then((res) => setList(res.data))
      .catch(() => setError('List not found or is private.'));
  }, [id]);

  const handleRemoveMovie = async (movieId) => {
    try {
      await API.delete(`/lists/${id}/movies/${movieId}`);
      API.get(`/lists/${id}`).then((res) => setList(res.data));
    } catch (err) {
      alert('Failed to remove movie');
    }
  };

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#ff6b6b', fontSize: '18px', marginBottom: '16px' }}>{error}</p>
        <Link to="/" style={{ color: '#F5C518' }}>← Back to Home</Link>
      </div>
    </div>
  );

  if (!list) return (
    <div style={{ minHeight: '100vh', background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888', fontSize: '18px' }}>Loading...</p>
    </div>
  );

  const isOwner = user && list.userId?._id === user.id;

  return (
    <div style={{ minHeight: '100vh', background: '#121212', fontFamily: "'Helvetica Neue', Arial, sans-serif", color: '#fff' }}>

      {/* Nav */}
      <nav style={{ background: '#000', height: NAV_HEIGHT, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #2a2a2a', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ background: '#F5C518', color: '#000', fontWeight: 900, fontSize: '18px', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none' }}>MML</Link>
          <Link to="/my-lists" style={{ color: '#aaa', fontSize: '13px', textDecoration: 'none' }}>← Back to My Lists</Link>
        </div>
        {user && (
          <span style={{ color: '#888', fontSize: '13px' }}>
            Signed in as <strong style={{ color: '#fff' }}>{user.username}</strong>
          </span>
        )}
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px' }}>

        {/* List header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1a1a1a, #0d0d0d)', 
          border: '1px solid #2a2a2a',
          padding: '32px', 
          borderRadius: '8px', 
          marginBottom: '32px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.5px' }}>{list.name}</h1>
              {list.description && (
                <p style={{ color: '#aaa', fontSize: '15px', marginBottom: '16px', lineHeight: 1.6 }}>{list.description}</p>
              )}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  background: list.isPublic ? '#1a3a1a' : '#2a2a2a',
                  color: list.isPublic ? '#4caf50' : '#aaa',
                  padding: '4px 12px', 
                  borderRadius: '4px', 
                  fontSize: '13px',
                  fontWeight: 500
                }}>
                  {list.isPublic ? '🌍 Public' : '🔒 Private'}
                </span>
                <span style={{ color: '#aaa', fontSize: '13px' }}>
                  🎬 {list.movies.length} movie{list.movies.length !== 1 ? 's' : ''}
                </span>
                {list.userId?.username && (
                  <span style={{ color: '#aaa', fontSize: '13px' }}>
                    👤 by <strong style={{ color: '#F5C518' }}>{list.userId.username}</strong>
                  </span>
                )}
              </div>
            </div>
            {isOwner && (
              <Link 
                to="/my-lists" 
                style={{ 
                  padding: '8px 16px', 
                  background: 'transparent', 
                  border: '1px solid #3a3a3a', 
                  borderRadius: '4px', 
                  color: '#ccc', 
                  fontSize: '13px', 
                  textDecoration: 'none',
                  transition: 'border-color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#F5C518'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3a3a3a'}
              >
                Manage Lists →
              </Link>
            )}
          </div>
        </div>

        {/* Movies Grid */}
        {list.movies.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px', 
            background: '#1a1a1a', 
            border: '1px solid #2a2a2a', 
            borderRadius: '8px' 
          }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</p>
            <p style={{ color: '#888', fontSize: '16px', marginBottom: '20px' }}>No movies in this list yet.</p>
            <Link 
              to="/" 
              style={{ 
                display: 'inline-block', 
                padding: '10px 24px', 
                background: '#F5C518', 
                color: '#000', 
                borderRadius: '4px', 
                fontSize: '14px', 
                fontWeight: 700,
                textDecoration: 'none' 
              }}>
              Browse Movies
            </Link>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '20px' 
          }}>
            {list.movies.map((item) => {
              const movie = item.movieId;
              if (!movie) return null;
              return (
                <div 
                  key={item._id} 
                  style={{ 
                    background: '#1a1a1a', 
                    borderRadius: '6px', 
                    overflow: 'hidden', 
                    border: '1px solid #2a2a2a',
                    position: 'relative',
                    transition: 'transform 0.15s ease, border-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = '#F5C518';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#2a2a2a';
                  }}
                >
                  <Link to={`/movies/${movie._id}`} style={{ textDecoration: 'none' }}>
                    {movie.poster ? (
                      <img 
                        src={movie.poster} 
                        alt={movie.title} 
                        style={{ width: '100%', height: '280px', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '280px', 
                        background: '#2a2a2a', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        <span style={{ fontSize: '48px' }}>🎬</span>
                      </div>
                    )}
                    <div style={{ padding: '12px' }}>
                      <p style={{ fontWeight: 700, color: '#fff', fontSize: '14px', marginBottom: '6px', lineHeight: 1.3 }}>
                        {movie.title}
                      </p>
                      <p style={{ color: '#F5C518', fontSize: '13px', fontWeight: 700 }}>
                        ⭐ {movie.averageRating}/10
                      </p>
                      <p style={{ color: '#888', fontSize: '11px', marginTop: '4px' }}>
                        {movie.releaseYear}
                      </p>
                    </div>
                  </Link>
                  {isOwner && (
                    <button
                      onClick={() => handleRemoveMovie(movie._id)}
                      style={{
                        position: 'absolute', 
                        top: '8px', 
                        right: '8px',
                        background: 'rgba(0,0,0,0.7)',
                        color: '#fff',
                        border: '1px solid #ff6b6b',
                        borderRadius: '50%', 
                        width: '28px', 
                        height: '28px',
                        fontSize: '14px', 
                        cursor: 'pointer', 
                        display: 'flex',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#ff6b6b'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListDetail;