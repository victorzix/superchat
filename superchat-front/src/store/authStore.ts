import {UserPayload} from "@/types/auth";
import {createStore} from "zustand/vanilla";
import {persist} from "zustand/middleware";

export const useAuthStore = createStore(
  persist<{
    user: UserPayload | null;
    setUser: (data: UserPayload) => void;
    reset: () => void;
  }>(
    (set) => ({
      user: null,
      reset: (() => set({user: null})),
      setUser: (data) => set({user: data}),
    }),
    {
      name: "auth",
    },
  )
);