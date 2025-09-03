import {api} from "@/lib/axios";
import {IMessage} from "@/features/message/interfaces/message";

export async function listMessages(chatId: string): Promise<IMessage[]> {
  const response = await api.get(`/message/${chatId}`, {
    withCredentials: true,
  });

  return response.data;
}

