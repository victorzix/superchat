import {useSelectedChat} from "@/features/chat/hooks/useChat";
import Header from "@/features/chat/components/chat/Header";
import {useSocket} from "@/hooks/useSocket";
import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {IMessage} from "@/features/message/interfaces/message";
import {useUser} from "@/features/auth/hooks/useUser";
import {MessageStatus} from "@/features/message/enums/MessageStatus";
import Message from "@/features/message/components/Message";
import {useMessage} from "@/features/message/hooks/useMessage";

export default function Chat() {
  const {user} = useUser();
  const {selectedChat} = useSelectedChat();
  const {messageHistory, getMessageHistory, isListMessagePending, handleSendMessage} = useMessage();
  const socket = useSocket();
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('message', (data: { message: IMessage }) => {
      handleSendMessage(data.message);
    });
  }, [socket, handleSendMessage]);

  useEffect(() => {
    if(selectedChat) getMessageHistory(selectedChat.id).catch(err => console.error(err))
  }, [selectedChat, getMessageHistory]);

  function sendMessage(msg: string) {
    if (!user || !selectedChat || !msg.trim()) return;

    const tempMessage: IMessage = {
      _id: `temp_id_${Date.now()}`,
      chatId: selectedChat.id,
      text: msg.trim(),
      senderId: user.id,
      createdAt: new Date(),
      status: MessageStatus.PENDING
    };

    // Adiciona mensagem temporária
    handleSendMessage(tempMessage);

    // Envia via socket
    socket.emit('message', {chatId: selectedChat.id, message: msg.trim()});
  }


  return (
    <div className='flex flex-col px-3 py-4 border-l w-full'>
      {selectedChat &&
          <>
              <Header chat={selectedChat}/>

              <div className='mt-auto flex flex-col gap-2'>
                {messageHistory.map((msg) => <Message key={msg._id} message={msg}/>)}
              </div>

              <div className='flex'>
                  <Input
                      placeholder='mensagem' onChange={e => setMessage(e.target.value)}/>
                  <Button onClick={() => sendMessage(message)}>Enviar</Button>
              </div>
          </>
      }
    </div>
  )
}