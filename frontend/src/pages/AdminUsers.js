import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Delete user "${username}"?`)) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
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
          <Link to="/admin/movies" style={{ color: '#aaa', fontSize: '14px', fontFamily: 'Arial' }}>Movies</Link>
          <Link to="/admin/users" style={{ color: '#f5c518', fontSize: '14px', fontFamily: 'Arial', fontWeight: 600 }}>Users</Link>
        </div>
        <span style={{ color: '#aaa', fontSize: '13px', fontFamily: 'Arial' }}>
          Admin: <strong style={{ color: '#f5c518' }}>{user.username}</strong>
        </span>
      </nav>

      <div style={{ padding: '40px 48px' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Arial', marginBottom: '4px' }}>Manage Users</h1>
          <p style={{ color: '#aaa', fontSize: '14px', fontFamily: 'Arial' }}>{users.length} registered users</p>
        </div>

        {/* Users Table */}
        <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Arial' }}>
            <thead>
              <tr style={{ background: '#0a0a0a', borderBottom: '1px solid #2a2a2a' }}>
                {['Avatar', 'Username', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id} style={{ borderBottom: '1px solid #1a1a1a', background: i % 2 === 0 ? '#111' : '#0f0f0f' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#111' : '#0f0f0f'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f5c518', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', color: '#000' }}>
                      {u.username[0].toUpperCase()}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: '#e8e8e8' }}>{u.username}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#aaa' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '3px', fontSize: '12px',
                      background: u.role === 'admin' ? 'rgba(245,197,24,0.15)' : 'rgba(255,255,255,0.05)',
                      color: u.role === 'admin' ? '#f5c518' : '#aaa',
                      border: `1px solid ${u.role === 'admin' ? 'rgba(245,197,24,0.3)' : '#333'}`
                    }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#aaa' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {u._id !== user.id && (
                      <button onClick={() => handleDelete(u._id, u.username)}
                        style={{ padding: '5px 12px', background: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                        Delete
                      </button>
                    )}
                    {u._id === user.id && (
                      <span style={{ color: '#555', fontSize: '12px' }}>You</span>
                    )}
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

export default AdminUsers;