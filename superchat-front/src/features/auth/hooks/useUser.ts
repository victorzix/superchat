import {getUserData, login, logout} from '../services/authService';
import {useRouter} from 'next/navigation';
import {LoginFormData} from '../schemas/loginSchema';
import {useAuthStore} from "@/store/authStore";
import {useStore} from "zustand/react";
import {useState} from "react";

export function useUser() {
  const router = useRouter();

  const {setUser, user} = useStore(useAuthStore);
  const [isPending, setIsPending] = useState(false);

  async function loginUser(data: LoginFormData) {
    setIsPending(true);
    try {
      await login(data);
      const userData = await getUserData();
      setUser(userData);
      router.push('/dashboard');
    } finally {
      setIsPending(false);
    }
  }

  async function logoutUser() {
    try {
      await logout();
    } finally {
      router.push('/login')
    }
  }

  async function getUser() {
    setIsPending(true)
    const userData = await getUserData();
    setUser(userData);
    setIsPending(false)
  }

  return {
    loginUser,
    user,
    logoutUser,
    isPending,
    getUser,
  }
}