
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [light, setLight] = useState(() => (localStorage.getItem('theme') || 'dark') === 'light');

  useEffect(() => {
    const t = light ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
  }, [light]);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="nav">
      <Link to="/" className="brand">Online Auction</Link>
      <Link to="/auctions" className="btn btn-ghost">Auctions</Link>
      <div className="spacer" />
      <Link to="/about" className="btn btn-ghost">About</Link>

      <label className="theme-toggle">
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>Light</span>
        <input type="checkbox" checked={light} onChange={(e) => setLight(e.target.checked)} />
      </label>

      {user ? (
        <>
          <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 10 }}>{user.name || user.email}</span>
          <Link className="btn btn-ghost" to="/profile" style={{ marginLeft: 6 }}>Profile</Link>
          <button className="btn btn-ghost" onClick={logout} style={{ marginLeft: 6 }}>Logout</button>
        </>
      ) : (
        <>
          <Link className="btn btn-ghost" to="/login" style={{ marginLeft: 6 }}>Login</Link>
          <Link className="btn btn-primary" to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
