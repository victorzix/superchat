import {IChat} from "@/features/chat/interfaces/chat";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useUser} from "@/features/auth/hooks/useUser";

interface HeaderProps {
  chat: IChat;
}

export default function Header({chat}: HeaderProps) {
  const {user} = useUser();
  if (!chat || !user) return null;

  const chatMember = chat.members.find((chatMember) => user.id !== chatMember.id)
  return (
    <div className='w-full flex items-center gap-3 border-b py-3'>
      <Avatar className='w-12 h-12'>
        <AvatarImage src={chatMember?.profilePicture} alt="avatar"/>
        <AvatarFallback>{chatMember?.phone}</AvatarFallback>
      </Avatar>
      <span>{chatMember?.name}</span>
    </div>
  )
}