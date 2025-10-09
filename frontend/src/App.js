
import { Routes, Route } from 'react-router-dom';
import Auth from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Protected from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Auctions from './pages/Auctions';
import AuctionForm from './pages/AuctionForm';
import AuctionView from './pages/AuctionView';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
export default function App() {
  return (
    <Auth>
      <div className="layout">
        <Navbar />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/auctions/:id" element={<AuctionView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auctions/new" element={<Protected><AuctionForm /></Protected>} />
            <Route path="/auctions/:id/edit" element={<Protected><AuctionForm /></Protected>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Auth>
  );
}
