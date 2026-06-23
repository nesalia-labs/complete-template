export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
        DeesseJS · v0.0.1
      </p>
      <h1 className="max-w-2xl text-center text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        The Apple of SaaS templates.
      </h1>
      <p className="mt-6 max-w-xl text-center text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
        Lite instance — Next.js scaffold only. Auth, orgs, and the first feature ship in the next iterations.
      </p>
      <div className="mt-10 flex items-center gap-3 text-sm text-zinc-500">
        <span>Coming soon</span>
        <span aria-hidden>·</span>
        <a
          href="https://deessejs.com"
          className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
        >
          deessejs.com
        </a>
      </div>
    </main>
  );
}