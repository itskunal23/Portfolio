import { create } from "zustand";
import { createDockSlice, type DockSlice } from "./slices/dock";
import { createUserSlice, type UserSlice } from "./slices/user";

export const useStore = create<DockSlice & UserSlice>((...a) => ({
  ...createDockSlice(...a),
  ...createUserSlice(...a)
}));
