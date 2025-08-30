import {api} from '@/lib/axios';
import {UserPayload} from "@/types/auth";
import {RegisterFormData} from "@/features/auth/schemas/registerSchema";

export async function addContact(data: RegisterFormData) {

}

export async function listContact(): Promise<UserPayload> {
  const response = await api.get('/contact', {
    withCredentials: true,
  });
  return response.data;
}

