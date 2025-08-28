'use client'

import {useEffect} from "react";
import {useUser} from "@/features/auth/hooks/useUser";
import {useRouter} from "next/navigation";
import RegisterForm from "@/features/auth/components/register/RegisterForm";

export default function RegisterPage() {
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
        <RegisterForm/>
      </main>
    );
  }

  return null;
}
