'use client'

import {LoginForm} from "@/features/auth/components/login/LoginForm";
import {useEffect} from "react";
import {useUser} from "@/features/auth/hooks/useUser";
import {useRouter} from "next/navigation";

export default function LoginPage() {
  const {user, isPending} = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user && !isPending) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <LoginForm/>
      </main>
    );
  }

  return null;
}
