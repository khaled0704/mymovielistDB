import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api';

const NAV_HEIGHT = '56px';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');
  const [listMsg, setListMsg] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    API.get(`/movies/${id}`).then((res) => {
      setMovie(res.data);
      API.get('/movies').then((all) => {
        const similar = all.data
          .filter((m) => m._id !== res.data._id && m.genre.some((g) => res.data.genre.includes(g)))
          .slice(0, 5);
        setSimilarMovies(similar);
      });
    });
    API.get(`/reviews/${id}`).then((res) => setReviews(res.data));
    if (user) API.get('/lists/my').then((res) => setLists(res.data));
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await API.post(`/reviews/${id}`, { rating: Number(rating), comment });
      setSuccess('Review submitted!');
      setRating(''); setComment('');
      API.get(`/reviews/${id}`).then((res) => setReviews(res.data));
      API.get(`/movies/${id}`).then((res) => setMovie(res.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await API.delete(`/reviews/${reviewId}`);
      API.get(`/reviews/${id}`).then((res) => setReviews(res.data));
      API.get(`/movies/${id}`).then((res) => setMovie(res.data));
    } catch {
      alert('Failed to delete review');
    }
  };

  const handleAddToList = async () => {
    if (!selectedList) return;
    setListMsg('');
    try {
      await API.post(`/lists/${selectedList}/movies`, { movieId: id });
      setListMsg('success');
    } catch (err) {
      setListMsg('error:' + (err.response?.data?.message || 'Failed'));
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: '#2a2a2a', border: '1px solid #3a3a3a',
    borderRadius: '4px', color: '#fff', fontSize: '14px',
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  };

  if (!movie) return (
    <div style={{ minHeight: '100vh', background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <p style={{ color: '#888' }}>Loading...</p>
    </div>
  );

  const ratingPct = (movie.averageRating / 10) * 100;

  return (
    <div style={{ minHeight: '100vh', background: '#121212', fontFamily: "'Helvetica Neue', Arial, sans-serif", color: '#fff' }}>

      {/* Nav */}
      <nav style={{ background: '#000', height: NAV_HEIGHT, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #2a2a2a', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ background: '#F5C518', color: '#000', fontWeight: 900, fontSize: '18px', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none' }}>MML</Link>
          <Link to="/" style={{ color: '#aaa', fontSize: '13px', textDecoration: 'none' }}>← Back</Link>
        </div>
        {user && (
          <span style={{ color: '#888', fontSize: '13px' }}>
            Signed in as <strong style={{ color: '#fff' }}>{user.username}</strong>
          </span>
        )}
      </nav>

      {/* Hero strip */}
      <div style={{ background: 'linear-gradient(to bottom, #1c1c1c, #121212)', borderBottom: '1px solid #2a2a2a', padding: '32px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '36px', alignItems: 'flex-start' }}>

          {/* Poster */}
          <div style={{ flexShrink: 0 }}>
            {movie.poster ? (
              <img src={movie.poster} alt={movie.title} style={{ width: '200px', borderRadius: '4px', display: 'block', boxShadow: '0 8px 32px rgba(0,0,0,0.7)' }} />
            ) : (
              <div style={{ width: '200px', height: '290px', background: '#2a2a2a', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '52px' }}>🎬</div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>{movie.title}</h1>
              <span style={{ color: '#888', fontSize: '20px', fontWeight: 400 }}>({movie.releaseYear})</span>
            </div>

            {/* Genres row */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {movie.genre.map((g) => (
                <span key={g} style={{ padding: '3px 10px', background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '2px', fontSize: '12px', color: '#ccc' }}>{g}</span>
              ))}
            </div>

            {/* Rating box (IMDb-style) */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '6px', padding: '12px 20px', textAlign: 'center', minWidth: '100px' }}>
                <div style={{ color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>MML Rating</div>
                <div style={{ color: '#F5C518', fontSize: '26px', fontWeight: 800, lineHeight: 1 }}>⭐ {movie.averageRating}</div>
                <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>/10 · {reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
              </div>
              <div style={{ background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '6px', padding: '12px 20px', minWidth: '100px' }}>
                <div style={{ color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Director</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#F5C518' }}>{movie.director}</div>
              </div>
            </div>

            <p style={{ color: '#ccc', lineHeight: 1.7, maxWidth: '580px', fontSize: '15px', marginBottom: '24px' }}>{movie.synopsis}</p>

            {/* Add to list */}
            {user && lists.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <select value={selectedList} onChange={(e) => setSelectedList(e.target.value)}
                  style={{ ...inputStyle, width: 'auto', minWidth: '180px' }}>
                  <option value="">+ Add to watchlist...</option>
                  {lists.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
                </select>
                <button onClick={handleAddToList} style={{ padding: '10px 20px', background: '#F5C518', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                  Add
                </button>
                {listMsg === 'success' && <span style={{ color: '#4caf50', fontSize: '13px' }}>✓ Added!</span>}
                {listMsg.startsWith('error:') && <span style={{ color: '#ff6b6b', fontSize: '13px' }}>{listMsg.slice(6)}</span>}
              </div>
            )}
            {user && lists.length === 0 && (
              <Link to="/my-lists" style={{ display: 'inline-block', padding: '8px 16px', background: '#2a2a2a', border: '1px solid #3a3a3a', color: '#ccc', borderRadius: '4px', fontSize: '13px', textDecoration: 'none' }}>
                + Create a list to save this movie
              </Link>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>

          {/* Reviews */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, borderLeft: '4px solid #F5C518', paddingLeft: '12px', marginBottom: '20px' }}>
              Reviews <span style={{ color: '#888', fontWeight: 400, fontSize: '15px' }}>({reviews.length})</span>
            </h2>

            {user ? (
              <form onSubmit={handleReview} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '20px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#F5C518', marginBottom: '14px' }}>Write a Review</h3>
                {error && <p style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}
                {success && <p style={{ color: '#4caf50', fontSize: '13px', marginBottom: '10px' }}>✓ {success}</p>}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <input type="number" placeholder="Score 1–10" value={rating}
                    onChange={(e) => setRating(e.target.value)} min="1" max="10" required
                    style={{ ...inputStyle, width: '130px' }} />
                </div>
                <textarea placeholder="Share your thoughts..." value={comment}
                  onChange={(e) => setComment(e.target.value)} required
                  style={{ ...inputStyle, height: '90px', resize: 'vertical', marginBottom: '12px' }} />
                <button type="submit" style={{ padding: '9px 22px', background: '#F5C518', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                  Submit Review
                </button>
              </form>
            ) : (
              <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '16px', marginBottom: '20px', textAlign: 'center' }}>
                <p style={{ color: '#888', fontSize: '14px' }}>
                  <Link to="/login" style={{ color: '#F5C518', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link> to write a review
                </p>
              </div>
            )}

            {reviews.length === 0 ? (
              <p style={{ color: '#555', textAlign: 'center', padding: '40px 0' }}>No reviews yet — be the first!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reviews.map((review) => (
                    <div key={review._id} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {/* Avatar Image - Priority to user's avatar, fallback to colored circle */}
                          {review.userId?.avatar ? (
                            <img 
                              src={review.userId.avatar} 
                              alt={review.userId.username}
                              style={{ 
                                width: '32px', 
                                height: '32px', 
                                borderRadius: '50%', 
                                objectFit: 'cover',
                                border: '1px solid #F5C518'
                              }}
                              onError={(e) => {
                                // If image fails to load, fallback to colored circle
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `
                                  <div style="width: 32px; height: 32px; border-radius: 50%; background: #F5C518; color: #000; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px;">
                                    ${review.userId?.username?.[0]?.toUpperCase() || 'U'}
                                  </div>
                                `;
                              }}
                            />
                          ) : (
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F5C518', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px' }}>
                              {review.userId?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <Link 
                            to={`/user/${review.userId?._id}`} 
                            style={{ fontWeight: 600, fontSize: '14px', color: '#fff', textDecoration: 'none', cursor: 'pointer' }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                          >
                            {review.userId?.username || 'User'}
                          </Link>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ color: '#F5C518', fontWeight: 700, fontSize: '14px' }}>⭐ {review.rating}/10</span>
                          {user && review.userId?._id === user.id && (
                            <button onClick={() => handleDeleteReview(review._id)}
                              style={{ padding: '3px 9px', background: 'transparent', color: '#888', border: '1px solid #444', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}>
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                      <p style={{ color: '#ccc', lineHeight: 1.6, fontSize: '14px', margin: 0 }}>{review.comment}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Similar Movies sidebar */}
          {similarMovies.length > 0 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, borderLeft: '4px solid #F5C518', paddingLeft: '12px', marginBottom: '16px' }}>
                More Like This
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {similarMovies.map((m) => (
                  <Link to={`/movies/${m._id}`} key={m._id} style={{ textDecoration: 'none', display: 'flex', gap: '12px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '4px', overflow: 'hidden', transition: 'border-color 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#F5C518'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2a2a2a'}
                  >
                    {m.poster ? (
                      <img src={m.poster} alt={m.title} style={{ width: '70px', height: '95px', objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: '70px', height: '95px', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '24px' }}>🎬</div>
                    )}
                    <div style={{ padding: '10px 10px 10px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{m.title}</p>
                      <p style={{ color: '#F5C518', fontSize: '12px', fontWeight: 700 }}>⭐ {m.averageRating}/10</p>
                      <p style={{ color: '#888', fontSize: '11px', marginTop: '4px' }}>{m.releaseYear}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;