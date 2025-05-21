'use client';

import { useRouter } from 'next/navigation';

interface Props {
  userName: string;
  accountId: string;
}

export default function TransactionButtons({ userName,accountId }: Props) {
  const router = useRouter();

  const handleClick = (type: 'deposit' | 'withdraw' | 'transfer') => {
    router.push(`/transaction?user=${encodeURIComponent(userName)}&type=${type}&accountId=${accountId}`);
  };

  return (
    <div className="col-span-3 gap-6 bg-gray-50 p-4 rounded-lg flex justify-around">
      <button
        type="button"
        onClick={() => handleClick('deposit')}
        className="col-span-1 bg-blue-50 p-6 w-full font-bold hover:bg-black hover:text-white"
      >
        Deposit
      </button>
      <button
        type="button"
        onClick={() => handleClick('withdraw')}
        className="col-span-1 bg-blue-50 p-6 w-full font-bold hover:bg-black hover:text-white"
      >
        Withdraw
      </button>
      <button
        type="button"
        onClick={() => handleClick('transfer')} 
        className="col-span-1 bg-blue-100 p-6 w-full font-bold hover:bg-black hover:text-white"
      >
        Transfer
      </button>
    </div>
  );
}
