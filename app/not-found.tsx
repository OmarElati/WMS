import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <div
          className="text-[8rem] sm:text-[10rem] font-black leading-none select-none"
          style={{ background: 'linear-gradient(135deg, #60a5fa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-4 mb-2">
          Page introuvable
        </h1>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="btn-primary"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
