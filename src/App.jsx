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

function LandingScreen({ onGuestEnter, onMemberEnter }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.18),_transparent_45%),linear-gradient(180deg,_#0f172a_0%,_#111827_48%,_#f8fafc_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.28em] text-white/80">
              LOHS Comedy Club
            </p>

            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Official LOHS Comedy Club Website.
            </h1>

            <p className="max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
              Start as a guest, or sign in to participate.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onGuestEnter}
                className="rounded-2xl bg-white px-5 py-3 font-medium text-slate-950 shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
              >
                Continue as guest
              </button>

              <button
                onClick={onMemberEnter}
                className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 font-medium text-white backdrop-blur transition hover:bg-white/15"
              >
                Sign in
              </button>
            </div>

            <p className="text-sm text-slate-300">
              Guest mode keeps browsing open. Sign in unlocks voting and club tools.
            </p>
          </section>

          <aside className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">What visitors see first</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-100">
                  <li>Guest / sign in / admin entry</li>
                  <li>A short intro instead of a crowded page</li>
                  <li>A cleaner path to the clip feed</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-slate-950/40 p-4 text-sm text-slate-100">
                <p className="font-medium">Club meeting</p>
                <p className="mt-1 text-slate-300">
                  First available Wednesday of the month in Room P206, Mr. Romero’s classroom.
                </p>
              </div>
            </div>
          </aside>
        </div>
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

  const tags = useMemo(() => ['all', ...new Set(clips.flatMap((c) => c.tags || []))], [clips]);

  const filtered = useMemo(
    () =>
      clips.filter((c) => {
        const hitTag = tag === 'all' || (c.tags || []).includes(tag);
        const q = search.toLowerCase();
        const hitSearch =
          !q || c.title?.toLowerCase().includes(q) || c.notes?.toLowerCase().includes(q);
        return hitTag && hitSearch;
      }),
    [clips, search, tag]
  );

  return (
    <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
      <Hero siteConfig={siteConfig} />

      <SubmitClip />

      <section className="rounded-2xl bg-white p-4 shadow">
        <div className="flex flex-wrap items-center gap-2">
          <input
            className="rounded-lg border border-slate-200 p-2 outline-none focus:border-slate-400"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="rounded-lg border border-slate-200 p-2 outline-none focus:border-slate-400"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            {tags.map((t) => (
              <option key={t}>{t}</option>
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
  const { user, signIn } = useAuth();
  const [entered, setEntered] = useState(() => localStorage.getItem('lohs-entered') === 'true');
  const [mode, setMode] = useState(() => localStorage.getItem('lohs-mode') || '');

  useEffect(() => {
    if (entered) {
      localStorage.setItem('lohs-entered', 'true');
      localStorage.setItem('lohs-mode', mode);
    } else {
      localStorage.removeItem('lohs-entered');
      localStorage.removeItem('lohs-mode');
    }
  }, [entered, mode]);

  const goGuest = () => {
    setMode('guest');
    setEntered(true);
  };

  const goSignIn = async () => {
    await signIn();
    setMode('member');
    setEntered(true);
  };

  if (!entered) {
    return <LandingScreen onGuestEnter={goGuest} onMemberEnter={goSignIn} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-xs text-slate-500">
        <p>{mode === 'guest' ? 'Guest mode' : user ? 'Signed in' : 'Welcome'}</p>
        <nav className="flex gap-4 text-sm">
          <Link className="hover:text-slate-950" to="/">
            Home
          </Link>
          <Link className="hover:text-slate-950" to="/admin">
            Admin
          </Link>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      <footer className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500">
        Built with React, Tailwind, and Firebase.
      </footer>
    </div>
  );
}
