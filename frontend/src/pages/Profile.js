import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

function Profile() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    if (!user) navigate('/login');
    API.get('/auth/profile').then((res) => {
      setUsername(res.data.username);
      setBio(res.data.bio);
      setAvatar(res.data.avatar);
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await API.put('/auth/profile', { username, bio, avatar });
      localStorage.setItem('user', JSON.stringify({
        ...user,
        username: res.data.user.username
      }));
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <Link to="/" style={{ color: '#1A3C6E' }}>← Back to Home</Link>
      <h1 style={{ marginTop: '20px' }}>My Profile</h1>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {avatar ? (
          <img src={avatar} alt="avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#1A3C6E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <span style={{ color: 'white', fontSize: '40px' }}>👤</span>
          </div>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleUpdate}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Avatar URL</label>
          <input
            type="text"
            placeholder="Paste an image URL"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bio</label>
          <textarea
            placeholder="Tell something about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ width: '100%', padding: '8px', height: '80px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#1A3C6E', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
          Save Changes
        </button>
      </form>

      <button
        onClick={handleLogout}
        style={{ width: '100%', padding: '10px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', marginTop: '10px' }}
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;