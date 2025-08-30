import {IChat} from "@/features/chat/interfaces/chat";
import {create} from "zustand";

interface IUseSelectedChatStore {
  selectedChat: IChat | null,
  setSelectedChat: (chat: IChat) => void,
}

export const useSelectedChatStore = create<IUseSelectedChatStore>((set) => ({
  selectedChat: null,
  setSelectedChat: (chat: IChat) => set({selectedChat: chat}),
}))