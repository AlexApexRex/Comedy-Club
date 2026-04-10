import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Hero from './components/Hero';
import SubmitClip from './components/SubmitClip';
import ClipCard from './components/ClipCard';
import VotePanel from './components/VotePanel';
import Admin from './pages/Admin';

import { useAuth } from './context/AuthContext';
import {
  getApprovedSubmissions,
  getSiteConfig,
  getVoteTotals
} from './lib/firestore';

function AuthModal({ user, onClose, onGuest }) {
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (user) return null;

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
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-2">
          Join LOHS Comedy Club
        </h2>

        <p className="text-sm text-slate-600 mb-4">
          Sign in, create an account, or continue as guest.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
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
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <button
          className="mt-3 text-sm underline"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        >
          {mode === 'login'
            ? 'Need account? Sign up'
            : 'Already have account? Sign in'}
        </button>

        <button
          className="mt-4 w-full border py-2 rounded"
          onClick={onGuest}
        >
          Continue as Guest
        </button>

        <button
          className="mt-2 text-xs text-slate-500 w-full"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

function Home() {
  const [siteConfig, setSiteConfig] = useState({});
  const [clips, setClips] = useState([]);
  const [votes, setVotes] = useState({});
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('all');

  useEffect(() => {
    getSiteConfig().then(setSiteConfig);
    getApprovedSubmissions().then(setClips);
    getVoteTotals().then(setVotes);
  }, []);

  const tags = useMemo(
    () => ['all', ...new Set(clips.flatMap((c) => c.tags || []))],
    [clips]
  );

  const filtered = useMemo(() => {
    return clips.filter((c) => {
      const hitTag = tag === 'all' || (c.tags || []).includes(tag);
      const q = search.toLowerCase();

      const hitSearch =
        !q ||
        c.title?.toLowerCase().includes(q) ||
        c.notes?.toLowerCase().includes(q);

      return hitTag && hitSearch;
    });
  }, [clips, search, tag]);

  return (
    <main className="mx-auto max-w-6xl p-4 space-y-4">
      <Hero siteConfig={siteConfig} />

      <SubmitClip />

      <section className="rounded-xl bg-white p-4 shadow">
        <div className="flex flex-wrap gap-2 items-center">
          <input
            className="rounded border p-2"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="rounded border p-2"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-4">
        {filtered.map((clip) => (
          <div key={clip.id}>
            <ClipCard clip={clip} votes={votes[clip.id] || 0} />
            <VotePanel submissionId={clip.id} />
          </div>
        ))}
      </section>
    </main>
  );
}

export default function App() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(true);

  return (
    <div>
      <Header />

      <nav className="mx-auto max-w-6xl p-4 text-sm text-slate-700 space-x-4">
        <Link to="/">Home</Link>
        <Link to="/admin">Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      <footer className="mx-auto max-w-6xl p-4 text-xs text-slate-500">
        Built with React, Tailwind, and Firebase.
      </footer>

      {/* 🔥 POPUP LOGIN */}
      {showModal && (
        <AuthModal
          user={user}
          onClose={() => setShowModal(false)}
          onGuest={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
