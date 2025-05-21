import { Suspense } from 'react';
import TransactionPage from './TransactionClient';

export default function Transaction() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionPage />
    </Suspense>
  );
}
