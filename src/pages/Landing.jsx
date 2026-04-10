export default function Landing({ onContinue }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="max-w-2xl bg-white rounded-xl shadow p-8 text-center space-y-4">

        <h1 className="text-3xl font-bold">
          LOHS Comedy Analysis Hub
        </h1>

        <p className="text-slate-600">
          A school comedy club platform for analyzing timing, structure,
          and performance through curated clips.
        </p>

        <p className="text-sm text-slate-500">
          Built for Chaffey Joint Union High School District club activities.
        </p>

        <button
          onClick={onContinue}
          className="mt-4 bg-slate-900 text-white px-5 py-2 rounded"
        >
          Enter Site
        </button>
      </div>
    </div>
  );
}
