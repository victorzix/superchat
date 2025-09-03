import {getUserData, login, logout, register} from '../services/authService';
import {useRouter} from 'next/navigation';
import {LoginFormData} from '../schemas/loginSchema';
import {useAuthStore} from "@/store/authStore";
import {useStore} from "zustand/react";
import {useState} from "react";
import {RegisterFormData} from "@/features/auth/schemas/registerSchema";
import {AxiosError} from "axios";

export function useUser() {
  const router = useRouter();

  const {setUser, user, reset} = useStore(useAuthStore);
  const [isPending, setIsPending] = useState(false);

  async function registerUser(data: RegisterFormData) {
    setIsPending(true);
    try {
      const response = await register(data);
      setUser(response);
      router.push('/dashboard');
    } finally {
      setIsPending(false);
    }
  }

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
      reset();
      await logout();
    } finally {
      router.push('/login')
    }
  }

  async function getUser() {
    try {
      setIsPending(true)
      const userData = await getUserData();
      setUser(userData);
    } catch (err) {
      if (err instanceof AxiosError && err.status === 401) {
        reset();
        router.push('/login')
      }
    } finally {
      setIsPending(false)
    }
  }

  return {
    loginUser,
    user,
    logoutUser,
    isPending,
    getUser,
    registerUser,
  }
}