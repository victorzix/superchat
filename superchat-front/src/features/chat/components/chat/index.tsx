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
import {MessageType} from "@/features/message/enums/MessageType.enum";
import {sbClient} from "@/services/supabaseService";

export default function Chat() {
  const {user} = useUser();
  const {selectedChat} = useSelectedChat();
  const {
    messageHistory,
    getMessageHistory,
    handleSendMessage,
    updateMessageStatus
  } = useMessage();
  const socket = useSocket();
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('message', (data: { message: IMessage }) => {
      handleSendMessage(data.message);
    });
  }, [socket, handleSendMessage]);

  useEffect(() => {
    if (selectedChat) getMessageHistory(selectedChat.id).catch(err => console.error(err))
  }, [selectedChat, getMessageHistory]);

  function sendMessage(msg: string) {
    if (!user || !selectedChat || !msg.trim()) return;

    const tempId = `temp_id_${Date.now()}`
    const tempMessage: IMessage = {
      _id: tempId,
      chatId: selectedChat.id,
      text: msg.trim(),
      senderId: user.id,
      messageType: MessageType.TEXT,
      createdAt: new Date(),
      status: MessageStatus.PENDING
    };

    handleSendMessage(tempMessage);

    socket.emit('message', {chatId: selectedChat.id, messageText: msg.trim(), tempId, messageType: MessageType.TEXT});
  }

  useEffect(() => {
    socket.on('messageStatus', (data: { tempId: string; status: MessageStatus; messageText: IMessage }) => {
      updateMessageStatus(data.tempId, data.status, data.messageText);
    });

    return () => {
      socket.off('messageStatus');
    };
  }, [socket, updateMessageStatus])

  function sendFile(file: File) {
    if (!user || !selectedChat || !file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);

      const tempId = `temp_id_${Date.now()}`;

      const filePath = `chats/${selectedChat.id}/sender:${user.id}/${Date.now()}-${file.name}`;

      await sbClient.storage.from('superchat')
        .upload(filePath, Buffer.from(Array.from(uint8Array)), {
        contentType: file.type,
      });

      socket.emit('message', {
        chatId: selectedChat.id,
        tempId,
        messageType: file.type.startsWith('image/')
          ? MessageType.IMAGE
          : MessageType.FILE,
        fileType: file.type,
        filePath,
        fileName: file.name,
      });
    };
    reader.readAsArrayBuffer(file);
  }


  return (
    <div className='flex flex-col px-3 py-4 border-l w-full h-full'>
      {selectedChat &&
          <>
              <Header chat={selectedChat}/>

              <div className='mt-auto flex flex-col gap-2 w-full overflow-y-auto'>
                {messageHistory && messageHistory.map((msg) => <Message key={msg._id} message={msg}/>)}
              </div>

              <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      sendFile(e.target.files[0]);
                    }
                  }}
              />

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