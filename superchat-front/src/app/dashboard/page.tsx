'use client'
import {useUser} from "@/features/auth/hooks/useUser";
import {useEffect, useState} from "react";
import MobileLayout from "@/features/dashboard/MobileLayout";
import {useIsMobile} from "@/hooks/useIsMobile";
import Sidebar from "@/features/dashboard/components/sidebar";
import RecentChats from "@/features/chat/components/recentChats";
import {useSidebar} from "@/features/dashboard/hooks/useSidebar";

export default function Dashboard() {
  const {user, getUser, logoutUser} = useUser();
  const {activeTab} = useSidebar();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!user) {
      getUser().catch(async () => {
        await logoutUser();
      });
    }
  }, [user, getUser, logoutUser]);

  if (!user) return null;

  if (isMobile) return <MobileLayout/>

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='w-4/5 h-[90%] rounded-lg shadow-2xl'>
        <Sidebar>
          {activeTab == 1 &&
              <RecentChats/>
          }
        </Sidebar>
      </div>
    </div>
  )
}