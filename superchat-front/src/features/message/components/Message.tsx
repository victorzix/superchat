import {cn} from "@/lib/utils";
import {useUser} from "@/features/auth/hooks/useUser";
import {IMessage} from "@/features/message/interfaces/message";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useSelectedChat} from "@/features/chat/hooks/useChat";
import {FaClock} from "react-icons/fa";
import {format} from "date-fns";
import {MessageStatus} from "@/features/message/enums/MessageStatus";
import {FaCircleCheck} from "react-icons/fa6";

interface MessageProps {
  message: IMessage
}

export default function Message({message}: MessageProps) {
  const {user} = useUser();
  const {selectedChat} = useSelectedChat();

  const isOwnMessage = user?.id === message.senderId;
  const sender = selectedChat?.members.find(
    (member) => member.id === message.senderId
  );

  return (
    <div
      className={cn(
        "flex w-full items-end gap-2",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      {!isOwnMessage && (
        <Avatar className="w-6 h-6">
          <AvatarImage src={sender?.profilePicture} alt="avatar"/>
          <AvatarFallback className="truncate text-xs">
            {sender?.name?.[0]}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col text-white font-bold max-w-[50%] break-all whitespace-pre-wrap text-sm rounded-lg p-3",
          isOwnMessage ? "bg-blue-600" : "bg-gray-500"
        )}
      >
        {message.text}

        <div className='flex gap-2 items-center w-full justify-end'>
          <span
            className={cn('font-bold text-white bottom-2 text-xs text-gray-200 font-light', isOwnMessage ? 'right-2' : 'left-2')}>
            {format(message.createdAt, 'HH:mm')}
          </span>

          {isOwnMessage &&
              <span
                  className={cn(
                    'font-bold text-gray-200 bottom-2 text-xs transition-colors duration-300 ease-in-out',
                    isOwnMessage ? 'right-2' : 'left-2',
                    message.status === MessageStatus.DELIVERED && 'text-yellow-400',
                    message.status === MessageStatus.READ && 'text-green-400'
                  )}>
               {message.status === MessageStatus.PENDING && <FaClock/>}
                {(message.status === MessageStatus.SENT || message.status === MessageStatus.DELIVERED || message.status === MessageStatus.READ) &&
                    <FaCircleCheck/>
                }
              </span>
          }
        </div>
      </div>

      {isOwnMessage && (
        <Avatar className="w-6 h-6">
          <AvatarImage src={sender?.profilePicture} alt="avatar"/>
          <AvatarFallback className="truncate text-xs">
            {sender?.name?.[0]}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}