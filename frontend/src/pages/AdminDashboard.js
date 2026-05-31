import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

function AdminDashboard() {
  const [stats, setStats] = useState({ movies: 0, users: 0, reviews: 0 });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Redirect if not admin
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    // Fetch stats
    Promise.all([
      API.get('/movies'),
      API.get('/admin/users'),
    ]).then(([moviesRes, usersRes]) => {
      setStats({
        movies: moviesRes.data.length,
        users: usersRes.data.length,
      });
    });
  }, []);

  if (!user || user.role !== 'admin') return null;

  const navStyle = {
    background: '#111', padding: '0 32px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderBottom: '1px solid #2a2a2a', height: '56px'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#e8e8e8' }}>

      {/* Navbar */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ background: '#f5c518', color: '#000', fontWeight: 900, fontSize: '15px', padding: '4px 8px', borderRadius: '4px' }}>MML</div>
          <Link to="/" style={{ color: '#aaa', fontSize: '14px', fontFamily: 'Arial' }}>← Back to Site</Link>
          <Link to="/admin" style={{ color: '#f5c518', fontSize: '14px', fontFamily: 'Arial', fontWeight: 600 }}>Dashboard</Link>
          <Link to="/admin/movies" style={{ color: '#aaa', fontSize: '14px', fontFamily: 'Arial' }}>Movies</Link>
          <Link to="/admin/users" style={{ color: '#aaa', fontSize: '14px', fontFamily: 'Arial' }}>Users</Link>
        </div>
        <span style={{ color: '#aaa', fontSize: '13px', fontFamily: 'Arial' }}>
          Admin: <strong style={{ color: '#f5c518' }}>{user.username}</strong>
        </span>
      </nav>

      <div style={{ padding: '40px 48px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '6px', fontFamily: 'Arial' }}>Admin Dashboard</h1>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '36px', fontFamily: 'Arial' }}>Overview of your site</p>

        {/* Stats cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '48px' }}>
          {[
            { label: 'Total Movies', value: stats.movies, icon: '🎬', link: '/admin/movies' },
            { label: 'Total Users', value: stats.users, icon: '👥', link: '/admin/users' },
            { label: 'Admin Panel', value: 'Active', icon: '🔒', link: '/admin' },
          ].map((stat) => (
            <Link to={stat.link} key={stat.label} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px',
                padding: '28px', cursor: 'pointer', transition: 'border-color 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#f5c518'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{stat.icon}</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#f5c518', fontFamily: 'Arial', marginBottom: '6px' }}>{stat.value}</div>
                <div style={{ fontSize: '14px', color: '#aaa', fontFamily: 'Arial' }}>{stat.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '3px', height: '22px', background: '#f5c518', borderRadius: '2px' }} />
          <h2 style={{ fontSize: '18px', fontFamily: 'Arial', fontWeight: 700 }}>Quick Actions</h2>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/admin/movies" style={{
            padding: '12px 24px', background: '#f5c518', color: '#000',
            borderRadius: '4px', fontSize: '14px', fontFamily: 'Arial', fontWeight: 'bold'
          }}>➕ Add New Movie</Link>
          <Link to="/admin/users" style={{
            padding: '12px 24px', background: 'transparent', color: '#e8e8e8',
            border: '1px solid #444', borderRadius: '4px', fontSize: '14px', fontFamily: 'Arial'
          }}>👥 Manage Users</Link>
          <Link to="/admin/movies" style={{
            padding: '12px 24px', background: 'transparent', color: '#e8e8e8',
            border: '1px solid #444', borderRadius: '4px', fontSize: '14px', fontFamily: 'Arial'
          }}>🎬 Manage Movies</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;