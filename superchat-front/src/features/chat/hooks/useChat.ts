import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import {listChats} from "@/features/chat/services/chatService";
import {useSelectedChatStore} from "@/features/chat/store/selectedChatStore";
import {IChat} from "@/features/chat/interfaces/chat";

export function useListChat(memberId: string, options?: Partial<UseQueryOptions<IChat[], Error, IChat[], [string, string]>>) {
  return useQuery({
    queryKey: ["listChats", memberId],
    queryFn: () => listChats(memberId),
    ...options,
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export function useSelectedChat() {
  const {selectedChat, setSelectedChat} = useSelectedChatStore();

  function setChat(chat: IChat) {
    if (selectedChat && selectedChat?.id === chat.id) {
      return;
    }

    setSelectedChat(chat);
  }

  return {setChat, selectedChat};
}