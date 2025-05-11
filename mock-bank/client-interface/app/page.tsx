import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-black-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Mock Bank</h1>
      <p className="text-lg mb-8">Your virtual banking experience starts here!</p>
      <p className="text-lg mb-8">Click the image below to go to the user page:</p>
      
      <Link href="/user">
        <Image
          src="/bank.png"
          alt="Bank Image"
          width={500}
          height={300}
          className="rounded-lg shadow-lg"
        />
      </Link>
    </div>
  );
}
