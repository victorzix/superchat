import ChatListItem from "@/features/chat/components/recentChats/ChatListItem";
import {useListChat} from "@/features/chat/hooks/useChat";
import {useUser} from "@/features/auth/hooks/useUser";

export default function RecentChats() {const {user} = useUser();
  const {data: chats, isPending, error} = useListChat(user?.id || '', {
    enabled: !!user
  })



  return (
    <ol className='px-3 py-1'>
      {chats && chats.map(chat => <ChatListItem key={chat.id} chat={chat}/>)}
    </ol>
  )
}