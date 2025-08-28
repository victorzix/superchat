import {useSidebarStore} from "@/features/dashboard/store/sidebarStore";

export function useSidebar() {
  const {activeTab, setActiveTab} = useSidebarStore();

  function setTab(tab: number) {
    if (activeTab === tab) {
      return;
    }
    setActiveTab(tab);
  }

  return {activeTab, setTab};
}