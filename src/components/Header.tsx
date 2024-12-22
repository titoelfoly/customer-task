import Image from "next/image";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

const Header = ({ session }: { session: Session | null }) => {
  return (
    <>
      {session && (
        <header className="flex items-center justify-start gap-3 font-black text-sky-600 space-y-4 bg-gray-100 w-full h-24">
          <Image
            src={session?.user?.image || ""}
            alt="Profile"
            width={54}
            height={54}
            className="rounded-full w-20 h-20 ml-4"
          />
          <div className="flex flex-col">
            <p>{session?.user?.email}</p>
            <p className="text-xl">
              Welcome, <strong>{session?.user?.name}</strong>
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 ml-auto mr-4"
          >
            Sign Out
          </button>
        </header>
      )}
    </>
  );
};

export default Header;
