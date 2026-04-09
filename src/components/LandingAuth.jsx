import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LandingAuth({ onContinueGuest }) {
  const { signInGoogle, signUpEmail, signInEmail, isFirebaseConfigured } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', displayName: '' });
  const [msg, setMsg] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    try {
      if (!isFirebaseConfigured) {
        setMsg('Firebase is not configured; use Continue as guest for now.');
        return;
      }
      if (mode === 'signup') {
        await signUpEmail(form);
        setMsg('Account created. Please acknowledge guidelines next.');
      } else {
        await signInEmail(form);
      }
    } catch (err) {
      setMsg(err?.message || 'Could not complete authentication.');
    }
  }

  return (
    <section className="grid gap-6 rounded-3xl border border-white/40 bg-white/75 p-6 shadow-2xl backdrop-blur-xl md:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Welcome</p>
        <h2 className="mt-2 text-3xl font-semibold leading-tight text-slate-900">Share, analyze, and vote on the best clean comedy clips.</h2>
        <p className="mt-3 text-sm text-slate-600">Built for LOHS meetings: curated submissions, meaningful analysis, and fair Hall-of-Fame voting.</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90" onClick={signInGoogle}>Continue with Google</button>
          <button className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100" onClick={onContinueGuest}>Continue as guest</button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <div className="mb-3 flex gap-2 text-xs">
          <button type="button" className={`rounded-full px-3 py-1 ${mode === 'login' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`} onClick={() => setMode('login')}>Log in</button>
          <button type="button" className={`rounded-full px-3 py-1 ${mode === 'signup' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`} onClick={() => setMode('signup')}>Sign up</button>
        </div>

        {mode === 'signup' && (
          <input className="mb-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Display name" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
        )}
        <input className="mb-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />

        <button className="mt-3 w-full rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700" type="submit">
          {mode === 'signup' ? 'Create account' : 'Log in'}
        </button>
        {msg && <p className="mt-2 text-xs text-slate-600">{msg}</p>}
      </form>
    </section>
  );
}
