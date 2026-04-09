import { useMemo, useState } from 'react';

function getYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/')[2];
    return u.searchParams.get('v');
  } catch {
    return null;
  }
}

export default function ClipCard({ clip, votes = 0 }) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [play, setPlay] = useState(false);
  const youTubeId = useMemo(() => getYouTubeId(clip.url), [clip.url]);

  return (
    <article className="rounded-xl bg-white p-4 shadow">
      <div className="flex justify-between gap-4">
        <h4 className="font-semibold">{clip.title}</h4>
        <span className="text-sm">Votes: {votes}</span>
      </div>
      <p className="text-sm text-slate-600">By {clip.submitterName || 'Anonymous'} • Views {clip.viewCount || 0}</p>

      {youTubeId ? (
        <div className="mt-3 embed-shell">
          {play ? (
            <iframe
              loading="lazy"
              src={`https://www.youtube-nocookie.com/embed/${youTubeId}`}
              title={clip.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button className="h-full w-full bg-slate-200" onClick={() => setPlay(true)}>Play preview</button>
          )}
        </div>
      ) : (
        <a className="mt-3 inline-block text-blue-700 underline" href={clip.url} target="_blank" rel="noreferrer">Open link</a>
      )}

      {clip.tags?.length > 0 && <p className="mt-2 text-xs text-slate-500">Tags: {clip.tags.join(', ')}</p>}
      {clip.notes && <p className="mt-2 text-sm">{clip.notes}</p>}
      <button className="mt-3 text-sm text-slate-700 underline" onClick={() => setShowAnalysis((v) => !v)}>
        {showAnalysis ? 'Hide analysis' : 'Show analysis'}
      </button>
      {showAnalysis && <p className="mt-2 rounded bg-slate-100 p-2 text-sm">{clip.analysis || 'Template: setup, misdirection, callback, crowd reaction.'}</p>}
    </article>
  );
}
