import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    background: '#2a2a2a',
    border: '1px solid #3a3a3a',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#121212',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      color: '#fff',
      padding: '20px',
    }}>
      {/* Logo */}
      <Link to="/" style={{
        background: '#F5C518',
        color: '#000',
        fontWeight: 900,
        fontSize: '24px',
        padding: '6px 12px',
        borderRadius: '4px',
        textDecoration: 'none',
        marginBottom: '32px',
        letterSpacing: '-0.5px',
      }}>
        MML
      </Link>

      <div style={{
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: '8px',
        padding: '32px',
        width: '100%',
        maxWidth: '380px',
      }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', letterSpacing: '-0.3px' }}>
          Sign In
        </h2>

        {error && (
          <div style={{
            background: 'rgba(229,9,20,0.12)',
            border: '1px solid #c0392b',
            color: '#ff6b6b',
            padding: '10px 14px',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '13px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '6px', fontWeight: 500 }}>
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#F5C518'}
              onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '6px', fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#F5C518'}
              onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
            />
          </div>

          <button
            type="submit"
            style={{
              marginTop: '4px',
              padding: '11px',
              background: '#F5C518',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.target.style.background = '#e6b800'}
            onMouseLeave={(e) => e.target.style.background = '#F5C518'}
          >
            Sign In
          </button>
        </form>

        <div style={{ margin: '20px 0', borderTop: '1px solid #2a2a2a' }} />

        <p style={{ textAlign: 'center', color: '#888', fontSize: '13px' }}>
          New to MyMovieList?{' '}
          <Link to="/register" style={{ color: '#F5C518', fontWeight: 600, textDecoration: 'none' }}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;