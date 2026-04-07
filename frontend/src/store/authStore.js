import { create } from "zustand";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  loading: true,

  // 🔁 Rehydrate auth (same as your useEffect logic):
  // Rehydration = restoring state after app reload.
  bootstrapAuth: async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Not authenticated");

      const data = await res.json();

      set({
        user: data.user,
        accessToken: data.accessToken,
      });
    } catch {
      set({
        user: null,
        accessToken: null,
      });
    } finally {
      set({ loading: false });
    }
  },

  // 🔓 Logout (same as before)
  logout: async () => {
    await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    set({
      user: null,
      accessToken: null,
    });
  },

  // setters (same as context)
  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),
}));

export default useAuthStore;