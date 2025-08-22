'use client'

import {useUser} from "@/features/auth/hooks/useUser";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function Home() {
  const router = useRouter();
  const {user} = useUser()

  useEffect(() => {
    console.log(user)
    if (user) router.push('/dashboard');
    else router.push('/login');
  }, [user]);

  return (
    <div>
    </div>
  );
}