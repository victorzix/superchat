import {getUserData, login, logout, register} from '../services/authService';
import {useRouter} from 'next/navigation';
import {LoginFormData} from '../schemas/loginSchema';
import {useAuthStore} from "@/store/authStore";
import {useStore} from "zustand/react";
import {useState} from "react";
import {RegisterFormData} from "@/features/auth/schemas/registerSchema";

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
    registerUser,
  }
}