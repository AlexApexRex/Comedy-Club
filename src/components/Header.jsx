import { useAuth } from '../context/AuthContext';

function initials(nameOrEmail) {
  if (!nameOrEmail) return 'G';
  const parts = nameOrEmail.split(' ').filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return nameOrEmail.slice(0, 2).toUpperCase();
}

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/30 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">LOHS</p>
          <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">Comedy Analysis Hub</h1>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white shadow-sm">
                {initials(user.displayName || user.email || 'Member')}
                <span
                  className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white bg-emerald-500 text-[10px] text-white"
                  title="Verified club member"
                  aria-label="Verified club member"
                >
                  ✓
                </span>
              </div>
              <button className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Guest mode</span>
          )}
        </div>
      </div>
    </header>
  );
}
