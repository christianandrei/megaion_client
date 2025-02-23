import { create } from "zustand";

const useUserStore = create((set) => ({
  id: 1,
  name: "",
  type: "Admin",
  status: "For Verification",
  setUser: (user) => set((state) => ({ ...state, ...user })),
}));

export default useUserStore;
