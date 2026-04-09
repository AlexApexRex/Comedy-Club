export default function Hero({ siteConfig }) {
  const nextMeeting = siteConfig?.nextMeetingISO ? new Date(siteConfig.nextMeetingISO).toLocaleString() : 'First Wednesday monthly';
  return (
    <section className="rounded-3xl border border-white/50 bg-white/75 p-6 shadow-2xl backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Club Mission</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Understand why comedy works.</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Analyze structure, timing, tone, and delivery through curated clips. Build your humor literacy while keeping everything school-appropriate.</p>
      <div className="mt-5 inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">Next meeting: {nextMeeting}</div>
    </section>
  );
}
