export default function Hero({ siteConfig }) {
  const nextMeeting = siteConfig?.nextMeetingISO ? new Date(siteConfig.nextMeetingISO).toLocaleString() : 'First Wednesday monthly';
  return (
    <section className="rounded-3xl border border-white/50 bg-white/75 p-6 shadow-2xl backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Comedy Club</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Comedy Club Preamble.</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">We the Students of Los Osos High, in Order to form a more spirited and united Club, establish Justice and fair Governance, insure the Continuity of Leadership and the safe Conduct of our Activities, provide for the mutual Support and Development of Members, promote the general Welfare and Enjoyment of the School Community, and secure the Blessings of Humor, Confidence, and Fellowship to ourselves and our Posterity, do ordain and establish this Website for the Comedy Club.</p>
      <div className="mt-5 inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">Next meeting: {nextMeeting}</div>
    </section>
  );
}
