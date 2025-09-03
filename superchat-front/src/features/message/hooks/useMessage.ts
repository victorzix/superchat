import {IMessage} from "@/features/message/interfaces/message";
import {useCallback, useState} from "react";
import {listMessages} from "@/features/message/services/messageService";

export function useMessage() {
  const [isListMessagePending, setIsListMessagePending] = useState(false);
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([]);

  const getMessageHistory = useCallback(async (chatId: string): Promise<void> => {
    try {
      setIsListMessagePending(true);
      const messages = await listMessages(chatId);
      setMessageHistory(messages);
    } catch (err) {
      setMessageHistory([])
    } finally {
      setIsListMessagePending(false);
    }
  }, [])

  const handleSendMessage = useCallback((message: IMessage) => {
    setMessageHistory(prev => {
      const exists = prev.some(msg => msg._id === message._id);
      if (exists) return prev;
      return [...prev, message];
    });
  }, [])

  return {
    isListMessagePending,
    messageHistory,
    getMessageHistory,
    handleSendMessage,
  }
}