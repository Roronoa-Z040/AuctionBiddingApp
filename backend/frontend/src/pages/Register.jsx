
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth(); const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await axios.post('/api/auth/register', { name: name.trim(), email: email.trim().toLowerCase(), password: password.trim() });
      const { user, token } = r.data; const u = { ...user, token };
      localStorage.setItem('user', JSON.stringify(u)); setUser(u); navigate('/auctions', { replace: true });
    } catch (err) { alert(err?.response?.data?.message || 'Register failed'); }
  };
  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <div className="card">
        <h1 className="title">Create account</h1>
        <form onSubmit={submit} className="grid">
          <input className="input" placeholder="Full name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button className="btn btn-primary" type="submit">Register</button>
        </form>
        <p style={{ marginTop: 8, color: 'var(--muted)' }}>Have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
