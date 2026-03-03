import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Storefront from './pages/Storefront';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans relative">
        <Navbar />
        <main className="flex-grow z-10 pt-20">
          <Routes>
            <Route path="/" element={<Storefront />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
        <footer className="bg-primary-900 text-white/80 py-8 text-center">
          <p className="text-sm">© {new Date().getFullYear()} Rangitva. All rights reserved.</p>
          <p className="text-xs mt-2 text-white/50">Handmade Art • Graphic Design • Animation • Craft</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
