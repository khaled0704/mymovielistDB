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

  useEffect(() => {
    fetchLists();
  }, []);

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
    setEditingList(null);
    setName('');
    setDescription('');
    setIsPublic(false);
    setError('');
    setShowModal(true);
  };

  const openEdit = (list) => {
    setEditingList(list);
    setName(list.name);
    setDescription(list.description || '');
    setIsPublic(list.isPublic);
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('List name is required.');
      return;
    }
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
    } catch (err) {
      alert('Could not delete list.');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>

      {/* Navbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1A3C6E' }}>🎬 MyMovieList</h1>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: '15px' }}>Hello, {user.username}</span>
              <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
              <Link to="/my-lists" style={{ marginRight: '15px' }}>My Lists</Link>
              <Link to="/profile" style={{ marginRight: '15px' }}>Profile</Link>
              <button onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>

      {/* Page header */}
      <h2 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '6px' }}>My Lists</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Organize your favorite movies into custom lists.</p>

      {/* Create button */}
      <button
        onClick={openCreate}
        style={{ padding: '8px 16px', background: '#1A3C6E', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}
      >
        + Create new list
      </button>

      {/* Create / Edit Modal */}
      {showModal && (
        <div style={{ background: 'rgba(0,0,0,0.45)', borderRadius: '12px', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #ddd', padding: '24px', width: '100%', maxWidth: '420px' }}>
            <h3 style={{ marginBottom: '16px' }}>{editingList ? 'Edit list' : 'Create a new list'}</h3>

            {error && <p style={{ color: 'red', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px' }}>List name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. My top sci-fi movies"
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px' }}>Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this list about?"
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', minHeight: '70px', resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <label htmlFor="isPublic" style={{ fontSize: '14px' }}>Make this list public</label>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: '7px 14px', border: '1px solid #ddd', background: 'transparent', borderRadius: '6px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{ padding: '7px 14px', background: '#1A3C6E', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                {editingList ? 'Save changes' : 'Create list'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lists */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Loading your lists...</p>
      ) : lists.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '60px' }}>You have no lists yet. Create one to get started!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {lists.map((list) => (
            <div key={list._id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '16px 18px', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontWeight: '500', fontSize: '16px' }}>{list.name}</span>
                <span style={{
                  fontSize: '11px', padding: '3px 8px', borderRadius: '6px',
                  background: list.isPublic ? '#e6f4ea' : '#f1f1f1',
                  color: list.isPublic ? '#2e7d32' : '#666'
                }}>
                  {list.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px', fontStyle: list.description ? 'normal' : 'italic' }}>
                {list.description || 'No description'}
              </p>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '14px' }}>
                🎬 {list.movies?.length || 0} movie{list.movies?.length !== 1 ? 's' : ''}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => openEdit(list)}
                  style={{ flex: 1, padding: '6px', border: '1px solid #1A3C6E', color: '#1A3C6E', background: 'transparent', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(list._id)}
                  style={{ padding: '6px 10px', border: '1px solid #e53e3e', color: '#e53e3e', background: 'transparent', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyLists;