import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

const NAV_HEIGHT = '56px';

function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Fetch user profile
        const userRes = await API.get(`/users/${userId}`);
        setUser(userRes.data);
        
        // Fetch user's public playlists
        const playlistsRes = await API.get(`/users/${userId}/playlists?public=true`);
        setPlaylists(playlistsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <p style={{ color: '#888' }}>Loading profile...</p>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <p style={{ color: '#ff6b6b' }}>{error}</p>
    </div>
  );

  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <p style={{ color: '#888' }}>User not found</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#121212', fontFamily: "'Helvetica Neue', Arial, sans-serif", color: '#fff' }}>
      
      {/* Navigation */}
      <nav style={{ background: '#000', height: NAV_HEIGHT, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #2a2a2a', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ background: '#F5C518', color: '#000', fontWeight: 900, fontSize: '18px', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none' }}>MML</Link>
          <Link to="/" style={{ color: '#aaa', fontSize: '13px', textDecoration: 'none' }}>← Back to Home</Link>
        </div>
        {currentUser && (
          <span style={{ color: '#888', fontSize: '13px' }}>
            Signed in as <strong style={{ color: '#fff' }}>{currentUser.username}</strong>
          </span>
        )}
      </nav>

      {/* Profile Header */}
      <div style={{ background: 'linear-gradient(to bottom, #1c1c1c, #121212)', borderBottom: '1px solid #2a2a2a', padding: '48px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '36px', alignItems: 'center' }}>
          
          {/* Profile Picture */}
          <div style={{ flexShrink: 0 }}>
            {user.avatar ? (
                <img 
                src={user.avatar} 
                alt={user.username} 
                style={{ 
                    width: '150px', 
                    height: '150px', 
                    borderRadius: '50%', 
                    objectFit: 'cover', 
                    border: '3px solid #F5C518' 
                }} 
                />
            ) : (
                <div style={{ 
                width: '150px', 
                height: '150px', 
                borderRadius: '50%', 
                background: '#F5C518', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '64px', 
                fontWeight: 'bold', 
                color: '#000' 
                }}>
                {user.username?.[0]?.toUpperCase() || '?'}
                </div>
            )}
            </div>
          {/* User Info */}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>{user.username}</h1>
            {user.firstName && user.lastName && (
              <p style={{ color: '#ccc', fontSize: '16px', marginBottom: '12px' }}>
                {user.firstName} {user.lastName}
              </p>
            )}
            {user.bio && (
              <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: '6px', marginTop: '16px' }}>
                <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{user.bio}</p>
              </div>
            )}
            <div style={{ marginTop: '16px', color: '#888', fontSize: '13px' }}>
              Member since: {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Public Playlists Section */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, borderLeft: '4px solid #F5C518', paddingLeft: '16px', marginBottom: '24px' }}>
          Public Playlists
        </h2>
        
        {playlists.length === 0 ? (
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '40px', textAlign: 'center' }}>
            <p style={{ color: '#888', fontSize: '14px' }}>No public playlists yet</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {playlists.map((playlist) => (
              <Link 
                key={playlist._id} 
                to={`/lists/${playlist._id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{ 
                  background: '#1a1a1a', 
                  border: '1px solid #2a2a2a', 
                  borderRadius: '8px', 
                  padding: '20px',
                  transition: 'border-color 0.15s, transform 0.15s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#F5C518';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2a2a2a';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <h3 style={{ color: '#F5C518', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                    {playlist.name}
                  </h3>
                  <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '12px' }}>
                    {playlist.description || 'No description'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#888', fontSize: '12px' }}>
                      {playlist.movies?.length || 0} movies
                    </span>
                    <span style={{ color: '#F5C518', fontSize: '12px' }}>View →</span>
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

export default UserProfile;