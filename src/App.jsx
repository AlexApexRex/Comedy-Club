import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Hero from './components/Hero';
import SubmitClip from './components/SubmitClip';
import ClipCard from './components/ClipCard';
import VotePanel from './components/VotePanel';

import Admin from './pages/Admin';

import LandingAuth from './components/LandingAuth';
import { useAuth } from './context/AuthContext';

import {
  getApprovedSubmissions,
  getSiteConfig,
  getVoteTotals
} from './lib/firestore';

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
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  // 🔐 LOGIN GATE (this is what makes it feel like a real app)
  if (!user) {
    return <LandingAuth />;
  }

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
    </div>
  );
}
