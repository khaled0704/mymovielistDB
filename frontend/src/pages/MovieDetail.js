import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    API.get(`/movies/${id}`).then((res) => setMovie(res.data));
    API.get(`/reviews/${id}`).then((res) => setReviews(res.data));
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await API.post(`/reviews/${id}`, {
        rating: Number(rating),
        comment
      });
      setSuccess('Review added successfully!');
      setRating('');
      setComment('');
      API.get(`/reviews/${id}`).then((res) => setReviews(res.data));
      API.get(`/movies/${id}`).then((res) => setMovie(res.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add review');
    }
  };

  if (!movie) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Link to="/" style={{ color: '#1A3C6E' }}>← Back to Home</Link>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ width: '200px', flexShrink: 0 }}>
          {movie.poster ? (
            <img src={movie.poster} alt={movie.title} style={{ width: '100%', borderRadius: '8px' }} />
          ) : (
            <div style={{ width: '200px', height: '300px', background: '#1A3C6E', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: '60px' }}>🎬</span>
            </div>
          )}
        </div>
        <div>
          <h1>{movie.title}</h1>
          <p style={{ color: '#666' }}>{movie.releaseYear} • {movie.genre.join(', ')}</p>
          <p style={{ color: '#666' }}>Director: {movie.director}</p>
          <p style={{ color: '#f5a623', fontSize: '20px' }}>⭐ {movie.averageRating}/10</p>
          <p style={{ marginTop: '10px' }}>{movie.synopsis}</p>
        </div>
      </div>
      <div style={{ marginTop: '40px' }}>
        <h2>Reviews ({reviews.length})</h2>
        {user ? (
          <form onSubmit={handleReview} style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>Write a Review</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <div style={{ marginBottom: '10px' }}>
              <input
                type="number"
                placeholder="Rating (1-10)"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                min="1"
                max="10"
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ width: '100%', padding: '8px', height: '80px' }}
              />
            </div>
            <button type="submit" style={{ padding: '8px 20px', background: '#1A3C6E', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
              Submit Review
            </button>
          </form>
        ) : (
          <p><Link to="/login">Login</Link> to write a review.</p>
        )}
        {reviews.length === 0 ? (
          <p style={{ color: '#666' }}>No reviews yet. Be the first!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{review.userId?.username || 'User'}</strong>
                <span style={{ color: '#f5a623' }}>⭐ {review.rating}/10</span>
              </div>
              <p style={{ marginTop: '8px' }}>{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MovieDetail;