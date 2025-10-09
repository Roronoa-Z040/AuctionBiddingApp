
import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container" style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: 8 }}>© {new Date().getFullYear()} Online Auction. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginBottom: '8px' }}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook" /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-x-twitter" /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram" /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin" /></a>
        </div>
      </div>
    </footer>
  );
}
