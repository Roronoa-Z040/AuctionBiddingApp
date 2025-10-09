
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
const Badge = ({ t }) => {
  const c = t === 'WON' ? 'var(--success)' : t === 'LEADING' ? 'var(--primary)' : t === 'LOST' ? 'var(--danger)' : 'var(--warning)';
  return <span className="badge" style={{ borderColor: 'transparent', background: c, color: '#fff' }}>{t}</span>;
};
export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '' });
  const [cp, setCP] = useState(''); const [npv, setNPV] = useState('');
  const [parts, setParts] = useState([]);
  const [my, setMy] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [q, setQ] = useState('');
  useEffect(() => {
    if (!user?.token) return;
    axios.get('/api/users/me', { headers: { Authorization: `Bearer ${user.token}` } }).then((r)=>setForm({ name: r.data.name || '', email: r.data.email || '' }));
    axios.get('/api/users/me/participation', { headers: { Authorization: `Bearer ${user.token}` } }).then((r)=>setParts(r.data));
    fetchMine(1);
  }, [user]); // eslint-disable-line
  const fetchMine = async (p = 1) => {
    if (!user?.token) return;
    const r = await axios.get('/api/users/me/listings', { params: { q, page: p, limit: 10, sort: 'createdAt_desc' }, headers: { Authorization: `Bearer ${user.token}` } });
    setMy(r.data);
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!user?.token) return alert('Login required');
    if (npv && npv.length < 6) return alert('New password must be at least 6 characters');
    try {
      const payload = { name: form.name.trim(), ...(npv ? { currentPassword: cp, newPassword: npv } : {}) };
      const r = await axios.put('/api/users/me', payload, { headers: { Authorization: `Bearer ${user.token}` } });
      const u = { ...user, name: r.data.name, email: r.data.email }; localStorage.setItem('user', JSON.stringify(u)); setUser(u);
      setCP(''); setNPV(''); alert('Profile updated');
    } catch (e) { alert(e?.response?.data?.message || 'Update failed'); }
  };
  if (!user) return (<div className="container" style={{ maxWidth: 520 }}><div className="card">Please log in to view your profile.</div></div>);
  return (
    <div className="container" style={{ maxWidth: 1000 }}>
      <div className="grid grid-2">
        <div className="card">
          <h1 className="title">Your Profile</h1>
          <p className="subtitle">Update your name and optionally change your password.</p>
          <form onSubmit={submit} className="grid">
            <div className="grid grid-2">
              <div><label className="subtitle">Full name</label><input className="input" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} required /></div>
              <div><label className="subtitle">Email</label><input className="input" value={form.email} disabled /></div>
            </div>
            <div className="card" style={{ padding: 12 }}>
              <div className="subtitle" style={{ marginBottom: 6 }}>Change password (optional)</div>
              <div className="grid grid-2">
                <input className="input" type="password" placeholder="Current password" value={cp} onChange={(e)=>setCP(e.target.value)} />
                <input className="input" type="password" placeholder="New password" value={npv} onChange={(e)=>setNPV(e.target.value)} />
              </div>
            </div>
            <button className="btn btn-primary" type="submit">Save changes</button>
          </form>
        </div>
        <div className="card">
          <h2 className="title" style={{ fontSize: 22 }}>Your Bids</h2>
          <p className="subtitle">Auctions you participated in and current result.</p>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Listing</th><th>Ends</th><th>My top bid</th><th>Top bid</th><th>Status</th><th>Outcome</th></tr></thead>
              <tbody>
                {parts.map((p) => (
                  <tr key={p.auction._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {p.auction.imageUrl ? <img alt="" src={`${axios.defaults.baseURL}{p.auction.imageUrl}`} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} /> : <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,.06)', borderRadius: 8 }} />}
                        <div><div style={{ fontWeight: 600 }}>{p.auction.title}</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>by {p.auction.createdBy?.name || '—'}</div></div>
                      </div>
                    </td>
                    <td>{new Date(p.auction.endDate).toLocaleString()}</td>
                    <td>${Number(p.myTopBid ?? 0).toFixed(2)}</td>
                    <td>${Number(p.topBid ?? 0).toFixed(2)}</td>
                    <td><span className="badge">{p.auction.status}</span></td>
                    <td><Badge t={p.outcome} /></td>
                  </tr>
                ))}
                {parts.length === 0 && (<tr><td colSpan="6" style={{ padding: 12, textAlign: 'center' }}>No bids yet</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h2 className="title" style={{ fontSize: 22 }}>Your Listings</h2>
        <p className="subtitle">Manage auctions you created.</p>
        <div className="toolbar" style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '10px 0' }}>
          <input className="input" placeholder="Search your titles…" value={q} onChange={(e)=>setQ(e.target.value)} />
          <button className="btn btn-ghost" onClick={()=>fetchMine(1)}>Filter</button>
          <Link to="/auctions/new" className="btn btn-primary" style={{ marginLeft: 'auto' }}>+New </Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Listing</th><th>Ends</th><th>Price</th><th>Status</th><th style={{ width: 160 }}>Actions</th></tr></thead>
            <tbody>
              {my.items.map((a) => (
                <tr key={a._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {a.imageUrl ? <img alt="" src={`${axios.defaults.baseURL}${a.imageUrl}`} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} /> : <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,.06)', borderRadius: 8 }} />}
                      <div><Link to={`/auctions/${a._id}`} style={{ fontWeight: 600 }}>{a.title}</Link><div style={{ fontSize: 12, color: 'var(--muted)' }}>Created by you</div></div>
                    </div>
                  </td>
                  <td>{new Date(a.endDate).toLocaleString()}</td>
                  <td>${Number(a.currentPrice ?? a.startingPrice ?? 0).toFixed(2)}</td>
                  <td><span className="badge">{a.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link className="btn btn-ghost" to={`/auctions/${a._id}/edit`}>Edit</Link>
                      <button className="btn btn-danger" onClick={async()=>{ if(!window.confirm('Delete this listing?')) return; try{ await axios.delete(`/api/auctions/${a._id}`, { headers: { Authorization: `Bearer ${user.token}` } }); fetchMine(my.page);} catch(e){ alert(e?.response?.data?.message || 'Delete failed'); } }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {my.items.length === 0 && (<tr><td colSpan="5" style={{ padding: 12, textAlign: 'center' }}>No listings yet</td></tr>)}
            </tbody>
          </table>
        </div>
        <div className="toolbar" style={{ justifyContent: 'space-between', marginTop: 10 }}>
          <button className="btn" disabled={my.page <= 1} onClick={()=>fetchMine(my.page - 1)}>Prev</button>
          <span className="subtitle">Page {my.page} / {my.pages}</span>
          <button className="btn" disabled={my.page >= my.pages} onClick={()=>fetchMine(my.page + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}
