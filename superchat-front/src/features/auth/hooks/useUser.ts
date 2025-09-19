import {getUserData, login, logout, register} from '../services/authService';
import {useRouter} from 'next/navigation';
import {LoginFormData} from '../schemas/loginSchema';
import {useAuthStore} from "@/store/authStore";
import {useStore} from "zustand/react";
import {useCallback, useState} from "react";
import {RegisterFormData} from "@/features/auth/schemas/registerSchema";
import {AxiosError} from "axios";
import {HookResponse} from "@/types/hookResponse";
import {handleError} from "@/utils/handleError";

export function useUser() {
  const router = useRouter();

  const {setUser, user, reset} = useStore(useAuthStore);
  const [isPending, setIsPending] = useState(false);

  async function registerUser(data: RegisterFormData): Promise<HookResponse> {
    try {
      setIsPending(true);
      const response = await register(data);
      setUser(response);
      router.push('/dashboard');
      return {data: undefined}
    } catch (error) {
      return {error: handleError(error)}
    } finally {
      setIsPending(false);
    }
  }

  async function loginUser(data: LoginFormData): Promise<HookResponse> {
    try {
      setIsPending(true);
      await login(data);
      const userData = await getUserData();
      setUser(userData);
      router.push('/dashboard');
      return {data: undefined};
    } catch (error) {
      return {error: handleError(error)}
    } finally {
      setIsPending(false);
    }
  }

  async function logoutUser() {
    try {
      await logout();
    } catch (err) {
      console.error(err)
    } finally {
      reset();
      router.push('/login')
    }
  }

  const getUser = useCallback(async () => {
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
  }, [setUser, reset, router])

  return {
    loginUser,
    user,
    logoutUser,
    isPending,
    getUser,
    registerUser,
  }
}