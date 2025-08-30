import {api} from "@/lib/axios";
import {IChat} from "@/features/chat/interfaces/chat";

export async function listChats(memberId: string): Promise<IChat[]> {
  const response = await api.get(`/chat/${memberId}`, {
    withCredentials: true,
  });
  return response.data;
}

