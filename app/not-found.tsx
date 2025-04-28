// app/not-found.tsx
'use client';

import { Suspense } from 'react';

function NotFoundContent() {
  return <h1>Página não encontrada</h1>;
}

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
