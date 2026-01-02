'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getTags } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import NoteForm from '@/components/NoteForm/NoteForm';

export default function CreateNoteClient() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
    refetchOnMount: false,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return <p>Redirecting...</p>;
  }

  return <NoteForm tags={tags} />;
}