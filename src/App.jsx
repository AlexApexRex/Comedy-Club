import { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import ClipCard from './components/ClipCard';
import VotePanel from './components/VotePanel';
import SubmitClip from './components/SubmitClip';
import Hero from './components/Hero';
import Admin from './pages/Admin';
import Landing from './pages/Landing';

import { useAuth } from './context/AuthContext';

function Home() {
  return (
    <div className="mx-auto max-w-6xl p-4 space-y-4">
      <Hero />
      <SubmitClip />
    </div>
  );
}

function Feed() {
  return (
    <div className="mx-auto max-w-6xl p-4 space-y-4">
      <h2 className="text-xl font-semibold">Clip Feed</h2>
      <p className="text-sm text-slate-600">
        Approved submissions appear here.
      </p>

      {/* (your ClipCard + VotePanel logic stays here later) */}
    </div>
  );
}

function AuthModal({ onClose, onGuest }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (mode === 'signup') {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      onClose();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-3">

        <h2 className="text-lg font-bold">
          Join the Comedy Club
        </h2>

        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            className="w-full border p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-slate-900 text-white py-2 rounded">
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <button
          className="text-sm underline"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        >
          Switch to {mode === 'login' ? 'Sign Up' : 'Sign In'}
        </button>

        <button
          className="w-full border py-2 rounded"
          onClick={onGuest}
        >
          Continue as Guest
        </button>

        <button className="text-xs text-gray-500" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState('landing'); 
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <Header />

      {/* STEP 1: LANDING PAGE */}
      {stage === 'landing' && (
        <Landing onContinue={() => {
          setStage('app');
          setShowModal(true);
        }} />
      )}

      {/* STEP 2: MAIN APP */}
      {stage === 'app' && (
        <>
          <nav className="mx-auto max-w-6xl p-4 text-sm space-x-4">
            <button onClick={() => setStage('feed')}>Feed</button>
            <button onClick={() => setStage('home')}>Home</button>
            <Link to="/admin">Admin</Link>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </>
      )}

      {stage === 'feed' && <Feed />}

      {/* LOGIN POPUP */}
      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          onGuest={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
