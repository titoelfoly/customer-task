import { signIn, useSession, signOut } from "next-auth/react";
import Image from "next/image";

const LoginForm = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-xl">
          Welcome, <strong>{session?.user?.name}</strong>
        </p>
        <Image
          src={session?.user?.image || ""}
          alt="Profile"
          width={54}
          height={54}
          className="rounded-full w-20 h-20"
        />
        <p>{session?.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-semibold">Login to Your Account</h1>
      <button
        onClick={() =>
          signIn("google", {
            callbackUrl: "/",
            redirect: true,
            prompt: "select_account",
          })
        }
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginForm;
