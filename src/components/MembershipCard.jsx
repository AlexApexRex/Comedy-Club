function firstValidWednesday(closureDates = []) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const closed = new Set(closureDates);

  for (let day = 1; day <= 14; day++) {
    const d = new Date(Date.UTC(year, month, day));
    if (d.getUTCDay() === 3) {
      const iso = d.toISOString().slice(0, 10);
      if (!closed.has(iso)) return d;
    }
  }
  return new Date(Date.UTC(year, month, 1));
}

export default function MembershipCard({ siteConfig }) {
  const next = siteConfig?.nextMeetingISO ? new Date(siteConfig.nextMeetingISO) : firstValidWednesday(siteConfig?.schoolClosedDates || []);

  return (
    <section className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-xl backdrop-blur">
      <h3 className="text-xl font-semibold text-slate-900">Become a Member</h3>
      <p className="mt-2 text-sm text-slate-600">Join monthly sessions, share analysis, and vote in Hall-of-Fame selection.</p>
      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="font-semibold text-slate-800">Meeting time</dt>
          <dd className="text-slate-600">{next.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} (first available Wednesday)</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-800">Location</dt>
          <dd className="text-slate-600">Room P206 — Mr. Romero's classroom, 2nd floor east end of P building.</dd>
        </div>
      </dl>
    </section>
  );
}
