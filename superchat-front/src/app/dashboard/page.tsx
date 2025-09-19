'use client'
import {useUser} from "@/features/auth/hooks/useUser";
import {useEffect} from "react";
import MobileLayout from "@/features/dashboard/MobileLayout";
import {useIsMobile} from "@/hooks/useIsMobile";
import Sidebar from "@/features/dashboard/components/sidebar";
import RecentChats from "@/features/chat/components/recentChats";
import {useSidebar} from "@/features/dashboard/hooks/useSidebar";
import Chat from "@/features/chat/components/chat";
import {useSocket} from "@/hooks/useSocket";

export default function Dashboard() {
  const {user, getUser} = useUser();
  const {activeTab} = useSidebar();
  const isMobile = useIsMobile();

  const socket = useSocket();

  useEffect(() => {
    socket.on('connect', () => {
      socket?.emit('connectUser');
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (!user) {
      void getUser()
    }
  }, [user, getUser]);

  if (!user) return null;

  if (isMobile) return <MobileLayout/>

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='w-4/5 h-[90%] rounded-lg shadow-2xl flex'>
        <Sidebar>
          {activeTab == 1 &&
              <RecentChats/>
          }
        </Sidebar>
        {activeTab == 1 &&
            <Chat/>
        }
      </div>
    </div>
  )
}