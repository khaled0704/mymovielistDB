import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

const styles = {
  root: {
    minHeight: '100vh',
    background: '#121212',
    color: '#fff',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  },
  nav: {
    background: '#000',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '56px',
    position: 'sticky',
    top: 0,
    zIndex: 200,
    borderBottom: '1px solid #2a2a2a',
  },
  logo: {
    background: '#F5C518',
    color: '#000',
    fontWeight: 900,
    fontSize: '20px',
    padding: '4px 8px',
    borderRadius: '4px',
    textDecoration: 'none',
    letterSpacing: '-0.5px',
  },
  navLink: {
    color: '#fff',
    fontSize: '14px',
    textDecoration: 'none',
    marginLeft: '20px',
    transition: 'color 0.15s ease',
  },
  activeLink: {
    color: '#F5C518',
  },
  pageWrap: {
    maxWidth: '520px',
    margin: '40px auto',
    padding: '0 20px',
  },
  panel: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    padding: '30px',
  },
  heading: {
    fontSize: '22px',
    fontWeight: 700,
    marginBottom: '20px',
  },
  fieldLabel: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    color: '#aaa',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '4px',
    background: '#121212',
    border: '1px solid #2a2a2a',
    color: '#fff',
    fontSize: '14px',
    marginBottom: '18px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    padding: '12px 14px',
    borderRadius: '4px',
    background: '#121212',
    border: '1px solid #2a2a2a',
    color: '#fff',
    fontSize: '14px',
    marginBottom: '20px',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#F5C518',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 700,
    fontSize: '15px',
    cursor: 'pointer',
  },
  secondaryButton: {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    color: '#aaa',
    border: '1px solid #444',
    borderRadius: '4px',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '12px',
  },
  messageError: {
    background: 'rgba(229,9,20,0.12)',
    border: '1px solid #c0392b',
    color: '#ff6b6b',
    padding: '12px 14px',
    borderRadius: '4px',
    marginBottom: '18px',
    fontSize: '13px',
  },
  messageSuccess: {
    background: 'rgba(76,175,80,0.14)',
    border: '1px solid #4caf50',
    color: '#4caf50',
    padding: '12px 14px',
    borderRadius: '4px',
    marginBottom: '18px',
    fontSize: '13px',
  },
  avatarWrap: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  avatar: {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #F5C518',
  },
  avatarFallback: {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    background: '#1f1f1f',
    border: '3px solid #F5C518',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  },
  avatarTitle: {
    marginTop: '16px',
    fontSize: '24px',
    fontWeight: 700,
  },
  avatarBio: {
    color: '#aaa',
    fontSize: '14px',
    marginTop: '8px',
  },
};

function Profile() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    API.get('/auth/profile')
      .then((res) => {
        setUsername(res.data.username);
        setBio(res.data.bio);
        setAvatar(res.data.avatar);
      })
      .catch(() => {
        setError('Unable to load profile');
      });
  }, [navigate, user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await API.put('/auth/profile', { username, bio, avatar });
      localStorage.setItem('user', JSON.stringify({ ...user, username: res.data.user.username }));
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
    <div style={styles.root}>
      <nav style={styles.nav}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={styles.logo}>MML</Link>
          <Link to="/" style={styles.navLink}>Movies</Link>
          <Link to="/my-lists" style={styles.navLink}>My Lists</Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {user ? (
            <>
              <span style={{ color: '#aaa', fontSize: '14px' }}>?? {user.username}</span>
              <Link to="/profile" style={{ ...styles.navLink, ...styles.activeLink }}>Profile</Link>
              <button onClick={handleLogout} style={styles.secondaryButton}>Sign Out</button>
            </>
          ) : (
            <Link to="/login" style={styles.navLink}>Sign In</Link>
          )}
        </div>
      </nav>

      <div style={styles.pageWrap}>
        <div style={styles.avatarWrap}>
          {avatar ? (
            <img src={avatar} alt="avatar" style={styles.avatar} />
          ) : (
            <div style={styles.avatarFallback}>
              <span style={{ fontSize: '42px' }}>??</span>
            </div>
          )}
          <h1 style={styles.avatarTitle}>{username || 'Your Profile'}</h1>
          {bio && <p style={styles.avatarBio}>{bio}</p>}
        </div>

        <div style={styles.panel}>
          <h2 style={styles.heading}>Edit Profile</h2>
          {error && <div style={styles.messageError}>{error}</div>}
          {success && <div style={styles.messageSuccess}>{success}</div>}

          <form onSubmit={handleUpdate}>
            <label style={styles.fieldLabel}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />

            <label style={styles.fieldLabel}>Avatar URL</label>
            <input
              type="text"
              placeholder="Paste an image URL"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              style={styles.input}
            />

            <label style={styles.fieldLabel}>Bio</label>
            <textarea
              placeholder="Tell something about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={styles.textarea}
            />

            <button type="submit" style={styles.button}>Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
