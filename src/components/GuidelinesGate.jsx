import { useMemo, useState } from 'react';

export default function GuidelinesGate({ user, onAck }) {
  const [checked, setChecked] = useState(false);
  const key = useMemo(() => `guidelines_ack_${user?.uid}`, [user]);

  function acknowledge() {
    if (!checked) return;
    localStorage.setItem(key, '1');
    onAck();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
      <div className="w-[min(92vw,560px)] rounded-3xl bg-white p-6 shadow-2xl">
        <h3 className="text-xl font-semibold">Community guidelines</h3>
        <p className="mt-2 text-sm text-slate-600">Before continuing, confirm you understand all submissions must be school-appropriate, respectful, and safe for campus meetings.</p>
        <label className="mt-4 flex items-start gap-2 text-sm text-slate-700">
          <input className="mt-1" type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          I understand and agree to follow the Comedy Analysis Hub guidelines.
        </label>
        <button className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50" disabled={!checked} onClick={acknowledge}>Continue to hub</button>
      </div>
    </div>
  );
}
