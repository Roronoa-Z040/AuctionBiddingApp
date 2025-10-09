
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
export default function AuctionForm() {
  const { id } = useParams();
  const isEdit = Boolean(id?.match(/^[a-f\d]{24}$/i));
  const [form, setForm] = useState({ title: '', description: '', startingPrice: '', endDate: '' });
  const [file, setFile] = useState(null);
  const { user } = useAuth(); const nav = useNavigate();
  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/auctions/${id}`).then((r) => {
        const a = r.data;
        setForm({ title: a.title || '', description: a.description || '', startingPrice: String(a.startingPrice ?? a.currentPrice ?? 0), endDate: new Date(a.endDate).toISOString().slice(0, 16) });
      });
    }
  }, [id, isEdit]);
  const submit = async (e) => {
    e.preventDefault();
    if (!user?.token) { alert('Login required'); nav('/login'); return; }
    try {
      let payload; let headers = { Authorization: `Bearer ${user.token}` };
      if (file) { payload = new FormData(); payload.append('title', form.title.trim()); payload.append('description', form.description.trim()); payload.append('startingPrice', String(parseFloat(form.startingPrice))); payload.append('endDate', new Date(form.endDate).toISOString()); payload.append('image', file); headers['Content-Type'] = 'multipart/form-data'; }
      else { payload = { title: form.title.trim(), description: form.description.trim(), startingPrice: parseFloat(form.startingPrice), endDate: new Date(form.endDate) }; }
      if (isEdit) await axios.put(`/api/auctions/${id}`, payload, { headers }); else await axios.post(`/api/auctions`, payload, { headers });
      nav('/auctions');
    } catch (e) { alert(e?.response?.data?.message || 'Save failed'); }
  };
  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <div className="card">
        <h1 className="title">{isEdit ? 'Edit Auction' : 'New Auction'}</h1>
        <form onSubmit={submit} className="grid">
          <input className="input" placeholder="Title" value={form.title} onChange={(e)=>setForm({ ...form, title: e.target.value })} required />
          <textarea className="textarea" placeholder="Description" value={form.description} onChange={(e)=>setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-2">
            <input className="input" placeholder="Starting Price" type="number" value={form.startingPrice} onChange={(e)=>setForm({ ...form, startingPrice: e.target.value })} required />
            <input className="input" placeholder="End Date" type="datetime-local" value={form.endDate} onChange={(e)=>setForm({ ...form, endDate: e.target.value })} required />
          </div>
          <div className="grid">
            <label style={{ color: 'var(--muted)' }}>Image (optional)</label>
            <input className="input" type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
          </div>
          <button className="btn btn-primary" type="submit">{isEdit ? 'Update' : 'Create'}</button>
        </form>
      </div>
    </div>
  );
}
