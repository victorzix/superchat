import {ReactNode} from "react";
import Header from "@/features/dashboard/components/sidebar/Header";
import OptionBar from "@/features/dashboard/components/sidebar/optionBar";

interface SidebarProps {
  children: ReactNode;
}

export default function Sidebar({children}: SidebarProps) {
  return (
    <div className='w-2/5 h-full flex'>
      <OptionBar/>
      <div className='flex-1'>
        <Header/>
        <div>{children}</div>
      </div>
    </div>
  )
}