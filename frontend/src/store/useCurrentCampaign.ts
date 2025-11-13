import { create } from "zustand";

type CurrentCampaignState = {
  currentCampaignId: string | null;
  setCurrentCampaign: (id: string | null) => void;
};

export const useCurrentCampaign = create<CurrentCampaignState>((set) => ({
  currentCampaignId: null,
  setCurrentCampaign: (id) => set({ currentCampaignId: id }),
}));
