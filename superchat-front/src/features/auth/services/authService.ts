import {api} from '@/lib/axios';
import {LoginFormData} from '../schemas/loginSchema';
import {UserPayload} from "@/types/auth";
import {RegisterFormData} from "@/features/auth/schemas/registerSchema";

export async function register(data: RegisterFormData) {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("phone", data.phone);
  formData.append("password", data.password);

  if (data.profilePicture instanceof File) {
    formData.append("profilePicture", data.profilePicture);
  }

  const response = await api.post("/user", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

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

