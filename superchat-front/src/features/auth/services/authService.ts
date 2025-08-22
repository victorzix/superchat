import {api} from '@/lib/axios';
import {LoginFormData} from '../schemas/loginSchema';
import {UserPayload} from "@/types/auth";

export async function login(data: LoginFormData) {
  const response = await api.post('/user/login', data);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post('/user/logout', {
    withCredentials: true,
  });
}

export async function getUserData(): Promise<UserPayload> {
  const response = await api.get('/user', {
    withCredentials: true,
  });
  return response.data;
}

