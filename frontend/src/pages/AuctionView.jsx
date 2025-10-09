
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../axiosConfig';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
const derive = (a) => (a?.endDate && new Date(a.endDate) <= new Date() ? 'ENDED' : (a?.status || 'ACTIVE'));
export default function AuctionView() {
  const { id } = useParams();
  const [a, setA] = useState(null); const [bids, setBids] = useState([]); const [amt, setAmt] = useState(''); const { user } = useAuth();
  useEffect(() => { axios.get(`/api/auctions/${id}`).then((r)=>setA(r.data)); axios.get(`/api/auctions/${id}/bids`).then((r)=>setBids(r.data)); }, [id]);
  useEffect(() => { const s = io(axios.defaults.baseURL); s.emit('room:auction', id); s.on('bid:new', (p) => { if (p.auctionId === id) setBids((prev)=>[{ amount: p.amount, bidder: { name: 'Bidder' }, createdAt: p.at }, ...prev]); }); return () => s.disconnect(); }, [id]);
  const bid = async () => {
    if (!user?.token) return alert('Login required');
    const amount = parseFloat(amt); if (isNaN(amount)) return alert('Enter amount');
    try { await axios.post(`/api/auctions/${id}/bids`, { amount }, { headers: { Authorization: `Bearer ${user.token}` } }); setAmt(''); const nx = await axios.get(`/api/auctions/${id}`); setA(nx.data); } catch (e) { alert(e?.response?.data?.message || 'Bid failed'); }
  };
  if (!a) return (<div className="container"><div className="card">Loading…</div></div>);
  const isOwner = user && a.createdBy && String(a.createdBy._id) === String(user._id);
  return (
    <div className="container" style={{ maxWidth: 920 }}>
      <div className="grid grid-2">
        <div className="card">
          {isOwner && <div style={{ marginBottom: 10 }}><Link className="btn btn-ghost" to={`/auctions/${a._id}/edit`}>Edit listing</Link></div>}
          <h1 className="title">{a.title}</h1>
          {a.imageUrl && <img className="detail-img" src={`${axios.defaults.baseURL}${a.imageUrl}`} alt="" />}
          <p style={{ marginTop: 10 }}>{a.description}</p>
          <div className="kpis" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div className="kpi"><div className="label">Current</div><div className="value">${a.currentPrice?.toFixed?.(2) ?? a.currentPrice}</div></div>
            <div className="kpi"><div className="label">Ends</div><div className="value">{new Date(a.endDate).toLocaleString()}</div></div>
            <div className="kpi"><div className="label">Status</div><div className="value">{derive(a)}</div></div>
          </div>
        </div>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Place a bid</div>
          <div className="grid grid-2">
            <input className="input" placeholder="Amount" value={amt} onChange={(e)=>setAmt(e.target.value)} />
            <button className="btn btn-primary" onClick={bid}>Bid</button>
          </div>
          <div style={{ marginTop: 16, fontWeight: 700 }}>Recent bids</div>
          <div className="grid" style={{ marginTop: 8 }}>
            {bids.length === 0 && <div className="card">No bids yet</div>}
            {bids.map((b,i)=>(
              <div key={i} className="card" style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span><b>{b.bidder?.name || 'Bidder'}</b></span>
                  <span>${b.amount}</span>
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 12 }}>{new Date(b.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
