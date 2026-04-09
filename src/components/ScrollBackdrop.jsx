import { useEffect, useState } from 'react';

export default function ScrollBackdrop() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const max = document.body.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        setProgress(p);
        raf = null;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const layerStyle = {
    transform: `translateY(${progress * -60}px) scale(${1 + progress * 0.04})`,
    opacity: 0.35 + progress * 0.25,
  };

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-slate-50 to-white" />
      <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200 via-fuchsia-200 to-cyan-200 blur-3xl transition-transform duration-300" style={layerStyle} />
      <div className="absolute bottom-[-20%] right-[-10%] h-80 w-80 rounded-full bg-emerald-200/50 blur-3xl transition-all duration-300" style={{ opacity: 0.2 + progress * 0.35 }} />
    </div>
  );
}
