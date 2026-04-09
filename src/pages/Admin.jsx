import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { user } = useAuth();
  const isAdmin = useMemo(() => !!user?.email?.endsWith('@lohschools.org'), [user]);

  if (!user) return <p className="p-6">Please sign in to access admin tools.</p>;
  if (!isAdmin) return <p className="p-6">Admin access required.</p>;

  return (
    <section className="rounded-xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold">Admin queue</h2>
      <p className="text-slate-600 mt-2">Approve, feature, and delete actions should be wired to callable functions or admin-only writes.</p>
      <ul className="mt-4 list-disc pl-5 text-sm text-slate-700">
        <li>Approve pending submissions</li>
        <li>Feature clip of the month</li>
        <li>Remove unfit content</li>
      </ul>
    </section>
  );
}
