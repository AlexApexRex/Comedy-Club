import { useState } from 'react';
import { createSubmission } from '../lib/firestore';
import { useAuth } from '../context/AuthContext';

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function SubmitClip() {
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', url: '', notes: '', tags: '', submitterName: '' });
  const [msg, setMsg] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    if (!isValidUrl(form.url)) {
      setMsg('Please enter a valid URL.');
      return;
    }

    await createSubmission({
      title: form.title.trim(),
      url: form.url.trim(),
      notes: form.notes.trim(),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      submitterId: user?.uid || null,
      submitterName: user?.displayName || form.submitterName.trim() || 'Anonymous',
      analysis: '',
    });

    setForm({ title: '', url: '', notes: '', tags: '', submitterName: '' });
    setMsg('Submission received. It will appear after moderation approval.');
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-xl backdrop-blur">
      <h3 className="text-xl font-semibold text-slate-900">Share a clip</h3>
      <p className="mt-1 text-sm text-slate-600">Submit links for review. Voting and publishing remain moderated.</p>
      <div className="mt-4 grid gap-3">
        {!user && (
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="Your name"
            value={form.submitterName}
            onChange={(e) => setForm({ ...form, submitterName: e.target.value })}
          />
        )}
        <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" required placeholder="https://..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        <textarea className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" placeholder="tags, comma, separated" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-slate-800">Submit clip</button>
        {msg && <p className="text-xs text-slate-600">{msg}</p>}
      </div>
    </form>
  );
}
