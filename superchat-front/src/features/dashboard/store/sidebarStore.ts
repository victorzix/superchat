import {create} from "zustand";

interface IUseSidebarStore {
  activeTab: number,
  setActiveTab: (tab: number) => void,
}

export const useSidebarStore = create<IUseSidebarStore>((set) => ({
  activeTab: 1,
  setActiveTab: (tab: number) => set({activeTab: tab}),
}))