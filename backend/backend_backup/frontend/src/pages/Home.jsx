
import { Link } from 'react-router-dom';
export default function Home() {
  return (
    <div className="container">
      <section className="hero card">
        <h1>Bid smarter. Win more.</h1>
        <p>Discover live auctions, place real‑time bids, and sell your items with ease.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/auctions" className="btn btn-primary">Browse Auctions</Link>
          <Link to="/register" className="btn btn-ghost">Create Account</Link>
        </div>
      </section>
    </div>
    
  );
}
