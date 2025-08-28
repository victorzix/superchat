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

interface ChatListItemProps {
  chat: any // Will become Chat interface later
}

export default function ChatListItem({chat}: ChatListItemProps) {
  return (
    <li className='relative flex border-b w-full p-4 items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg'>
      <Avatar className='w-10 h-10'>
        <AvatarImage src={chat.picture ?? chat.receiver?.profilePicture} alt="avatar"/>
        <AvatarFallback>{chat.name ?? chat.receiver?.name}</AvatarFallback>
      </Avatar>

      <div className='flex flex-col truncate'>
        <span className='text-md font-semibold'>{chat.name ?? chat.receiver?.name}</span>
        <span
          className='text-sm font-light'>{chat.isGroup && chat.lastSender.name + ':'} Last message</span> {/* TBD */}
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