import NotePreviewClient from './NotePreview.client';

interface NotePreviewPageProps {
  params: {
    id: string;
  };
}

export default function NotePreviewPage({ params }: NotePreviewPageProps) {
  return <NotePreviewClient params={params} />;
}