import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import SubmitClip from './components/SubmitClip';
import ClipCard from './components/ClipCard';
import VotePanel from './components/VotePanel';
import Admin from './pages/Admin';
import { getApprovedSubmissions, getSiteConfig, getVoteTotals } from './lib/firestore';
import { useAuth } from './context/AuthContext';
import LandingAuth from './components/LandingAuth';
import GuidelinesGate from './components/GuidelinesGate';
import MembershipCard from './components/MembershipCard';
import CookieConsent from './components/CookieConsent';
import ScrollBackdrop from './components/ScrollBackdrop';

function Home() {
  const { user } = useAuth();
  const [siteConfig, setSiteConfig] = useState({});
  const [clips, setClips] = useState([]);
  const [votes, setVotes] = useState({});
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('all');
  const [guestAllowed, setGuestAllowed] = useState(localStorage.getItem('guest_mode') === '1');
  const [guidelinesAck, setGuidelinesAck] = useState(true);

  useEffect(() => {
    getSiteConfig().then(setSiteConfig);
    getApprovedSubmissions().then(setClips);
    getVoteTotals().then(setVotes);
  }, []);

  useEffect(() => {
    if (!user) {
      setGuidelinesAck(true);
      return;
    }
    const key = `guidelines_ack_${user.uid}`;
    setGuidelinesAck(localStorage.getItem(key) === '1');
  }, [user]);

  const tags = useMemo(() => ['all', ...new Set(clips.flatMap((c) => c.tags || []))], [clips]);

  const filtered = useMemo(
    () =>
      clips.filter((c) => {
        const hitTag = tag === 'all' || (c.tags || []).includes(tag);
        const q = search.toLowerCase();
        const hitSearch = !q || c.title?.toLowerCase().includes(q) || c.notes?.toLowerCase().includes(q);
        return hitTag && hitSearch;
      }),
    [clips, search, tag]
  );

  if (!user && !guestAllowed) {
    return (
      <main className="mx-auto max-w-6xl p-4 pt-6">
        <LandingAuth
          onContinueGuest={() => {
            localStorage.setItem('guest_mode', '1');
            setGuestAllowed(true);
          }}
        />
        <MembershipCard siteConfig={siteConfig} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-4 space-y-6 sm:p-6">
      {!guidelinesAck && user && <GuidelinesGate user={user} onAck={() => setGuidelinesAck(true)} />}

      <Hero siteConfig={siteConfig} />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <SubmitClip />
        <div className="space-y-4">
          <MembershipCard siteConfig={siteConfig} />
          <section className="rounded-3xl border border-white/50 bg-white/80 p-4 shadow-xl backdrop-blur">
            <h3 className="text-lg font-semibold text-slate-900">Browse approved clips</h3>
            <div className="mt-3 flex flex-wrap gap-2 items-center">
              <input
                className="min-w-40 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="Search title or notes"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                {tags.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </section>
        </div>
      </section>

      <section className="grid gap-4">
        {filtered.map((clip) => (
          <div key={clip.id} className="rounded-3xl border border-white/30 bg-white/75 p-2 shadow-lg backdrop-blur-sm">
            <ClipCard clip={clip} votes={votes[clip.id] || 0} />
            <VotePanel submissionId={clip.id} />
          </div>
        ))}
      </section>
    </main>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen text-slate-800 antialiased">
      <ScrollBackdrop />
      <Header />
      <nav className="mx-auto max-w-6xl p-4 text-sm text-slate-700 space-x-4 sm:px-6">
        <Link to="/" className="rounded-full px-3 py-1 transition hover:bg-slate-100">Home</Link>
        <Link to="/admin" className="rounded-full px-3 py-1 transition hover:bg-slate-100">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <CookieConsent />
      <footer className="mx-auto max-w-6xl p-4 pb-8 text-xs text-slate-500 sm:px-6">Built with React, Tailwind, and Firebase.</footer>
    </div>
  );
}
