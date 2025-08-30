import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ChevronDownIcon, TrashIcon} from "lucide-react";
import {BiBell, BiBlock, BiPin} from "react-icons/bi";
import {IChat} from "@/features/chat/interfaces/chat";
import {useUser} from "@/features/auth/hooks/useUser";
import {useSelectedChat} from "@/features/chat/hooks/useChat";
import {cn} from "@/lib/utils";

interface ChatListItemProps {
  chat: IChat
}

export default function ChatListItem({chat}: ChatListItemProps) {
  const {user} = useUser();
  const {setChat, selectedChat} = useSelectedChat();

  if (!user) return null;

  const chatMember = chat.members.find((chatMember) => user.id !== chatMember.id)

  return (
    <li className={cn('relative flex border-b w-full p-4 items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg', selectedChat && selectedChat.id === chat.id && 'bg-gray-100')} onClick={() => setChat(chat)}>
      <Avatar className='w-10 h-10'>
        <AvatarImage src={chatMember?.profilePicture} alt="avatar"/>
        <AvatarFallback>{chatMember?.phone}</AvatarFallback>
      </Avatar>

      <div className='flex flex-col truncate'>
        <span className='text-md font-semibold'>{chatMember?.name}</span>
        <span
          className='text-sm font-light'>Last message</span> {/* TBD */}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild className='absolute right-5 bottom-4' onClick={(e) => e.preventDefault()}>
          <ChevronDownIcon
            className="-me-1 opacity-60"
            size={16}
            aria-hidden="true"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BiBell className="opacity-60" aria-hidden="true"/>
              Silenciar {/* Add logic to unmute */}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BiPin className="opacity-60" aria-hidden="true"/>
              Fixar {/* Add logic to unpin */}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator/>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BiBlock className="opacity-60" aria-hidden="true"/>
              Bloquear
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <TrashIcon aria-hidden="true"/>
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}