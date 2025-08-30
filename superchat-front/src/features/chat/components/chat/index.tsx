import {useSelectedChat} from "@/features/chat/hooks/useChat";
import Header from "@/features/chat/components/chat/Header";
import {useSocket} from "@/hooks/useSocket";
import {Input} from "@/components/ui/input";
import {useState} from "react";

export default function Chat() {
  const {selectedChat} = useSelectedChat();
  const socket = useSocket();
  const [message, setMessage] = useState('');

  function sendMessage(msg: string) {
    socket.emit('mensagem', {chatId: selectedChat?.id, message: msg});
  }

  return (
    <div className='flex flex-col px-3 py-4 border-l w-full'>
      {selectedChat &&
          <>
              <Header chat={selectedChat}/>
              Mensagens
              <Input placeholder='mensagem' onChange={e => setMessage(e.target.value)}/>
              <button onClick={() => sendMessage(message)}>Enviar</button>
          </>
      }
    </div>
  )
}