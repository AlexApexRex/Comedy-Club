import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LandingAuth() {
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState('login'); // login | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');

    try {
      if (mode === 'signup') {
        await signUp(email, password);
        setMsg('Account created. Check your email for verification.');
      } else {
        await signIn(email, password);
        setMsg('Welcome back!');
      }
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="text-xl font-bold mb-4">
          LOHS Comedy Club
        </h1>

        <p className="text-sm text-slate-600 mb-4">
          {mode === 'login'
            ? 'Sign in to continue'
            : 'Create an account to join the club'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-slate-900 text-white py-2 rounded">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <button
          className="mt-3 text-sm underline"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        >
          {mode === 'login'
            ? 'Need an account? Sign up'
            : 'Already have an account? Sign in'}
        </button>

        {msg && <p className="mt-3 text-sm text-slate-600">{msg}</p>}
      </div>
    </div>
  );
}
