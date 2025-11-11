// app/dashboard/quiz-sets/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { ROUTES } from '@/constants/routes';
import { ChevronLeft, Pencil } from 'lucide-react';

type Quiz = { _id: string; title?: string; name?: string };
type QuizSet = {
  _id: string;
  title: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  quizzes?: Quiz[];
};

export const revalidate = 0;
// Optional: force dynamic (avoids static optimization)
export const dynamic = 'force-dynamic';

// Build absolute base URL from the current request
function getBaseUrl() {
  const h = headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const protocol = h.get('x-forwarded-proto') ?? 'http';
  // Fallback for local dev if headers are missing
  if (!host) return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:4000';
  return `${protocol}://${host}`;
}

async function getQuizSet(id: string): Promise<QuizSet | null> {
  const baseUrl = getBaseUrl();
  const cookie = headers().get('cookie') ?? '';

  const res = await fetch(`${baseUrl}/api/quiz-sets/${id}`, {
    // Forward cookies if your API relies on session/auth
    headers: cookie ? { cookie } : {},
    cache: 'no-store',
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load quiz set');

  const json = await res.json();
  const payload = json?.data?.data ?? json?.data ?? json;
  return payload as QuizSet;
}

export async function generateMetadata({
  params,
}: { params: { id: string } }): Promise<Metadata> {
  try {
    const quizSet = await getQuizSet(params.id);
    if (!quizSet) return { title: 'Quiz Set — Not Found' };
    return {
      title: `${quizSet.title} — Quiz Set`,
      description: quizSet.description ?? 'Quiz set detail',
    };
  } catch {
    return { title: 'Quiz Set — Error' };
  }
}

export default async function QuizSetDetailPage({
  params,
}: { params: { id: string } }) {
  const quizSet = await getQuizSet(params.id);
  if (!quizSet) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#444444]">{quizSet.title}</h1>
          {quizSet.description ? (
            <p className="text-gray-500 mt-1">{quizSet.description}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={ROUTES.DASHBOARD.QUIZ_SETS.EDIT(quizSet._id)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded bg-[#0890A8] text-white hover:opacity-90"
          >
            <Pencil size={16} strokeWidth={2} />
            Edit
          </Link>

          <Link
            href={ROUTES.DASHBOARD.QUIZ_SETS.ROOT}
            className="inline-flex items-center gap-2 px-3 py-2 rounded border text-gray-700 hover:text-[#0890A8] hover:border-[#0890A8]"
          >
            <ChevronLeft size={16} strokeWidth={2} />
            Back to Quiz Sets
          </Link>
        </div>
      </div>

      {(quizSet.createdAt || quizSet.updatedAt) && (
        <div className="text-sm text-gray-500">
          {quizSet.createdAt && (
            <span>Created: {new Date(quizSet.createdAt).toLocaleString()}</span>
          )}
          {quizSet.updatedAt && (
            <span className="ml-4">
              Updated: {new Date(quizSet.updatedAt).toLocaleString()}
            </span>
          )}
        </div>
      )}

      {Array.isArray(quizSet.quizzes) && (
        <section>
          <h2 className="text-xl font-medium text-[#444444] mb-4">Quizzes</h2>
          {quizSet.quizzes.length ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {quizSet.quizzes.map((q) => (
                <li key={q._id} className="p-4 rounded border hover:border-[#0890A8]">
                  <div className="font-medium text-[#444444]">
                    {q.title ?? q.name ?? q._id}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500">No quizzes in this set.</div>
          )}
        </section>
      )}
    </div>
  );
}