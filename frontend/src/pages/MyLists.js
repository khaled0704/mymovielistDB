import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

function MyLists() {
  const [lists, setLists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => { fetchLists(); }, []);

  const fetchLists = async () => {
    try {
      const res = await API.get('/lists/my');
      setLists(res.data);
    } catch (err) {
      console.error('Failed to fetch lists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const openCreate = () => {
    setEditingList(null); setName(''); setDescription(''); setIsPublic(false); setError('');
    setShowModal(true);
  };

  const openEdit = (list) => {
    setEditingList(list); setName(list.name); setDescription(list.description || '');
    setIsPublic(list.isPublic); setError(''); setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) { setError('List name is required.'); return; }
    try {
      if (editingList) {
        await API.put(`/lists/${editingList._id}`, { name, description, isPublic });
      } else {
        await API.post('/lists', { name, description, isPublic });
      }
      setShowModal(false);
      fetchLists();
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this list?')) return;
    try {
      await API.delete(`/lists/${id}`);
      fetchLists();
    } catch {
      alert('Could not delete list.');
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: '#2a2a2a', border: '1px solid #3a3a3a',
    borderRadius: '4px', color: '#fff', fontSize: '14px',
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#121212', fontFamily: "'Helvetica Neue', Arial, sans-serif", color: '#fff' }}>

      {/* Navbar */}
      <nav style={{ background: '#000', height: '56px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #2a2a2a', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/" style={{ background: '#F5C518', color: '#000', fontWeight: 900, fontSize: '18px', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none' }}>MML</Link>
          <Link to="/" style={{ color: '#aaa', fontSize: '14px', textDecoration: 'none' }}>Movies</Link>
          <Link to="/my-lists" style={{ color: '#F5C518', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>My Lists</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              <Link to="/profile" style={{ color: '#aaa', fontSize: '13px', textDecoration: 'none' }}>{user.username}</Link>
              <button onClick={handleLogout} style={{ background: 'transparent', color: '#aaa', border: '1px solid #444', padding: '5px 14px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>Sign Out</button>
            </>
          ) : (
            <Link to="/login" style={{ color: '#F5C518', fontSize: '14px', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
          )}
        </div>
      </nav>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '20px' }}>
          <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '28px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
              {editingList ? 'Edit List' : 'Create New List'}
            </h3>
            {error && <p style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>List Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Top Sci-Fi" style={{ ...inputStyle, marginBottom: '14px' }}
              onFocus={(e) => e.target.style.borderColor = '#F5C518'}
              onBlur={(e) => e.target.style.borderColor = '#3a3a3a'} />

            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this list about?"
              style={{ ...inputStyle, height: '72px', resize: 'vertical', marginBottom: '14px' }}
              onFocus={(e) => e.target.style.borderColor = '#F5C518'}
              onBlur={(e) => e.target.style.borderColor = '#3a3a3a'} />

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px' }}>
              <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} style={{ accentColor: '#F5C518', width: '15px', height: '15px' }} />
              <span style={{ fontSize: '14px', color: '#ccc' }}>Make this list public</span>
            </label>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px 18px', background: 'transparent', color: '#aaa', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px' }}>
                Cancel
              </button>
              <button onClick={handleSubmit} style={{ padding: '8px 18px', background: '#F5C518', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px' }}>
                {editingList ? 'Save Changes' : 'Create List'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '36px 24px' }}>

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.3px', marginBottom: '4px' }}>My Lists</h1>
            <p style={{ color: '#888', fontSize: '14px' }}>Organize your movies into custom watchlists.</p>
          </div>
          <button onClick={openCreate} style={{ padding: '9px 18px', background: '#F5C518', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
            + New List
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#555', padding: '60px 0' }}>Loading...</p>
        ) : lists.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', border: '1px dashed #2a2a2a', borderRadius: '8px' }}>
            <p style={{ fontSize: '36px', marginBottom: '12px' }}>🎬</p>
            <p style={{ color: '#888', fontSize: '15px', marginBottom: '16px' }}>No lists yet. Create one to start organizing your movies!</p>
            <button onClick={openCreate} style={{ padding: '9px 22px', background: '#F5C518', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
              Create your first list
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {lists.map((list) => (
              <div key={list._id} style={{
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '6px',
                padding: '18px 20px',
                transition: 'border-color 0.15s',
              }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#F5C518'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2a2a2a'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <Link to={`/lists/${list._id}`} style={{ color: '#fff', fontWeight: 700, fontSize: '16px', textDecoration: 'none', flex: 1, marginRight: '8px' }}
                    onMouseEnter={(e) => e.target.style.color = '#F5C518'}
                    onMouseLeave={(e) => e.target.style.color = '#fff'}
                  >
                    {list.name}
                  </Link>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '2px', background: list.isPublic ? '#1a3a1a' : '#2a2a2a', color: list.isPublic ? '#4caf50' : '#888', whiteSpace: 'nowrap' }}>
                    {list.isPublic ? '🌍 Public' : '🔒 Private'}
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px', minHeight: '18px', fontStyle: list.description ? 'normal' : 'italic' }}>
                  {list.description || 'No description'}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#555' }}>
                    🎬 {list.movies?.length || 0} film{list.movies?.length !== 1 ? 's' : ''}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => openEdit(list)} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #3a3a3a', color: '#aaa', borderRadius: '3px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(list._id)} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #3a3a3a', color: '#888', borderRadius: '3px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyLists;