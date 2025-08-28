'use client'
import {useUser} from "@/features/auth/hooks/useUser";
import {useEffect} from "react";

export default function Dashboard() {
  const {user, getUser, logoutUser} = useUser();

  useEffect(() => {
    if (!user) {
      getUser().catch(async () => {
        await logoutUser();
      });
    }
  }, [user, getUser, logoutUser]);

  if (!user) return null;
  return (
    <>
      {user.phone}
    </>
  )
}