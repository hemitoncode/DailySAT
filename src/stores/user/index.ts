// local instance of user (to be shared amongst different react components)

import { create } from "zustand";
import { User } from "@/shared/types/user";

interface UserStoreProp {
  user: User | null;
  setUser: (newUser: User | null) => void;
  updateUser: (partial: Partial<User>) => void;
}

export const useUserStore = create<UserStoreProp>((set) => ({
  user: null,
  setUser: (newData: User | null) => set(() => ({ user: newData })),
  updateUser: (partial: Partial<User>) =>
    set((state) =>
      state.user
        ? { user: { ...state.user, ...partial } }
        : { user: state.user },
    ),
}));
