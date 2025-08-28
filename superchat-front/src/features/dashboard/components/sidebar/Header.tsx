import {useUser} from "@/features/auth/hooks/useUser";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {withMask} from "use-mask-input";

export default function Header() {
  const {user} = useUser();

  if (!user) return null;

  return (
    <div className='w-full h-auto p-4 flex flex-col gap-2 border-b'>
      <Avatar className='w-14 h-14'>
        <AvatarImage src={user.profilePicture} alt="avatar"/>
        <AvatarFallback>{user.name}</AvatarFallback>
      </Avatar>
      <h2 className='uppercase text-sm font-bold'>{user.name}</h2>
      <span ref={withMask('(99) 99999-9999')} className='text-xs text-gray-500'>{user.phone}</span>
    </div>
  )
}