import {IMessage} from "@/features/message/interfaces/message";
import {useCallback, useState} from "react";
import {listMessages} from "@/features/message/services/messageService";
import {MessageStatus} from "@/features/message/enums/MessageStatus";

export function useMessage() {
  const [isListMessagePending, setIsListMessagePending] = useState(false);
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([]);

  const getMessageHistory = useCallback(async (chatId: string): Promise<void> => {
    try {
      setIsListMessagePending(true);
      const messages = await listMessages(chatId);
      setMessageHistory(messages);
    } catch {
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

  const updateMessageStatus = useCallback((tempId: string, status: MessageStatus, newMessage?: IMessage) => {
    setMessageHistory(prev =>
      prev.map(msg =>
        msg._id === tempId
          ? { ...msg, status, _id: newMessage?._id ?? msg._id }
          : msg
      )
    );
  }, []);

  return {
    isListMessagePending,
    messageHistory,
    getMessageHistory,
    handleSendMessage,
    updateMessageStatus,
  }
}