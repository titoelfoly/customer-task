"use client";
import LoginForm from "@/components/LoginForm";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  return (
    <SessionProvider>
      <LoginForm />
    </SessionProvider>
  );
}
