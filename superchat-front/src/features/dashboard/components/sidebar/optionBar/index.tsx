import {useUser} from "@/features/auth/hooks/useUser";
import {CiChat2, CiCircleList, CiLogout, CiSettings} from "react-icons/ci";
import {MdGroups2} from "react-icons/md";
import OptionBarButton from "@/features/dashboard/components/sidebar/optionBar/OptionBarButton";

export default function  OptionBar() {
  const {user, logoutUser} = useUser();

  if (!user) return null;

  return (
    <div className='w-auto h-full mt-auto h-auto p-4 flex flex-col gap-3 border-t py-8 border-r bg-gray-50'>
      <OptionBarButton icon={<CiChat2/>} tab={1}/>

      <OptionBarButton icon={<MdGroups2/>} tab={2}/>

      <OptionBarButton icon={<CiCircleList/>} tab={3}/>

      <OptionBarButton icon={<CiLogout/>} callback={logoutUser} className='mt-auto'/>

      <OptionBarButton icon={<CiSettings/>} tab={4} />
    </div>
  )
}