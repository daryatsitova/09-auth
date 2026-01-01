import css from './CreateNote.module.css';
import { getTags } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import type { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';

export const metadata: Metadata = {
  title: 'Create new note',
  description: 'Page for creating a new note',
  openGraph: {
    title: 'Create new note',
    description: 'Page for creating a new note',
    url: 'https://08-zustand-nu-liard.vercel.app/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Note HUB app image',
      },
    ],
  },
};


export default async function CreateNote() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  });

  const tags = await getTags();

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <NoteForm tags={tags} />
        </HydrationBoundary>
      </div>
    </main>
  );
}