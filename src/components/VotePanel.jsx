import { useState } from 'react';
import { castVote } from '../lib/firestore';
import { useAuth } from '../context/AuthContext';

export default function VotePanel({ submissionId }) {
  const { user, signInGoogle } = useAuth();
  const [msg, setMsg] = useState('');

  async function vote() {
    try {
      if (!user) {
        await signInGoogle();
      }
      await castVote(submissionId, 'current');
      setMsg('Vote cast successfully.');
    } catch (err) {
      setMsg(err?.message || 'Could not cast vote.');
    }
  }

  return (
    <div className="mt-3 flex items-center gap-3">
      <button className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition duration-200 hover:bg-emerald-700" onClick={vote}>Hall-of-Fame vote</button>
      {msg && <span className="text-xs text-slate-600">{msg}</span>}
    </div>
  );
}
