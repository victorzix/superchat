'use client'

import {ReactNode} from "react";
import {useSidebar} from "@/features/dashboard/hooks/useSidebar";
import {cn} from "@/lib/utils";

interface OptionBarButtonProps {
  icon: ReactNode,
  className?: string,
  tab: number,
}

export default function OptionBarButton({icon, className, tab}: OptionBarButtonProps) {
  const {setTab, activeTab} = useSidebar();

  return (
    <button
      onClick={() => setTab(tab)}
      className={cn('enabled:hover:bg-gray-200 rounded-full p-1 text-xl enabled:cursor-pointer enabled:hover:scale-110 transition-all ease-in-out duration-200', className, activeTab === tab && 'bg-gray-200 scale-110')}>
      {icon}
    </button>
  )
}