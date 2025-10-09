
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
const derivedStatus = (a) => (a?.endDate && new Date(a.endDate) <= new Date() ? 'ENDED' : (a?.status || 'ACTIVE'));
const fmt = (n) => (isNaN(n) ? '-' : new Intl.NumberFormat(undefined, { style: 'currency', currency: 'AUD' }).format(Number(n || 0)));
export default function Auctions() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [q, setQ] = useState(''); const [status, setStatus] = useState(''); const [sort, setSort] = useState('createdAt_desc');
  const [loading, setLoading] = useState(false); const { user } = useAuth(); const nav = useNavigate(); const cRef = useRef(null);
  const fetchList = async (page = 1, signal) => {
    setLoading(true);
    try { const r = await axios.get('/api/auctions', { params: { q, status, sort, page, limit: 10 }, signal }); setData(r.data); }
    catch (e) { if (e?.name !== 'CanceledError' && e?.code !== 'ERR_CANCELED') alert(e?.response?.data?.message || 'Failed to load auctions'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchList(1); }, []);
  useEffect(() => { cRef.current?.abort?.(); const c = new AbortController(); cRef.current = c; const t = setTimeout(() => fetchList(1, c.signal), 250); return () => { clearTimeout(t); c.abort(); }; }, [q, status, sort]);
  const del = async (id) => {
    if (!user?.token) { alert('Login required'); nav('/login'); return; }
    if (!window.confirm('Delete this auction?')) return;
    try { await axios.delete(`/api/auctions/${id}`, { headers: { Authorization: `Bearer ${user.token}` } }); fetchList(data.page); }
    catch (e) { alert(e?.response?.data?.message || 'Delete failed'); }
  };
  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div><h1 className="title">Auctions</h1><div className="subtitle">Search, filter, and bid in real‑time.</div></div>
        <Link to="/auctions/new" className="btn btn-primary">+ New Auction</Link>
      </div>
      <div className="toolbar" style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '14px 0' }}>
        <input className="input" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search title…" />
        <select className="select" value={status} onChange={(e)=>setStatus(e.target.value)}>
          <option value="">All</option><option value="ACTIVE">Active</option><option value="ENDED">Ended</option>
        </select>
        <select className="select" value={sort} onChange={(e)=>setSort(e.target.value)}>
          <option value="createdAt_desc">Newest</option><option value="createdAt_asc">Oldest</option>
          <option value="currentPrice_desc">Price (high → low)</option><option value="currentPrice_asc">Price (low → high)</option>
          <option value="endDate_asc">Ending Soon</option>
        </select>
        <button className="btn btn-ghost" onClick={()=>fetchList(1)}>Filter</button>
      </div>
      {loading ? (<div className="card">Loading…</div>) : (
        <div className="table-wrap">
          <table><thead><tr><th>Title</th><th>Current</th><th>Ends</th><th>Status</th><th>Owner</th><th>Actions</th></tr></thead>
            <tbody>
              {data.items.map((a) => (
                <tr key={a._id}>
                  <td><Link to={`/auctions/${a._id}`}>{a.title}</Link></td>
                  <td>{fmt(a.currentPrice)}</td>
                  <td>{new Date(a.endDate).toLocaleString()}</td>
                  <td><span className="badge">{derivedStatus(a)}</span></td>
                  <td>{a.createdBy?.name || '-'}</td>
                  <td>
                    {user && a.createdBy && String(a.createdBy._id) === String(user._id) ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link className="btn btn-ghost" to={`/auctions/${a._id}/edit`}>Edit</Link>
                        <button className="btn btn-danger" onClick={()=>del(a._id)}>Delete</button>
                      </div>
                    ) : (<span style={{ color: 'var(--muted)' }}>—</span>)}
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (<tr><td colSpan="6" style={{ padding: 12, textAlign: 'center' }}>No auctions found</td></tr>)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
