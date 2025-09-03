import {cn} from "@/lib/utils";
import {useUser} from "@/features/auth/hooks/useUser";
import {IMessage} from "@/features/message/interfaces/message";

interface MessageProps {
  message: IMessage
}

export default function Message({message}: MessageProps) {
  const {user} = useUser();
  return (
    <div className={cn(
      "flex w-full",
      user?.id === message.senderId ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "text-white font-bold w-1/2 rounded-sm p-3",
        user?.id === message.senderId ? "bg-blue-600" : "bg-gray-500"
      )}>
        {message.text}
      </div>
    </div>
  )
}