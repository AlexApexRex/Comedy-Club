import { useMemo } from 'react';

function getYouTubeId(url) {
  try {
    const u = new URL(url);

    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    if (u.pathname.includes('/shorts/')) return u.pathname.split('/shorts/')[1];

    return u.searchParams.get('v');
  } catch {
    return null;
  }
}

export default function ClipCard({ clip, votes = 0 }) {
  const videoId = useMemo(() => getYouTubeId(clip.url), [clip.url]);

  return (
    <article className="rounded-xl bg-white p-4 shadow">

      <div className="flex justify-between">
        <h4 className="font-semibold">{clip.title}</h4>
        <span className="text-sm">Votes: {votes}</span>
      </div>

      <p className="text-sm text-slate-600">
        By {clip.submitterName || 'Anonymous'}
      </p>

      {/* 🎬 REAL YOUTUBE PREVIEW (no fake overlay) */}
      {videoId ? (
        <div className="mt-3 aspect-video w-full rounded-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={clip.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <a
          className="text-blue-600 underline mt-3 inline-block"
          href={clip.url}
          target="_blank"
          rel="noreferrer"
        >
          Open Clip
        </a>
      )}

      {clip.notes && (
        <p className="mt-2 text-sm text-slate-700">
          {clip.notes}
        </p>
      )}

      {clip.tags?.length > 0 && (
        <p className="mt-2 text-xs text-slate-500">
          Tags: {clip.tags.join(', ')}
        </p>
      )}
    </article>
  );
}
